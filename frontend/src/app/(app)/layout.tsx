"use client";

import { House, UserRound, UsersRound } from "lucide-react";
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
    <div className="bg-[#F4EFFA] h-svh flex flex-col gap-0">
      <div className="flex items-center justify-center h-16">shion logo</div>
      <div className="flex-1">
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </div>
      <footer className="flex justify-between h-14 items-center px-10 border-t border-[#7C56B5]">
        <UsersRound />
        <House />
        <UserRound />
      </footer>
    </div>
  );
}
