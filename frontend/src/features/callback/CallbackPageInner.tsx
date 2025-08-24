"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingWithText from "@/components/LoadingWithText";
import { API_BASE_URL } from "@/lib/env";

export default function CallbackPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const code = params.get("code");
    if (!code) return;

    // 認可コードをGoバックエンドに送る
    fetch(`${API_BASE_URL}/callback`, {
      method: "POST",
      credentials: "include", // ← Cookieを受け取るため必須
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Auth failed");
        return res.text();
      })
      .then(() => {
        router.push("/timeline"); // ログイン後トップに戻す
      })
      .catch((err) => console.error(err));
  }, [params, router]);

  return (
    <div className="h-svh w-full flex items-center justify-center">
      <LoadingWithText text="ログイン中..." />
    </div>
  );
}
