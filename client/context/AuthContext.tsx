"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
        const res = await fetch( `${process.env.NEXT_PUBLIC_API_URL}/api/admin/me`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false); // <-- important
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
