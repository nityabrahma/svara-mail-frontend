"use client";

import { useAuthGuard } from "./use-auth-guard";

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useAuthGuard();
  return <>{children}</>;
};
