import type { Metadata } from 'next';
import './globals.css';
import ClientProviders from '@/providers/ClientProviders';

export const metadata: Metadata = {
  title: 'SODAX | Cross-Chain Swap',
  description: 'Cross-chain swap between SOL and ETH powered by SODAX Solver',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
