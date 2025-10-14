import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

interface BudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSetBudget: (budget: number) => void;
  currentBudget: number;
}

export const BudgetDialog = ({ open, onOpenChange, onSetBudget, currentBudget }: BudgetDialogProps) => {
  const [budget, setBudget] = useState(currentBudget.toString());

  const handleSubmit = () => {
    const budgetValue = parseFloat(budget);
    if (isNaN(budgetValue) || budgetValue <= 0) {
      return;
    }
    onSetBudget(budgetValue);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="mx-auto mb-2 w-12 h-12 bg-gradient-success rounded-full flex items-center justify-center">
            <Wallet className="w-6 h-6 text-success-foreground" />
          </div>
          <DialogTitle className="text-center">
            {currentBudget === 0 ? 'Set Your Budget' : 'Update Your Budget'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {currentBudget === 0 
              ? 'Set your monthly budget limit to start tracking expenses'
              : 'Update your monthly budget limit'
            }
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="budget">Budget Amount (₹)</Label>
            <Input
              id="budget"
              type="number"
              placeholder="5000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full bg-gradient-primary"
            disabled={!budget || parseFloat(budget) <= 0}
          >
            {currentBudget === 0 ? 'Set Budget' : 'Update Budget'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
