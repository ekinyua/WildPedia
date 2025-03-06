// src/store/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../models";
import {
  getCurrentUser,
  login as loginService,
  logout as logoutService,
  register as registerService,
} from "../services/authService";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
    fullName?: string;
    location?: string;
    organization?: string;
    expertiseArea?: string;
  }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const currentUser = getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error("Error initializing auth", err);
        // If there's an error loading the user, clear local storage
        logoutService();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await loginService(username, password);
      setUser(response.user);
    } catch (err: any) {
      setError(err.message || "Failed to login");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    fullName?: string;
    location?: string;
    organization?: string;
    expertiseArea?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await registerService(userData);
      setUser(response.user);
    } catch (err: any) {
      setError(err.message || "Failed to register");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
