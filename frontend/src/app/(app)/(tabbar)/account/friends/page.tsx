"use client";

import React, { useState } from "react";
import UserRow from "@/features/FriendListitem/page"; // パスは実際の場所に合わせて調整
import { ChevronLeft, UserRoundPlus } from "lucide-react";
import Link from "next/link";
import { CreateFriendDialog } from "@/features/CreateNewFriend/create"; // ダイアログのインポート
import LoadingWithText from "@/components/LoadingWithText";

export default function Page() {
  return (
    <main className="p-4 space-y-6">
      {/* ヘッダー */}
      <div className="relative flex items-center justify-center py-2">
        <div className="absolute left-1">
          <Link href="/account">
            <ChevronLeft
              size={28}
              className="cursor-pointer text-[var(--brand-violet-4)]"
            />
          </Link>
        </div>
        <h1 className="text-2xl text-center text-[var(--brand-violet-4)]">
          話し相手一覧
        </h1>
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

      {/* 丸い追加ボタン */}
      <button
        type="button"
        className="
          fixed
          bottom-18 right-5
          w-16 h-16
          rounded-full
          bg-[var(--brand-violet-3)]
          flex items-center justify-center
        "
        aria-label="話し相手追加ボタン"
        onClick={() => setOpen(true)} // ← ダイアログを開く
      >
        <UserRoundPlus size={26} style={{ color: "var(--brand-violet-1)" }} />
      </button>

      {/* ダイアログ */}
      <CreateFriendDialog
        open={open}
        onOpenChange={setOpen}
        user={{ id: "new", name: "新しいユーザー" }} // 適当な値。必要なら null にして条件分岐可能
      />
    </main>
  );
}
