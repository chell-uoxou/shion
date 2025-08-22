import React from "react";
import UserRow from "@/features/FriendListitem/page"; // パスは実際の場所に合わせて調整
import { ChevronLeft } from "lucide-react";

export default function Page() {
  return (
    <main className="p-4 space-y-6">
      <div className="relative flex items-center justify-center py-2">
        <div className="absolute left-1">
          <ChevronLeft size={28} className="cursor-pointer text-primary" />
        </div>
        <h1 className="text-2xl text-center text-primary">
          話し相手一覧
        </h1>
      </div>
      <div className="space-y-4">
        <UserRow src="/user-icon.svg" name="ユーザー1" />
      </div>
    </main>
  );
}

