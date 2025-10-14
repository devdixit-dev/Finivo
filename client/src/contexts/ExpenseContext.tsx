import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Expense {
  id: string;
  name: string;
  category: string;
  type: string;
  price: number;
  date: string;
  userEmail: string;
}

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'date' | 'userEmail'>) => Promise<void>;
  updateExpense: (id: string, expense: Omit<Expense, 'id' | 'date' | 'userEmail'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  getTotalSpent: () => number;
  isLoading: boolean;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const storedExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
      const userExpenses = storedExpenses.filter((e: Expense) => e.userEmail === user.email);
      setExpenses(userExpenses);
    } else {
      setExpenses([]);
    }
  }, [user]);

  const saveExpenses = (newExpenses: Expense[]) => {
    const allExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    const otherUsersExpenses = allExpenses.filter((e: Expense) => e.userEmail !== user?.email);
    const updatedExpenses = [...otherUsersExpenses, ...newExpenses];
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
  };

  const addExpense = async (expense: Omit<Expense, 'id' | 'date' | 'userEmail'>) => {
    if (!user) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      userEmail: user.email
    };

    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
    setIsLoading(false);
  };

  const updateExpense = async (id: string, expense: Omit<Expense, 'id' | 'date' | 'userEmail'>) => {
    if (!user) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const updatedExpenses = expenses.map(e => 
      e.id === id ? { ...e, ...expense } : e
    );
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
    setIsLoading(false);
  };

  const deleteExpense = async (id: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const updatedExpenses = expenses.filter(e => e.id !== id);
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
    setIsLoading(false);
  };

  const getTotalSpent = () => {
    return expenses.reduce((total, expense) => total + expense.price, 0);
  };

  return (
    <ExpenseContext.Provider value={{ expenses, addExpense, updateExpense, deleteExpense, getTotalSpent, isLoading }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within ExpenseProvider');
  }
  return context;
};
