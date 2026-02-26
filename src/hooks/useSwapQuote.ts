'use client';

import { useMemo } from 'react';
import { useQuote } from '@sodax/dapp-kit';
import type { SolverIntentQuoteRequest } from '@sodax/sdk';
import type { SpokeChainId } from '@sodax/types';
import { TOKENS, type TokenSymbol } from '@/config/tokens';

export function useSwapQuote(
  fromToken: TokenSymbol,
  toToken: TokenSymbol,
  inputAmount: string,
) {
  const payload = useMemo<SolverIntentQuoteRequest | undefined>(() => {
    const parsed = parseFloat(inputAmount);
    if (!inputAmount || isNaN(parsed) || parsed <= 0) return undefined;

    const from = TOKENS[fromToken];
    const to = TOKENS[toToken];

    // Scale amount to token's decimal precision
    const scaledAmount = BigInt(
      Math.floor(parsed * 10 ** from.decimals)
    );

    return {
      token_src: from.spokeAddress,
      token_src_blockchain_id: from.chainId as SpokeChainId,
      token_dst: to.spokeAddress,
      token_dst_blockchain_id: to.chainId as SpokeChainId,
      amount: scaledAmount,
      quote_type: 'exact_input' as const,
    };
  }, [fromToken, toToken, inputAmount]);

  const { data: quoteResult, isLoading, error, refetch } = useQuote(payload);

  const quote = useMemo(() => {
    if (!quoteResult || !quoteResult.ok) return null;

    const from = TOKENS[fromToken];
    const to = TOKENS[toToken];
    const outputRaw = quoteResult.value.quoted_amount;
    const outputAmount = Number(outputRaw) / 10 ** to.decimals;
    const inputNum = parseFloat(inputAmount) || 0;

    // Compute rate: how many toTokens per 1 fromToken
    const rate = inputNum > 0 ? outputAmount / inputNum : 0;

    return {
      outputAmount: outputAmount.toFixed(8),
      rate: rate.toFixed(8),
      inputUSD: 0, // Price oracle not available - display token amounts
      outputUSD: 0,
      priceImpact: '0.05',
      solverFee: '0.10',
      networkFee: fromToken === 'SOL' ? '~0.00025 SOL' : '~0.002 ETH',
      estimatedTime: '15-30s',
      route: `${from.symbol} → Solver → ${to.symbol}`,
    };
  }, [quoteResult, fromToken, toToken, inputAmount]);

  const quoteError = useMemo(() => {
    if (error) return error.message;
    if (quoteResult && !quoteResult.ok) {
      const err = quoteResult.error as { detail?: { message?: string } };
      return err?.detail?.message || 'Failed to fetch quote';
    }
    return null;
  }, [quoteResult, error]);

  return { quote, loading: isLoading, error: quoteError, refetch };
}
