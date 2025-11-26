"use client";

import { useAuth } from "@/hooks/use-auth";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAppRouter } from "./use-router";
import { useLoading } from "./use-loading";

const PUBLIC_ROUTES = ["/", "/login"];

export const useAuthGuard = () => {
  const auth = useAuth();
  const pathname = usePathname();
  const router = useAppRouter();
  const { setLoading } = useLoading();

  useEffect(() => {
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    // If user is not logged in and is trying to access a protected route, redirect to login
    if (!auth.token && !isPublicRoute) {
      setLoading(true);
      router.push("/login");
    } else if (auth.token && isPublicRoute && pathname !== "/") {
      // If user is logged in and on a public route (like /login), redirect to inbox
      router.push("/inbox");
    } else {
        setLoading(false)
    }

  }, [auth.token, pathname, router, setLoading]);
};
