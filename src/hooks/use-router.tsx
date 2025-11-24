"use client";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { useLoading } from './use-loading';

interface AppRouterContextType {
  push: (path: string) => void;
  back: () => void;
}

const AppRouterContext = createContext<AppRouterContextType | undefined>(undefined);

export const AppRouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { setLoading } = useLoading();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // On initial load, navigation is finished.
    setLoading(false);
  }, []);
  
  useEffect(() => {
    // When the path or search params change, navigation is finished.
    setLoading(false);
  }, [pathname, searchParams, setLoading]);


  const value = useMemo(() => ({
    push: (path: string) => {
        if (pathname !== path) {
            setLoading(true);
            router.push(path);
        }
    },
    back: () => {
        setLoading(true);
        router.back();
    },
  }), [router, setLoading, pathname]);

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
