"use client";
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useMemo } from 'react';

interface AppRouterContextType {
  push: (path: string) => void;
  back: () => void;
}

const AppRouterContext = createContext<AppRouterContextType | undefined>(undefined);

export const AppRouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();

  const value = useMemo(() => ({
    push: (path: string) => router.push(path),
    back: () => router.back(),
  }), [router]);

  return (
    <AppRouterContext.Provider value={value}>
      {children}
    </AppRouterContext.Provider>
  );
};

export const useAppRouter = () => {
  const context = useContext(AppRouterContext);
  if (context === undefined) {
    throw new Error('useAppRouter must be used within an AppRouterProvider');
  }
  return context;
};
