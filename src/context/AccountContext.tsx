import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Account, Transaction } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface AccountContextType {
  accounts: Account[];
  currentAccount: Account | null;
  transactions: Transaction[];
  createAccount: (type: 'savings' | 'current', userId: string) => Promise<void>;
  selectAccount: (accountId: string) => void;
  deposit: (amount: number) => Promise<void>;
  withdraw: (amount: number) => Promise<void>;
  getBalance: () => number;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (user) {
      loadAccounts();
    } else {
      setAccounts([]);
      setCurrentAccount(null);
      setTransactions([]);
    }
  }, [user]);

  useEffect(() => {
    if (currentAccount) {
      loadTransactions(currentAccount.id);
    }
  }, [currentAccount]);

  const loadAccounts = async () => {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading accounts:', error);
      return;
    }

    setAccounts(data);
    if (data.length > 0 && !currentAccount) {
      setCurrentAccount(data[0]);
    }
  };

  const loadTransactions = async (accountId: string) => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('account_id', accountId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading transactions:', error);
      return;
    }

    setTransactions(data);
  };

  const createAccount = async (type: 'savings' | 'current', userId: string) => {
    const accountNumber = Math.floor(Math.random() * 900000000 + 100000000).toString();
    const initialBalance = type === 'current' ? 1000 : 0;

    const { data, error } = await supabase
      .from('accounts')
      .insert({
        user_id: userId,
        account_number: accountNumber,
        type,
        balance: initialBalance,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating account:', error);
      throw error;
    }

    setAccounts([data, ...accounts]);
    setCurrentAccount(data);
  };

  const selectAccount = (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId) || null;
    setCurrentAccount(account);
  };

  const deposit = async (amount: number) => {
    if (!currentAccount || amount <= 0) return;

    const newBalance = currentAccount.balance + amount;

    const { error: updateError } = await supabase
      .from('accounts')
      .update({ balance: newBalance })
      .eq('id', currentAccount.id);

    if (updateError) {
      console.error('Error updating balance:', updateError);
      throw updateError;
    }

    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        account_id: currentAccount.id,
        type: 'deposit',
        amount,
        balance_after: newBalance,
      });

    if (transactionError) {
      console.error('Error creating transaction:', transactionError);
      throw transactionError;
    }

    const updatedAccount = { ...currentAccount, balance: newBalance };
    setAccounts(accounts.map(acc => acc.id === updatedAccount.id ? updatedAccount : acc));
    setCurrentAccount(updatedAccount);
    loadTransactions(currentAccount.id);
  };

  const withdraw = async (amount: number) => {
    if (!currentAccount || amount <= 0) return;

    const newBalance = currentAccount.balance - amount;

    // Apply business rules based on account type
    if (currentAccount.type === 'savings') {
      if (newBalance < 0) {
        throw new Error('Insufficient funds');
      }
    } else if (currentAccount.type === 'current') {
      if (newBalance < 1000) {
        throw new Error('Current account balance must remain above 1000');
      }
    }

    const { error: updateError } = await supabase
      .from('accounts')
      .update({ balance: newBalance })
      .eq('id', currentAccount.id);

    if (updateError) {
      console.error('Error updating balance:', updateError);
      throw updateError;
    }

    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        account_id: currentAccount.id,
        type: 'withdrawal',
        amount,
        balance_after: newBalance,
      });

    if (transactionError) {
      console.error('Error creating transaction:', transactionError);
      throw transactionError;
    }

    const updatedAccount = { ...currentAccount, balance: newBalance };
    setAccounts(accounts.map(acc => acc.id === updatedAccount.id ? updatedAccount : acc));
    setCurrentAccount(updatedAccount);
    loadTransactions(currentAccount.id);
  };

  const getBalance = (): number => {
    return currentAccount?.balance || 0;
  };

  return (
    <AccountContext.Provider value={{
      accounts,
      currentAccount,
      transactions,
      createAccount,
      selectAccount,
      deposit,
      withdraw,
      getBalance,
    }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = (): AccountContextType => {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};