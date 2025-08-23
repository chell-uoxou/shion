"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CallbackPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const code = params.get("code");
    if (!code) return;

    // 認可コードをGoバックエンドに送る
    fetch("http://localhost:8080/callback", {
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
        router.push("/"); // ログイン後トップに戻す
      })
      .catch((err) => console.error(err));
  }, [params, router]);

  return <p>ログイン処理中...</p>;
}
