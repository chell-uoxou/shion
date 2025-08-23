"use client";

import { House, UserRound, UsersRound } from "lucide-react";
import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

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

function FooterNav() {
  const pathname = usePathname();

  // アクティブかどうかを判定する関数
  const isActive = (path: string) => pathname === path;

  return (
    <footer className="flex justify-between h-14 items-center px-10 border-t border-[#7C56B5]">
      <Link href="/recent">
        <UsersRound
          className={isActive("/recent") ? "text-[var(--brand-violet-4)]" : "text-[var(--brand-violet-2)]"}
        />
      </Link>
      <Link href="/timeline">
        <House
          className={isActive("/timeline") ? "text-[var(--brand-violet-4)]" : "text-[var(--brand-violet-2)]"}
        />
      </Link>
      <Link href="/account">
        <UserRound
          className={isActive("/account") ? "text-[var(--brand-violet-4)]" : "text-[var(--brand-violet-2)]"}
        />
      </Link>
    </footer>
  );
}

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="bg-[#F4EFFA] h-svh flex flex-col gap-0">
      <div className="flex items-center justify-center h-16">
        <Image
          className=""
          src="logo.svg"
          alt="ロゴ画像"
          width={80}
          height={80}
        />
      </div>
      <div className="flex-1">
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </div>
      <FooterNav />
    </div>
  );
}

