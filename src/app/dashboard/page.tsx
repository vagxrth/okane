'use client';

import { useState, useEffect } from 'react';
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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900">
            Send money to {recipient?.name}
          </h3>
          <form onSubmit={handleSubmit} className="mt-4">
            {error && (
              <div className="mb-4 text-sm text-red-600">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
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
  const [balance, setBalance] = useState<number>(0);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [balanceResponse, usersResponse] = await Promise.all([
        fetch('/api/balance'),
        fetch('/api/users')
      ]);

      if (!balanceResponse.ok || !usersResponse.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const balanceData = await balanceResponse.json();
      const usersData = await usersResponse.json();

      setBalance(balanceData.balance);
      setUsers(usersData.users);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (amount: number) => {
    if (!selectedUser) return;

    const response = await fetch('/api/transfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: selectedUser.id,
        amount,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Transfer failed');
    }

    // Refresh dashboard data after successful transfer
    await fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Your Balance</h2>
            <div className="mt-2 text-4xl font-bold text-indigo-600">
              ${balance.toFixed(2)}
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Users</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowTransferModal(true);
                    }}
                    className="mt-2 w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                  >
                    Send Money
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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