'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Wallet, Menu } from "lucide-react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

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
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-card">
        <div className="mt-3">
          <h3 className="text-lg font-medium">
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
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-primary focus:border-primary bg-background"
                required
              />
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium bg-secondary hover:bg-secondary/80 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md disabled:opacity-50"
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
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTransfer = async (amount: number): Promise<void> => {
    if (!selectedUser) return;

    try {
      setLoading(true);
      setError('');

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
      setError(err instanceof Error ? err.message : 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const handleTransferClick = (user: User) => {
    setSelectedUser(user);
    setShowTransferModal(true);
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar 
          users={users}
          onTransferClick={handleTransferClick}
        />
        <SidebarInset>
          {/* Split header controls: Sidebar Toggle on left, Theme Toggle on right */}
          <div className="absolute top-4 left-4 z-50">
            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <SidebarTrigger>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Sidebar</span>
              </SidebarTrigger>
            </Button>
          </div>
          <div className="absolute top-4 right-4 z-50">
            <ThemeToggle />
          </div>

          <div className="flex flex-col items-center justify-center w-full p-4 md:p-8">
            {/* Japanese Pattern Overlay */}
            <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvc3ZnPg==')] pointer-events-none"></div>

            {/* Balance Card */}
            <Card className="w-full max-w-2xl backdrop-blur-lg bg-card/50 border-primary/20">
              <CardContent className="p-8">
                <div className="text-center space-y-4">
                  <div className="inline-block p-3 rounded-full bg-primary/10 mb-4">
                    <Wallet className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-muted-foreground">Your Balance</h2>
                  <p className="text-6xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    ${balance.toFixed(2)}
                  </p>
                  {error && (
                    <div className="mt-4 p-4 rounded-md bg-destructive/10 text-destructive">
                      {error}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
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
    </SidebarProvider>
  );
} 