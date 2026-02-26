'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  useXConnectors,
  useXConnect,
  useXAccount,
  useXDisconnect,
  useWalletProvider,
} from '@sodax/wallet-sdk';
import { useSpokeProvider, useSwap } from '@sodax/dapp-kit';
import type { SpokeChainId } from '@sodax/types';
import type { CreateIntentParams } from '@sodax/sdk';
import { TOKENS, SWAP_STATES, type TokenSymbol, type SwapState } from '@/config/tokens';
import { useSwapQuote } from '@/hooks/useSwapQuote';
import SwapInput from './SwapInput';
import SwapArrow from './SwapArrow';
import QuoteDetails from './QuoteDetails';
import StatusBanner from './StatusBanner';

function formatAmount(value: string | number, decimals = 6) {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (!num || isNaN(num)) return '0.00';
  if (num === 0) return '0.00';
  if (num < 0.000001) return '<0.000001';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  });
}

export default function SodaxSwap() {
  const [fromToken, setFromToken] = useState<TokenSymbol>('SOL');
  const [toToken, setToToken] = useState<TokenSymbol>('ETH');
  const [inputAmount, setInputAmount] = useState('');
  const [swapState, setSwapState] = useState<SwapState>(SWAP_STATES.IDLE);
  const [expandedQuote, setExpandedQuote] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Wallet hooks
  const solanaConnectors = useXConnectors('SOLANA');
  const evmConnectors = useXConnectors('EVM');
  const { mutateAsync: connectWallet } = useXConnect();
  const solanaAccount = useXAccount('SOLANA');
  const evmAccount = useXAccount('EVM');
  const disconnectWallet = useXDisconnect();

  // Determine which chain type is needed based on source token
  const sourceChainType = TOKENS[fromToken].chainId === 'solana' ? 'SOLANA' : 'EVM';
  const sourceAccount = sourceChainType === 'SOLANA' ? solanaAccount : evmAccount;
  const walletConnected = !!sourceAccount?.address;

  // Get wallet provider and spoke provider for the source chain
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const walletProvider = useWalletProvider(
    walletConnected ? (TOKENS[fromToken].chainId as any) : undefined
  );
  const spokeProvider = useSpokeProvider(
    walletConnected ? (TOKENS[fromToken].chainId as SpokeChainId) : undefined,
    walletProvider ?? undefined
  );

  // Swap mutation from dapp-kit
  const { mutateAsync: executeSwap, isPending: swapPending } = useSwap(spokeProvider ?? undefined);

  // Quote from SODAX SDK
  const { quote, loading: quoteLoading, error: quoteError } = useSwapQuote(
    fromToken,
    toToken,
    inputAmount
  );

  const handleFlip = useCallback(() => {
    const oldFrom = fromToken;
    const oldTo = toToken;
    setFromToken(oldTo);
    setToToken(oldFrom);
    if (quote) {
      setInputAmount(quote.outputAmount);
    }
  }, [fromToken, toToken, quote]);

  const handleFromTokenChange = (sym: TokenSymbol) => {
    if (sym === toToken) {
      handleFlip();
    } else {
      setFromToken(sym);
    }
  };

  const handleToTokenChange = (sym: TokenSymbol) => {
    if (sym === fromToken) {
      handleFlip();
    } else {
      setToToken(sym);
    }
  };

  const handleConnectWallet = async () => {
    setSwapState(SWAP_STATES.CONNECTING);
    try {
      const connectors = sourceChainType === 'SOLANA' ? solanaConnectors : evmConnectors;
      if (connectors.length > 0) {
        await connectWallet(connectors[0]);
      }
      setSwapState(SWAP_STATES.IDLE);
    } catch {
      setSwapState(SWAP_STATES.ERROR);
      setTimeout(() => setSwapState(SWAP_STATES.IDLE), 3000);
    }
  };

  const handleSwap = async () => {
    if (!walletConnected) {
      await handleConnectWallet();
      return;
    }

    if (!quote || !sourceAccount?.address) return;

    const from = TOKENS[fromToken];
    const to = TOKENS[toToken];
    const inputNum = parseFloat(inputAmount);
    const scaledInput = BigInt(Math.floor(inputNum * 10 ** from.decimals));
    const outputNum = parseFloat(quote.outputAmount);
    // Allow 1% slippage
    const minOutput = BigInt(Math.floor(outputNum * 0.99 * 10 ** to.decimals));

    const intentParams: CreateIntentParams = {
      inputToken: from.spokeAddress,
      outputToken: to.spokeAddress,
      inputAmount: scaledInput,
      minOutputAmount: minOutput,
      deadline: 0n,
      allowPartialFill: false,
      srcChain: from.chainId as SpokeChainId,
      dstChain: to.chainId as SpokeChainId,
      srcAddress: sourceAccount.address,
      dstAddress: sourceAccount.address,
      solver: '0x0000000000000000000000000000000000000000',
      data: '0x',
    };

    setSwapState(SWAP_STATES.CONFIRMING);
    try {
      setSwapState(SWAP_STATES.SWAPPING);
      const result = await executeSwap(intentParams);
      if (result.ok) {
        setSwapState(SWAP_STATES.SUCCESS);
        setTimeout(() => {
          setSwapState(SWAP_STATES.IDLE);
          setInputAmount('');
        }, 4000);
      } else {
        setSwapState(SWAP_STATES.ERROR);
        setTimeout(() => setSwapState(SWAP_STATES.IDLE), 4000);
      }
    } catch {
      setSwapState(SWAP_STATES.ERROR);
      setTimeout(() => setSwapState(SWAP_STATES.IDLE), 4000);
    }
  };

  const isSwapDisabled =
    !inputAmount ||
    parseFloat(inputAmount) <= 0 ||
    quoteLoading ||
    [SWAP_STATES.CONNECTING, SWAP_STATES.CONFIRMING, SWAP_STATES.SWAPPING].includes(
      swapState as typeof SWAP_STATES.CONNECTING
    );

  const buttonLabel = !walletConnected
    ? 'Connect Wallet'
    : !inputAmount || parseFloat(inputAmount) <= 0
      ? 'Enter Amount'
      : quoteLoading
        ? 'Fetching Quote...'
        : swapState === SWAP_STATES.SWAPPING
          ? 'Swapping...'
          : swapState === SWAP_STATES.CONFIRMING
            ? 'Confirm in Wallet'
            : `Swap ${fromToken} → ${toToken}`;

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(165deg, #0a1a0a 0%, #0d1f0d 30%, #0a170a 60%, #091209 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'DM Sans', sans-serif",
        color: '#e8f5e9',
        padding: '20px 16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow effects */}
      <div
        style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(46,125,50,0.06) 0%, transparent 70%)',
          top: '10%',
          left: '20%',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(102,187,106,0.04) 0%, transparent 70%)',
          bottom: '15%',
          right: '15%',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 32,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(-12px)',
          transition: 'all 0.6s ease 0.1s',
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #2e7d32, #43a047)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            fontWeight: 800,
            color: '#e8f5e9',
            boxShadow: '0 4px 16px rgba(46,125,50,0.3)',
          }}
        >
          S
        </div>
        <div>
          <div
            style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}
          >
            SODAX
          </div>
          <div
            style={{
              fontSize: 11,
              color: '#66bb6a',
              fontWeight: 500,
              letterSpacing: '0.08em',
            }}
          >
            CROSS-CHAIN SWAP
          </div>
        </div>
        {/* Wallet status indicator */}
        {walletConnected && sourceAccount?.address && (
          <div
            style={{
              marginLeft: 'auto',
              padding: '6px 12px',
              background: 'rgba(102,187,106,0.08)',
              border: '1px solid rgba(102,187,106,0.2)',
              borderRadius: 20,
              fontSize: 12,
              color: '#81c784',
              cursor: 'pointer',
            }}
            onClick={() => disconnectWallet(sourceChainType)}
          >
            {sourceAccount.address.slice(0, 6)}...{sourceAccount.address.slice(-4)}
          </div>
        )}
      </div>

      {/* Swap Card */}
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          background:
            'linear-gradient(180deg, rgba(20,35,20,0.95) 0%, rgba(15,28,15,0.98) 100%)',
          border: '1px solid rgba(129,199,132,0.08)',
          borderRadius: 24,
          padding: '24px 20px',
          backdropFilter: 'blur(20px)',
          boxShadow:
            '0 24px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(129,199,132,0.04) inset',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(16px)',
          transition: 'all 0.6s ease 0.2s',
          position: 'relative',
        }}
      >
        {/* Subtle top highlight */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '15%',
            right: '15%',
            height: 1,
            background:
              'linear-gradient(90deg, transparent, rgba(102,187,106,0.15), transparent)',
          }}
        />

        {/* From input */}
        <SwapInput
          token={fromToken}
          amount={inputAmount}
          onAmountChange={setInputAmount}
          onTokenChange={handleFromTokenChange}
          label="You pay"
        />

        {/* Swap direction arrow */}
        <SwapArrow onClick={handleFlip} />

        {/* To input */}
        <SwapInput
          token={toToken}
          amount={quote ? formatAmount(quote.outputAmount, 8) : ''}
          onAmountChange={() => {}}
          onTokenChange={handleToTokenChange}
          label="You receive"
          readOnly
        />

        {/* Quote loading indicator */}
        {quoteLoading && inputAmount && parseFloat(inputAmount) > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 0 4px',
              color: '#81c784',
              fontSize: 13,
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                border: '2px solid rgba(129,199,132,0.2)',
                borderTopColor: '#81c784',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            Fetching best quote via SODAX Solver...
          </div>
        )}

        {/* Quote error */}
        {quoteError && (
          <div
            style={{
              padding: '8px 0',
              color: '#ef5350',
              fontSize: 12,
            }}
          >
            {quoteError}
          </div>
        )}

        {/* Quote details */}
        <QuoteDetails
          quote={quote}
          expanded={expandedQuote}
          setExpanded={setExpandedQuote}
        />

        {/* Status banner */}
        <div style={{ marginTop: 8 }}>
          <StatusBanner state={swapState} />
        </div>

        {/* Swap button */}
        <button
          onClick={handleSwap}
          disabled={walletConnected && isSwapDisabled}
          style={{
            width: '100%',
            padding: '16px 20px',
            marginTop: 16,
            background:
              walletConnected && isSwapDisabled
                ? 'rgba(129,199,132,0.08)'
                : 'linear-gradient(135deg, #2e7d32 0%, #388e3c 50%, #43a047 100%)',
            border: 'none',
            borderRadius: 16,
            color:
              walletConnected && isSwapDisabled
                ? 'rgba(129,199,132,0.4)'
                : '#e8f5e9',
            fontSize: 16,
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            cursor:
              walletConnected && isSwapDisabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.25s ease',
            boxShadow:
              walletConnected && isSwapDisabled
                ? 'none'
                : '0 8px 32px rgba(46,125,50,0.25)',
            letterSpacing: '-0.01em',
          }}
          onMouseEnter={(e) => {
            if (!(walletConnected && isSwapDisabled)) {
              e.currentTarget.style.boxShadow =
                '0 12px 40px rgba(46,125,50,0.35)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={(e) => {
            if (!(walletConnected && isSwapDisabled)) {
              e.currentTarget.style.boxShadow =
                '0 8px 32px rgba(46,125,50,0.25)';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          {buttonLabel}
        </button>
      </div>

      {/* Footer info */}
      <div
        style={{
          marginTop: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          fontSize: 11,
          color: 'rgba(129,199,132,0.35)',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.6s ease 0.5s',
        }}
      >
        <span>Powered by SODAX Solver</span>
        <span>&bull;</span>
        <span>17+ Networks</span>
        <span>&bull;</span>
        <span>Intent-Based Execution</span>
      </div>
    </div>
  );
}
