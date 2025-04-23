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
import { toast } from "sonner";

interface SendMoneyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientName: string;
}

export const SendMoneyDialog = ({ open, onOpenChange, recipientName }: SendMoneyDialogProps) => {
  const [amount, setAmount] = React.useState("");

  const handleSendMoney = () => {
    toast(`$${amount} sent to ${recipientName}`, {
      description: "Money sent successfully!"
    });
    setAmount("");
    onOpenChange(false);
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
            onChange={(e) => setAmount(e.target.value)}
            className="pl-10 h-12 text-lg bg-white/5 border-primary/20 focus:border-primary/40 rounded-xl"
          />
        </div>

        <DialogFooter className="mt-8 gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-11 rounded-xl bg-white/5 hover:bg-white/10 border-primary/20"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendMoney}
            disabled={!amount}
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