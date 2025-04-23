import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, DollarSign } from "lucide-react";

interface SendMoneyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientName: string;
  onSendMoney: (amount: string) => Promise<void>;
}

export const SendMoneyDialog = ({ open, onOpenChange, recipientName, onSendMoney }: SendMoneyDialogProps) => {
  const [amount, setAmount] = React.useState("");
  const [error, setError] = React.useState("");

  const validateAmount = (value: string): boolean => {
    const numAmount = Number(value);
    if (isNaN(numAmount)) {
      setError("Please enter a valid number");
      return false;
    }
    if (numAmount <= 0) {
      setError("Amount must be greater than 0");
      return false;
    }
    setError("");
    return true;
  };

  const handleSendMoney = async () => {
    if (!validateAmount(amount)) {
      return;
    }

    try {
      await onSendMoney(amount);
      setAmount("");
      setError("");
      onOpenChange(false);
    } catch {
      // Error handling is done in the parent component
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    if (value) {
      validateAmount(value);
    } else {
      setError("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md rounded-3xl border-primary/20 bg-gradient-to-br from-[#1a1f2c]/90 via-[#23233c]/90 to-[#9b87f5]/30 backdrop-blur-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gradient-primary tracking-tight">
            Send Money to {recipientName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative mt-6">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <DollarSign className="w-5 h-5 text-primary/70" />
          </div>
          <Input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={handleAmountChange}
            className="pl-10 h-12 text-lg bg-white/5 border-primary/20 focus:border-primary/40 rounded-xl"
            min="0.01"
            step="0.01"
          />
          {error && (
            <div className="text-sm text-destructive mt-2">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="mt-8 gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setAmount("");
              setError("");
              onOpenChange(false);
            }}
            className="flex-1 h-11 rounded-xl bg-white/5 hover:bg-white/10 border-primary/20"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendMoney}
            disabled={!amount || !!error}
            className="flex-1 h-11 rounded-xl bg-gradient-to-r from-primary/90 to-[#9b87f5] hover:opacity-90 transition-opacity"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Money
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};