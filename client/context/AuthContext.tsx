"use client";

import Image from "next/image";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import API from "../lib/api";

interface UserType {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  refreshUser: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user from cookie-based session
  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await API.get<UserType>("/auth/me"); // must have withCredentials
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Only render children after loading to prevent flash
  if (loading) return  <div className="flex flex-col items-center justify-center py-16">
                              <Image src="/gadup2.png" alt="Loading" width={300} height={300} className="animate-pulse" />
                          </div>;

  return (
    <AuthContext.Provider value={{ user, setUser, loading, refreshUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier usage
export const useAuth = () => useContext(AuthContext);
