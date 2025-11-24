"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useLoading } from "./use-loading";
import { useAppRouter } from "./use-router";

interface User {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  avatar_url?: string;
}

interface RegisterResponse {
  user: User;
  token: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

interface CheckUsernameResponse {
  isAvailable: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  register: (username: string, password: string, phoneNumber: string) => Promise<void>;
  login: (credential: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkUsername: (username: string) => Promise<boolean>;
  checkPhoneNumber: (phoneNumber: string) => Promise<boolean>;
  checkDomainEmail: (email: string) => Promise<boolean>;
  handleGoogleAuth: (accessToken: string, refreshToken: string, userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const { loading, setLoading } = useLoading();
  const { push } = useAppRouter();

  // Fetch current user if session exists
  const fetchUserData = async (): Promise<User | null> => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        const userData = await res.json();
        return userData;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      const userData = await fetchUserData();
      if (userData) {
        setUser(userData);
        setToken("present");
      }
      setLoading(false);
    };
    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkUsername = async (username: string): Promise<boolean> => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check-username/${username}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Check username failed");
      const data: CheckUsernameResponse = await res.json();
      return data.isAvailable;
    } catch (err) {
      console.error("Error checking username:", err);
      throw err;
    }
  };

  const checkPhoneNumber = async (phoneNumber: string): Promise<boolean> => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check-phone/${phoneNumber}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Check phone number failed");
      const data: CheckUsernameResponse = await res.json();
      return data.isAvailable;
    } catch (err) {
      console.error("Error checking phone number:", err);
      throw err;
    }
  };

  const checkDomainEmail = async (email: string): Promise<boolean> => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check-email/${email}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Check email failed");
      const data: CheckUsernameResponse = await res.json();
      return data.isAvailable;
    } catch (err) {
      console.error("Error checking domain email:", err);
      throw err;
    }
  };

  const handleGoogleAuth = async (accessToken: string, refreshToken: string, userId: string) => {
    setLoading(true);
    try {
      const userData = await fetchUserData();
      if (userData) {
        setUser(userData);
        setToken("present");
        push("/dashboard");
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (err) {
      console.error("Google Auth Error:", err);
      push("/auth");
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, password: string, phoneNumber: string) => {
    setLoading(true);
    try {
      if (!phoneNumber) throw new Error("Phone number is required");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, phone_number: phoneNumber }),
        credentials: "include",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Registration failed");
      }

      const data: RegisterResponse = await res.json();
      setUser(data.user);
      setToken(data.token);
      push("/inbox");
    } catch (err: any) {
      console.error("Registration error:", err);
      throw new Error(err.message || "Error during registration");
    } finally {
      setLoading(false);
    }
  };

  const login = async (credential: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential, password }),
        credentials: "include",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Login failed");
      }

      const data: LoginResponse = await res.json();
      setUser(data.user);
      setToken(data.token);
      push("/inbox");
    } catch (err: any) {
      console.error("Login error:", err);
      throw new Error(err.message || "Error during login");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.warn("Logout API failed:", err);
    } finally {
      setUser(null);
      setToken(null);
      push("/");
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        register,
        login,
        logout,
        checkUsername,
        checkPhoneNumber,
        checkDomainEmail,
        handleGoogleAuth,
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
