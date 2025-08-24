"use client";

import { Button } from "@/components/ui/button";

export default function Page() {
  const handleGoogleLogin = () => {
    // 実際のログインURLに差し替え
    window.location.href = "http://localhost:8080/login";
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-[#F4EEF8] text-[#4E2A6E]">
      {/* タイトル */}
      <h1 className="mb-8 text-2xl font-semibold tracking-widest">紫苑</h1>

      {/* ログインボタン */}
      <Button
        onClick={handleGoogleLogin}
        className="bg-[#C9B2E6] hover:bg-[#bda4df] text-[#4E2A6E] rounded-xl px-6 py-5 text-base shadow-md"
      >
        Googleでログイン
      </Button>
    </div>
  );
}
