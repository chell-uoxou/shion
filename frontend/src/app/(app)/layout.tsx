"use client";

import { PropsWithChildren, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { queryClient } from "@/lib/queryClient";
import { API_BASE_URL } from "@/lib/env";

export default function AppLayout({ children }: PropsWithChildren) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch(`${API_BASE_URL}/me`, {
        method: "GET",
        credentials: "include",
      });
      if (res.status === 401) {
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
