"use client";

import React from "react";
import UserRow from "@/features/FriendListitem/page"; // パスは実際の場所に合わせて調整
import { ChevronLeft, UserRoundPlus } from "lucide-react";
import { useGetFriends } from "@/generated/api/default/default";
import LoadingWithText from "@/components/LoadingWithText";

export default function Page() {
  const { data, isLoading } = useGetFriends();
  const friends = data?.data || [];

  return (
    <main className="p-4 space-y-6">
      {/* ヘッダー */}
      <div className="relative flex items-center justify-center py-2">
        <div className="absolute left-1">
          <ChevronLeft size={28} className="cursor-pointer text-primary" />
        </div>
        <h1 className="text-2xl text-center text-primary">話し相手一覧</h1>
      </div>

      {/* ユーザー一覧 */}
      <div className="space-y-4">
        {isLoading ? (
          <LoadingWithText />
        ) : (
          friends.map((friend) => (
            <UserRow
              key={friend.id}
              src="/user-icon.svg"
              name={friend.display_name || "Unknown User"}
            />
          ))
        )}
      </div>

      {/* 丸いボタン */}
      <button
        type="button"
        className="
          fixed              /* 画面に固定 */
          bottom-18 right-5   /* 右下からの余白 */
          w-16 h-16
          rounded-full
          bg-secondary
          flex items-center justify-center
        "
        aria-label="話し相手追加ボタン"
      >
        <UserRoundPlus size={26} style={{ color: "var(--light)" }} />
      </button>
    </main>
  );
}
