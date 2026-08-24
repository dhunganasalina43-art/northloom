"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { IUser } from "@/types";
import { getMeRequest, loginRequest, logoutRequest, registerRequest } from "@/services/auth.service";

type TAuthContext = {
  user: IUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<IUser>;
  register: (payload: { full_name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<TAuthContext | undefined>(undefined);

/**
 * Loads the current session once on mount (by calling GET /auth/me, which
 * relies on the httpOnly cookie), then exposes login/register/logout to
 * the rest of the app through the useAuth() hook below.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await getMeRequest();
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const res = await loginRequest({ email, password });
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (payload: {
    full_name: string;
    email: string;
    password: string;
    phone?: string;
  }) => {
    await registerRequest(payload);
  };

  const logout = async () => {
    await logoutRequest();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
