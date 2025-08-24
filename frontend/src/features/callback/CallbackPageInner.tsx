"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingWithText from "@/components/LoadingWithText";
import { API_BASE_URL } from "@/lib/env";
import { Frown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CallbackPageInner() {
  const [isFailed, setIsFailed] = useState(false);

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
      .catch((err) => {
        console.error(err);
        setIsFailed(true);
      });
  }, [params, router]);

  return (
    <div className="h-svh w-full flex items-center justify-center">
      {isFailed ? (
        <div className="text-center flex flex-col items-center gap-4">
          <Frown size={36} />
          ログインに失敗しました。
          <br />
          再度お試しください。
          <Button
            onClick={() => router.push("/login")}
            className="bg-black text-white"
          >
            ログイン画面に戻る
          </Button>
        </div>
      ) : (
        <LoadingWithText text="ログイン中..." />
      )}
    </div>
  );
}
