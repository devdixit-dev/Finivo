import { useState } from 'react';
import { useExpense } from '@/contexts/ExpenseContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, Calendar, Loader2, Package } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface ExpenseListProps {
  categories: string[];
  types: string[];
}

export const ExpenseList = ({ categories, types }: ExpenseListProps) => {
  const { expenses, updateExpense, deleteExpense, isLoading } = useExpense();
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editType, setEditType] = useState('');
  const [editPrice, setEditPrice] = useState('');

  const handleEditClick = (expense: any) => {
    setEditingExpense(expense);
    setEditName(expense.name);
    setEditCategory(expense.category);
    setEditType(expense.type);
    setEditPrice(expense.price.toString());
  };

  const handleUpdateExpense = async () => {
    if (!editName || !editCategory || !editType || !editPrice) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    const price = parseFloat(editPrice);
    if (isNaN(price) || price <= 0) {
      toast({
        title: 'Error',
        description: 'Please enter a valid price',
        variant: 'destructive',
      });
      return;
    }

    await updateExpense(editingExpense.id, {
      name: editName,
      category: editCategory,
      type: editType,
      price,
    });

    toast({
      title: 'Success!',
      description: 'Expense updated successfully',
    });

    setEditingExpense(null);
  };

  const handleDeleteExpense = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteExpense(id);
      toast({
        title: 'Success!',
        description: 'Expense deleted successfully',
      });
    }
  };

  if (expenses.length === 0) {
    return (
      <Card className="shadow-md">
        <CardContent className="py-12 text-center">
          <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No expenses yet</h3>
          <p className="text-muted-foreground">Add your first expense to get started!</p>
        </CardContent>
      </Card>
    );
  }

  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <>
      <div className="space-y-4">
        {sortedExpenses.map((expense) => (
          <Card key={expense.id} className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{expense.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {expense.category}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                      {expense.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(expense.date), 'MMM dd, yyyy - hh:mm a')}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xl font-bold text-destructive whitespace-nowrap">
                    ₹{expense.price.toLocaleString()}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditClick(expense)}
                      disabled={isLoading}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteExpense(expense.id, expense.name)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editingExpense} onOpenChange={(open) => !open && setEditingExpense(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-expense-name">Expense Name</Label>
              <Input
                id="edit-expense-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-expense-category">Category</Label>
              <Select value={editCategory} onValueChange={setEditCategory}>
                <SelectTrigger id="edit-expense-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-expense-type">Payment Type</Label>
              <Select value={editType} onValueChange={setEditType}>
                <SelectTrigger id="edit-expense-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-expense-price">Price (₹)</Label>
              <Input
                id="edit-expense-price"
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
              />
            </div>
            <Button
              onClick={handleUpdateExpense}
              className="w-full bg-gradient-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Expense'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
