// Type definitions for the banking app

export interface User {
  id: string;
  username: string;
  fullName: string;
}

export interface Account {
  id: string;
  accountNumber: string;
  type: 'savings' | 'current';
  balance: number;
  userId: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  date: Date;
  balanceAfter: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}