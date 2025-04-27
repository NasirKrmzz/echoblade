import { Wallet } from '@mysten/wallet-adapter-react';

declare module '@mysten/wallet-adapter-react' {
  interface Wallet {
    icon: string;
  }
} 