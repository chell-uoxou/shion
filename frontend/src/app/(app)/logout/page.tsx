"use client";

import { API_BASE_URL } from "@/lib/env";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const router = useRouter();
  useEffect(() => {
    fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      credentials: "include",
    }).then(() => {
      router.push("/"); // ログアウト後トップに戻す
    });
  }, [router]);

  return (
    <main className="flex items-center justify-center h-screen">
      <h1 className="text-2xl">ログアウト中...</h1>
    </main>
  );
}
