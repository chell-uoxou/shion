"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const router = useRouter();
  useEffect(() => {
    fetch("http://localhost:8080/logout", {
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
