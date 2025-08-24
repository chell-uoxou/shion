"use client";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/env";
import Image from "next/image";

export default function Page() {
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/login`;
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-4">
      {/* タイトル */}
      <Logo className="w-32" />

      {/* ログインボタン */}
      <Button
        onClick={handleGoogleLogin}
        size={"lg"}
        className="bg-white hover:bg-white text-brand-violet-2 rounded-xl text-base"
      >
        <Image
          src={"./google.svg"}
          alt="Google Logo"
          className="inline-block mr-2"
          width={24}
          height={24}
        />
        Googleでログイン
      </Button>
    </div>
  );
}
