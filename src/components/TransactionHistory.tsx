import React from 'react';
import { useAccount } from '../context/AccountContext';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

const TransactionHistory: React.FC = () => {
  const { transactions, currentAccount } = useAccount();
  
  // Filter transactions for the current account
  const filteredTransactions = transactions.filter(
    transaction => currentAccount && transaction.accountId === currentAccount.id
  );

  if (!currentAccount) {
    return <p className="text-gray-500">Select an account to view transactions</p>;
  }

  if (filteredTransactions.length === 0) {
    return <p className="text-gray-500">No transactions yet</p>;
  }

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
      {filteredTransactions.map((transaction) => (
        <div 
          key={transaction.id}
          className="border-b border-gray-200 pb-3 last:border-0"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className={`p-2 rounded-full mr-3 ${
                transaction.type === 'deposit' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}>
                {transaction.type === 'deposit' 
                  ? <ArrowDownRight size={16} /> 
                  : <ArrowUpRight size={16} />
                }
              </div>
              
              <div>
                <p className="font-medium">
                  {transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(transaction.date).toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <span className={`font-semibold ${
                transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'deposit' ? '+' : '-'}₹{transaction.amount}
              </span>
              <p className="text-xs text-gray-500">
                Balance: ₹{transaction.balanceAfter}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionHistory;