import React, { useState } from 'react';
import { useAccount } from '../context/AccountContext';
import { useAuth } from '../context/AuthContext';
import Card from './ui/Card';
import Button from './ui/Button';
import AccountSelector from './AccountSelector';
import TransactionHistory from './TransactionHistory';
import { Wallet, LogOut, BarChart4, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { currentAccount, deposit, withdraw, getBalance } = useAccount();
  
  const [amount, setAmount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  
  const handleTransaction = () => {
    if (amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    if (activeTab === 'deposit') {
      deposit(amount);
    } else {
      withdraw(amount);
    }
    
    setAmount(0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-900 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Wallet className="mr-2" />
            <span className="text-xl font-bold">SecureBank</span>
          </div>
          
          <div className="flex items-center">
            <span className="mr-4">Welcome, {user?.fullName}</span>
            <Button variant="outline" onClick={logout} className="!bg-transparent !border-white !text-white hover:!bg-white/10">
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Account Info */}
          <div className="md:col-span-2">
            <AccountSelector />
            
            {currentAccount && (
              <Card variant="3d" className="mt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-gray-500 font-medium">Current Balance</h3>
                    <div className="text-3xl font-bold mt-1">₹{getBalance().toLocaleString()}</div>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <BarChart4 className="text-blue-700" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <Button 
                    variant="primary" 
                    onClick={() => setActiveTab('deposit')}
                    className={activeTab === 'deposit' ? 'ring-2 ring-blue-300' : ''}
                  >
                    <div className="flex items-center">
                      <ArrowDownRight size={18} className="mr-2" />
                      Deposit
                    </div>
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={() => setActiveTab('withdraw')}
                    className={activeTab === 'withdraw' ? 'ring-2 ring-red-300' : ''}
                  >
                    <div className="flex items-center">
                      <ArrowUpRight size={18} className="mr-2" />
                      Withdraw
                    </div>
                  </Button>
                </div>
                
                <div className="mt-6">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={amount || ''}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter amount"
                      min="0"
                    />
                  </div>
                  
                  <Button
                    onClick={handleTransaction}
                    fullWidth
                    variant={activeTab === 'deposit' ? 'primary' : 'danger'}
                  >
                    {activeTab === 'deposit' ? 'Deposit' : 'Withdraw'} Funds
                  </Button>
                </div>
              </Card>
            )}
          </div>
          
          {/* Transaction History */}
          <div className="md:col-span-1">
            <Card variant="flat" className="h-full">
              <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
              <TransactionHistory />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;