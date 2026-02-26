'use client';

import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { XWagmiProviders } from '@sodax/wallet-sdk';
import { SodaxProvider } from '@sodax/dapp-kit';

// Use string literals to avoid type version mismatches between
// @sodax/types@1.2.4-beta and the older types bundled in @sodax/wallet-sdk
const ETHEREUM_CHAIN_ID = 'ethereum';
const SOLANA_CHAIN_ID = 'solana';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const xConfig: any = {
  EVM: {
    chains: [ETHEREUM_CHAIN_ID],
  },
  SOLANA: {
    endpoint: 'https://api.mainnet-beta.solana.com',
  },
};

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <XWagmiProviders config={xConfig}>
        <SodaxProvider rpcConfig={{
          [ETHEREUM_CHAIN_ID]: 'https://eth.llamarpc.com',
          [SOLANA_CHAIN_ID]: 'https://api.mainnet-beta.solana.com',
        }}>
          {children}
        </SodaxProvider>
      </XWagmiProviders>
    </QueryClientProvider>
  );
}
