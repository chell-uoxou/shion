"use client";

import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 3, // 3min
      retry: 1,
    },
    mutations: {
      retry: 1,
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
    },
  },
});

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
