import React, { createContext, useContext, useMemo } from 'react';
import { useSession, signOut } from 'next-auth/react';
import type { Permission, Role } from '../types';

// Define the shape of the user object we expect in the session
interface CurrentUser {
  id: string;
  role: Role;
  permissions: string[];
  name: string;
  email: string;
  avatar: string;
  resellerId?: number | string;
}

interface AuthContextType {
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();

  const isAuthenticated = status === 'authenticated';
  // Cast the user object to our custom type to inform TypeScript of its shape
  const currentUser = isAuthenticated ? (session.user as CurrentUser) : null;

  const logout = () => {
    signOut({ callbackUrl: '/auth/login' });
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!isAuthenticated || !currentUser?.permissions) {
      return false;
    }
    return currentUser.permissions.includes(permission);
  };

  const value: AuthContextType = useMemo(() => ({
    currentUser,
    isAuthenticated,
    logout,
    hasPermission,
  }), [session, status]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
