'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { useRouter } from 'next/navigation';
import { Wallet, CheckCircle2, AlertCircle } from "lucide-react";
import { SendMoneyDialog } from "@/components/SendMoneyDialog";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
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

  const handleTransfer = async (amount: string): Promise<void> => {
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
          amount: Number(amount),
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
      
      toast.success(`Sent $${amount} to ${selectedUser.name}`, {
        duration: 4000,
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      });
    } catch (err) {
      toast.error('Transfer Failed', {
        description: err instanceof Error ? err.message : 'An error occurred during transfer',
        duration: 5000,
        icon: <AlertCircle className="w-5 h-5 text-red-400" />,
      });
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
      <div className="min-h-screen flex w-full justify-center relative bg-gradient-to-br from-[#9b87f5]/20 via-white/75 dark:via-[#23233c]/90 to-[#D6BCFA]/50">
        <DashboardSidebar 
          users={users}
          onTransferClick={handleTransferClick}
        />
        <SidebarInset>
          {/* Theme Toggle */}
          <div className="absolute top-4 right-4 z-50">
            <ThemeToggle />
          </div>

          <div className="flex flex-col items-center justify-center w-full min-h-[70vh] p-4 md:p-8 relative z-10">
            {/* Japanese Pattern Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzk4ODlBOSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3N2Zz4=')]"></div>

            {/* Balance Card */}
            <Card className="w-full max-w-2xl rounded-3xl glass-morphism border-primary/20 shadow-xl bg-white/70 dark:bg-[#23233c]/70">
              <CardContent className="p-8 sm:p-10">
                <div className="text-center space-y-4">
                  <div className="inline-block p-4 rounded-full bg-gradient-to-tr from-[#9b87f5]/70 to-[#7E69AB]/80 shadow-md mb-4">
                    <Wallet className="w-9 h-9 text-white drop-shadow-glow" />
                  </div>
                  <h2 className="font-japanese text-3xl font-extrabold text-gradient-primary tracking-tight">
                    Your Balance
                  </h2>
                  <p className="text-6xl font-bold bg-gradient-to-r from-[#9b87f5] via-[#7E69AB] to-[#D6BCFA] bg-clip-text text-transparent drop-shadow-xl font-japanese">
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

      <SendMoneyDialog
        open={showTransferModal}
        onOpenChange={(open) => {
          setShowTransferModal(open);
          if (!open) setSelectedUser(null);
        }}
        recipientName={selectedUser?.name || ''}
        onSendMoney={handleTransfer}
      />
    </SidebarProvider>
  );
} 