import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type WalletType = 'MetaMask' | 'Coinbase Wallet' | 'Phantom' | 'WalletConnect' | 'Ledger' | null;

interface WalletInfo {
  type: WalletType;
  address: string;
  balance: string; // in ETH
}

interface AuthContextType {
  wallet: WalletInfo | null;
  isWalletConnected: boolean;
  connectWallet: (walletType: WalletType) => Promise<void>;
  disconnectWallet: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulate a random ETH address
const mockAddress = () => {
  const hex = '0123456789ABCDEF';
  const addr = Array.from({ length: 40 }, () => hex[Math.floor(Math.random() * 16)]).join('');
  return `0x${addr.slice(0, 4)}…${addr.slice(-4)}`;
};

const mockBalance = () => (Math.random() * 50 + 1).toFixed(2);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);

  const connectWallet = async (walletType: WalletType): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1800));
    setWallet({
      type: walletType,
      address: mockAddress(),
      balance: mockBalance(),
    });
  };

  const disconnectWallet = () => {
    setWallet(null);
  };

  return (
    <AuthContext.Provider
      value={{
        wallet,
        isWalletConnected: !!wallet,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
