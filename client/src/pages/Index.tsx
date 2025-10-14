import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Wallet, TrendingDown, PieChart, Shield } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-full mb-6 shadow-primary">
              <Wallet className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Expense Tracker
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Take control of your finances with our simple and powerful expense tracking app
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-primary shadow-primary text-lg px-8">
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="p-6 rounded-xl bg-gradient-card shadow-md">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <TrendingDown className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Track Expenses</h3>
              <p className="text-muted-foreground text-sm">
                Easily add and categorize your daily expenses with just a few clicks
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-card shadow-md">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <PieChart className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Budget Management</h3>
              <p className="text-muted-foreground text-sm">
                Set budget limits and monitor your spending in real-time
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-card shadow-md">
              <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Shield className="w-6 h-6 text-warning" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
              <p className="text-muted-foreground text-sm">
                Your financial data is stored securely and remains completely private
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
