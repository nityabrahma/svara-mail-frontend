"use client";

import React, { createContext, useContext, useState } from "react";
import { useLoading } from "./use-loading";
import { useAppRouter } from "./use-router";

interface User {
  id: number;
  username: string;
  email?: string;
}

interface CheckUsernameResponse {
  isAvailable: boolean;
}

interface AuthContextType {
  user: User | null;
  checkUsername: (username: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const { setLoading } = useLoading();
  const { push } = useAppRouter();

  const checkUsername = async (username: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/check-username/${username}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Check username failed");
      }
      const data: CheckUsernameResponse = await res.json();
      return data.isAvailable;
    } catch (err) {
      console.error("Error checking username:", err);
      throw err;
    } finally {
        setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        checkUsername,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
