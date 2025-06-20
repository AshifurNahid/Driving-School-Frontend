
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'learner';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  joinDate: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAdmin: boolean;
  isLearner: boolean;
  switchRole: (role: UserRole) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  // Mock user data - in a real app, this would come from authentication
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    role: 'admin', // Start as admin to test appointment fixing
    joinDate: '2024-01-15'
  });

  const isAdmin = user?.role === 'admin';
  const isLearner = user?.role === 'learner';

  const switchRole = (role: UserRole) => {
    if (user) {
      setUser({
        ...user,
        role,
        name: role === 'admin' ? 'Dr. Sarah Wilson (Instructor)' : 'Alex Johnson (Student)',
        id: role === 'admin' ? 'admin-1' : 'learner-1'
      });
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, isAdmin, isLearner, switchRole }}>
      {children}
    </UserContext.Provider>
  );
};
