"use client";

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
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
     try {
  const res = await API.get<UserType>("/admin/me");
  setUser(res.data);
} catch {
  setUser(null); // no 'err' needed
} finally {
  setLoading(false);
}

    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier usage
export const useAuth = () => useContext(AuthContext);
