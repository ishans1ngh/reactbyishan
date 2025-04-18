import React, { useState } from 'react';
import { useAccount } from '../context/AccountContext';
import { useAuth } from '../context/AuthContext';
import Card from './ui/Card';
import Button from './ui/Button';
import { PlusCircle } from 'lucide-react';

const AccountSelector: React.FC = () => {
  const { user } = useAuth();
  const { accounts, currentAccount, createAccount, selectAccount } = useAccount();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [accountType, setAccountType] = useState<'savings' | 'current'>('savings');

  const handleCreateAccount = () => {
    if (user) {
      createAccount(accountType, user.id);
      setShowCreateForm(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Your Accounts</h2>
        {!showCreateForm && (
          <Button 
            onClick={() => setShowCreateForm(true)}
            variant="outline"
            className="flex items-center"
          >
            <PlusCircle size={16} className="mr-2" />
            New Account
          </Button>
        )}
      </div>

      {showCreateForm ? (
        <Card variant="flat" className="mb-6 p-5 border border-blue-200">
          <h3 className="text-lg font-semibold mb-4">Create New Account</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  checked={accountType === 'savings'}
                  onChange={() => setAccountType('savings')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2">Savings Account</span>
              </label>
              
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  checked={accountType === 'current'}
                  onChange={() => setAccountType('current')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2">Current Account</span>
              </label>
            </div>
            
            {accountType === 'current' && (
              <p className="text-sm text-gray-500 mt-2">
                Note: Current accounts start with a minimum balance of ₹1,000
              </p>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button onClick={handleCreateAccount}>
              Create Account
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowCreateForm(false)}
            >
              Cancel
            </Button>
          </div>
        </Card>
      ) : (
        accounts.length === 0 ? (
          <Card variant="flat" className="mb-6 p-8 text-center">
            <p className="text-gray-500 mb-4">You don't have any accounts yet.</p>
            <Button onClick={() => setShowCreateForm(true)}>
              Create Your First Account
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 mb-6">
            {accounts.map((account) => (
              <Card 
                key={account.id} 
                variant={currentAccount?.id === account.id ? '3d' : 'flat'} 
                className={`cursor-pointer transition-transform hover:scale-[1.02] ${
                  currentAccount?.id === account.id ? 'ring-2 ring-blue-400' : ''
                }`}
                onClick={() => selectAccount(account.id)}
              >
                <div className="mb-2 flex justify-between items-start">
                  <div className="bg-blue-900 text-white text-xs py-1 px-2 rounded uppercase">
                    {account.type} Account
                  </div>
                  
                  {currentAccount?.id === account.id && (
                    <div className="bg-green-100 text-green-800 text-xs py-1 px-2 rounded">
                      Active
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">
                    Account: {account.accountNumber}
                  </h3>
                  
                  <div className="mt-2 text-gray-600">
                    Balance: <span className="font-medium">₹{account.balance.toLocaleString()}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default AccountSelector;