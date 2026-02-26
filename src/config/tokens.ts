import {
  SOLANA_MAINNET_CHAIN_ID,
  ETHEREUM_MAINNET_CHAIN_ID,
} from '@sodax/types';

export type TokenSymbol = 'SOL' | 'ETH';

export interface TokenConfig {
  symbol: TokenSymbol;
  name: string;
  decimals: number;
  icon: string;
  chainName: string;
  chainId: string;
  spokeAddress: string;
  nativeAddress: string;
  color: string;
}

export const TOKENS: Record<TokenSymbol, TokenConfig> = {
  SOL: {
    symbol: 'SOL',
    name: 'Solana',
    decimals: 9,
    icon: '◎',
    chainName: 'Solana',
    chainId: SOLANA_MAINNET_CHAIN_ID,
    spokeAddress: '0x0c09e69a4528945de6d16c7e469dea6996fdf636',
    nativeAddress: 'So11111111111111111111111111111111111111112',
    color: '#9945FF',
  },
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    icon: 'Ξ',
    chainName: 'Ethereum',
    chainId: ETHEREUM_MAINNET_CHAIN_ID,
    spokeAddress: '0xaeafa26e43f46cd83efe89b1e57c858eb5685a24',
    nativeAddress: '0x0000000000000000000000000000000000000000',
    color: '#627EEA',
  },
};

export const SWAP_STATES = {
  IDLE: 'idle',
  QUOTING: 'quoting',
  QUOTED: 'quoted',
  CONNECTING: 'connecting',
  CONFIRMING: 'confirming',
  SWAPPING: 'swapping',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export type SwapState = (typeof SWAP_STATES)[keyof typeof SWAP_STATES];
