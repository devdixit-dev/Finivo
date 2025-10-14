import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  name: string;
  email: string;
  budget: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<boolean>;
  logout: () => void;
  updateBudget: (budget: number) => void;
  updateProfile: (name: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((u: any) => u.email === email);
    
    if (existingUser) {
      setIsLoading(false);
      throw new Error('User already exists');
    }

    const newUser = { name, email, password, verified: false, budget: 0 };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Store OTP (in real app, this would be sent via email)
    localStorage.setItem(`otp_${email}`, '123456');
    setIsLoading(false);
  };

  const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const storedOTP = localStorage.getItem(`otp_${email}`);
    
    if (storedOTP === otp) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.email === email);
      
      if (userIndex !== -1) {
        users[userIndex].verified = true;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.removeItem(`otp_${email}`);
        setIsLoading(false);
        return true;
      }
    }
    
    setIsLoading(false);
    return false;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser && foundUser.verified) {
      const userSession = {
        name: foundUser.name,
        email: foundUser.email,
        budget: foundUser.budget || 0
      };
      setUser(userSession);
      localStorage.setItem('currentUser', JSON.stringify(userSession));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateBudget = (budget: number) => {
    if (user) {
      const updatedUser = { ...user, budget };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Update in users list
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.email === user.email);
      if (userIndex !== -1) {
        users[userIndex].budget = budget;
        localStorage.setItem('users', JSON.stringify(users));
      }
    }
  };

  const updateProfile = async (name: string) => {
    if (!user) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const updatedUser = { ...user, name };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Update in users list
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.email === user.email);
    if (userIndex !== -1) {
      users[userIndex].name = name;
      localStorage.setItem('users', JSON.stringify(users));
    }
    
    setIsLoading(false);
  };

  const deleteAccount = async () => {
    if (!user) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    // Remove user from users list
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const filteredUsers = users.filter((u: any) => u.email !== user.email);
    localStorage.setItem('users', JSON.stringify(filteredUsers));
    
    // Remove user's expenses
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    const filteredExpenses = expenses.filter((e: any) => e.userEmail !== user.email);
    localStorage.setItem('expenses', JSON.stringify(filteredExpenses));
    
    // Logout
    setUser(null);
    localStorage.removeItem('currentUser');
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, verifyOTP, logout, updateBudget, updateProfile, deleteAccount, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
