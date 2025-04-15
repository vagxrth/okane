'use client';

import { useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useRouter } from 'next/navigation';

// Force client-side rendering
export const runtime = 'edge';
export const preferredRegion = 'auto';

interface User {
  id: string;
  name: string;
  email: string;
}

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: User | null;
  onTransfer: (amount: number) => Promise<void>;
}

function TransferModal({ isOpen, onClose, recipient, onTransfer }: TransferModalProps) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onTransfer(Number(amount));
      onClose();
      setAmount('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Send money to {recipient?.name}
          </h3>
          <form onSubmit={handleSubmit} className="mt-4">
            {error && (
              <div className="mb-4 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}
            <div className="mt-2">
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                required
              />
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-md disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Money'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [balance, setBalance] = useState<number>(0);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      const [balanceResponse, usersResponse] = await Promise.all([
        fetch('/api/balance', { cache: 'no-store' }),
        fetch('/api/users', { cache: 'no-store' })
      ]);

      if (balanceResponse.status === 401 || usersResponse.status === 401) {
        router.push('/signin');
        return;
      }

      if (!balanceResponse.ok || !usersResponse.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const balanceData = await balanceResponse.json();
      const usersData = await usersResponse.json();

      setBalance(balanceData.balance);
      setUsers(usersData.users);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTransfer = async (amount: number) => {
    if (!selectedUser) return;

    try {
      const response = await fetch('/api/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: selectedUser.id,
          amount,
        }),
        cache: 'no-store'
      });

      if (response.status === 401) {
        router.push('/signin');
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Transfer failed');
      }

      await fetchDashboardData();
    } catch (err) {
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Main Content - Balance Section */}
        <div className="flex-1 py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg px-6 py-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your Balance</h2>
                <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                  ${balance.toFixed(2)}
                </div>
              </div>

              {error && (
                <div className="mt-4 rounded-md bg-red-50 dark:bg-red-900/50 p-4">
                  <div className="text-sm text-red-700 dark:text-red-200">{error}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Users Section */}
        <div className="w-96 min-h-screen border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Users</h3>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="border dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-700"
                >
                  <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowTransferModal(true);
                    }}
                    className="mt-2 w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-md transition-colors"
                  >
                    Send Money
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ThemeToggle />

      <TransferModal
        isOpen={showTransferModal}
        onClose={() => {
          setShowTransferModal(false);
          setSelectedUser(null);
        }}
        recipient={selectedUser}
        onTransfer={handleTransfer}
      />
    </div>
  );
} 