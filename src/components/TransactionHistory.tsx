import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface Transaction {
  id: string;
  type: 'sent' | 'received';
  amount: number;
  userId: string;
  userName: string;
  createdAt: string;
}

export const TransactionHistory = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const transactionsPerPage = 5;

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions', { cache: 'no-store' });
      
      if (response.status === 401) {
        window.location.href = '/signin';
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();
      setTransactions(data.transactions);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTransactions();
  }, []);

  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  const getCurrentTransactions = () => {
    const startIndex = (currentPage - 1) * transactionsPerPage;
    return transactions.slice(startIndex, startIndex + transactionsPerPage);
  };

  if (loading) {
    return (
      <Card className="w-full max-w-2xl rounded-3xl glass-morphism border-primary/20 shadow-xl bg-white/70 dark:bg-[#23233c]/70 mt-8">
        <CardContent className="p-8">
          <div className="text-center text-muted-foreground">Loading transactions...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-2xl rounded-3xl glass-morphism border-primary/20 shadow-xl bg-white/70 dark:bg-[#23233c]/70 mt-8">
        <CardContent className="p-8">
          <div className="text-center text-destructive">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl rounded-3xl glass-morphism border-primary/20 shadow-xl bg-white/70 dark:bg-[#23233c]/70 mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gradient-primary tracking-tight">
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-lg text-muted-foreground/80 italic font-light">
              No Transactions Yet.
            </p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getCurrentTransactions().map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="flex items-center gap-2">
                      {transaction.type === "sent" ? (
                        <ArrowUpIcon className="w-4 h-4 text-destructive" />
                      ) : (
                        <ArrowDownIcon className="w-4 h-4 text-emerald-500" />
                      )}
                      {transaction.type}
                    </TableCell>
                    <TableCell className="font-medium">
                      ${transaction.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>{transaction.userName}</TableCell>
                    <TableCell className="text-right">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {transactions.length > transactionsPerPage && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <PaginationItem key={i + 1}>
                        <PaginationLink
                          onClick={() => setCurrentPage(i + 1)}
                          isActive={currentPage === i + 1}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};