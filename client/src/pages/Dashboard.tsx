import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useExpense } from '@/contexts/ExpenseContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { LogOut, Plus, Wallet, TrendingDown, Loader2, Settings, FileDown } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ExpenseList } from '@/components/ExpenseList';
import { BudgetDialog } from '@/components/BudgetDialog';
import { ExportDialog } from '@/components/ExportDialog';

const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Other'];
const TYPES = ['Cash', 'Card', 'UPI', 'Other'];

const Dashboard = () => {
  const { user, logout, updateBudget } = useAuth();
  const { addExpense, getTotalSpent, expenses, isLoading } = useExpense();
  const navigate = useNavigate();
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  const [expenseName, setExpenseName] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [expenseType, setExpenseType] = useState('');
  const [expensePrice, setExpensePrice] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.budget === 0) {
      setIsBudgetDialogOpen(true);
    }
  }, [user]);

  const totalSpent = getTotalSpent();
  const remaining = (user?.budget || 0) - totalSpent;
  const percentage = user?.budget ? (totalSpent / user.budget) * 100 : 0;

  const handleAddExpense = async () => {
    if (!expenseName || !expenseCategory || !expenseType || !expensePrice) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    const price = parseFloat(expensePrice);
    if (isNaN(price) || price <= 0) {
      toast({
        title: 'Error',
        description: 'Please enter a valid price',
        variant: 'destructive',
      });
      return;
    }

    await addExpense({
      name: expenseName,
      category: expenseCategory,
      type: expenseType,
      price,
    });

    toast({
      title: 'Success!',
      description: 'Expense added successfully',
    });

    setExpenseName('');
    setExpenseCategory('');
    setExpenseType('');
    setExpensePrice('');
    setIsAddExpenseOpen(false);
  };

  const handleSetBudget = (budget: number) => {
    updateBudget(budget);
    setIsBudgetDialogOpen(false);
    toast({
      title: 'Success!',
      description: `Budget set to ₹${budget}`,
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Finivo
            </h1>
            <p className="text-sm text-muted-foreground">Welcome, {user.name}!</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="icon" onClick={() => navigate('/settings')}>
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-card shadow-md border-blue-500 border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{user.budget.toLocaleString()}</div>
              <Button
                variant="link"
                className="px-0 text-xs"
                onClick={() => setIsBudgetDialogOpen(true)}
              >
                Update Budget
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-md border-red-500 border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-red-600 font-bold text-destructive">₹{totalSpent.toLocaleString()}</div>
              <p className="text-xs text-red-600 text-muted-foreground mt-1">
                {percentage.toFixed(1)}% of budget
              </p>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-card border-2 shadow-md ${remaining < 0 ? 'border-destructive' : remaining < user.budget * 0.2 ? 'border-warning' : 'border-success'}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Remaining</CardTitle>
              <Wallet className={`h-4 w-4 ${remaining < 0 ? 'text-destructive' : remaining < user.budget * 0.2 ? 'text-warning' : 'text-success'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${remaining < 0 ? 'text-destructive' : remaining < user.budget * 0.2 ? 'text-warning' : 'text-success'}`}>
                ₹{remaining.toLocaleString()}
              </div>
              {remaining < 0 && (
                <p className="text-xs text-destructive mt-1">Over budget!</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Expenses</h2>
          <div className="flex gap-2">
            <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary shadow-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Expense
                </Button>
              </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="expense-name">Expense Name</Label>
                  <Input
                    id="expense-name"
                    placeholder="e.g., Lunch at cafe"
                    value={expenseName}
                    onChange={(e) => setExpenseName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expense-category">Category</Label>
                  <Select value={expenseCategory} onValueChange={setExpenseCategory}>
                    <SelectTrigger id="expense-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expense-type">Payment Type</Label>
                  <Select value={expenseType} onValueChange={setExpenseType}>
                    <SelectTrigger id="expense-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expense-price">Price (₹)</Label>
                  <Input
                    id="expense-price"
                    type="number"
                    placeholder="0.00"
                    value={expensePrice}
                    onChange={(e) => setExpensePrice(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleAddExpense}
                  className="w-full bg-gradient-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Expense'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            onClick={() => setShowExportDialog(true)}
            disabled={expenses.length === 0}
          >
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          </div>
        </div>

        <ExpenseList categories={CATEGORIES} types={TYPES} />
      </main>

      <BudgetDialog
        open={isBudgetDialogOpen}
        onOpenChange={setIsBudgetDialogOpen}
        onSetBudget={handleSetBudget}
        currentBudget={user.budget}
      />
      <ExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} />
    </div>
  );
};

export default Dashboard;
