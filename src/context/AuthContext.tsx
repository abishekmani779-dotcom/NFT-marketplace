import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type WalletType = 'MetaMask' | 'Coinbase Wallet' | 'Phantom' | 'WalletConnect' | 'Ledger' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  kycVerified: boolean;
  isOnboarded: boolean;
}

interface WalletInfo {
  type: WalletType;
  address: string;
  balance: string;
}

interface AuthContextType {
  user: User | null;
  wallet: WalletInfo | null;
  isAuthenticated: boolean;
  isWalletConnected: boolean;
  login: (userData: User) => void;
  logout: () => void;
  completeOnboarding: () => void;
  connectWallet: (walletType: WalletType) => Promise<void>;
  disconnectWallet: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockAddress = () => {
  const hex = '0123456789ABCDEF';
  const addr = Array.from({ length: 40 }, () => hex[Math.floor(Math.random() * 16)]).join('');
  return `0x${addr.slice(0, 4)}…${addr.slice(-4)}`;
};

const mockBalance = () => (Math.random() * 50 + 1).toFixed(2);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [wallet, setWallet] = useState<WalletInfo | null>(null);

  const login = (userData: User) => setUser(userData);

  const logout = () => {
    setUser(null);
    setWallet(null);
  };

  const completeOnboarding = () => {
    if (user) setUser({ ...user, isOnboarded: true });
  };

  const connectWallet = async (walletType: WalletType): Promise<void> => {
    await new Promise(r => setTimeout(r, 1800));
    setWallet({ type: walletType, address: mockAddress(), balance: mockBalance() });
  };

  const disconnectWallet = () => setWallet(null);

  return (
    <AuthContext.Provider value={{
      user,
      wallet,
      isAuthenticated: !!user && user.isOnboarded,
      isWalletConnected: !!wallet,
      login,
      logout,
      completeOnboarding,
      connectWallet,
      disconnectWallet,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
