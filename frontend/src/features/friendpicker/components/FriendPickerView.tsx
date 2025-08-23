"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Check, X } from "lucide-react";
import UserRow from "@/features/FriendListitem/page";
import { SearchForm } from "@/features/memoryTimeline/components/SearchForm";
import { Friend } from "@/generated/api/model";
import { Checkbox } from "@/components/ui/checkbox";

type UserSelectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memoryFriends: { friend: Friend; reason: string }[];
  setMemoryFriends: React.Dispatch<
    React.SetStateAction<{ friend: Friend; reason: string }[]>
  >;
  friends: Friend[];
  onSelectFriend: (selected: Friend) => void;
  onSave: () => void;
};
// -------------------
// ユーザー選択ダイアログ
// -------------------
export function UserSelectDialog({
  open,
  onOpenChange,
  memoryFriends,
  setMemoryFriends,
  friends,
  onSelectFriend,
  onSave,
}: UserSelectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* 背景だけ暗くする */}
      <DialogOverlay className="fixed inset-0 bg-black/40" />

      {/* ダイアログ本体 */}
      <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md bg-[var(--brand-violet-1)] h-[500px] p-4">
        <DialogHeader>
          <DialogTitle className="text-xl text-[var(--brand-violet-4)]">
            ＜話し相手を追加＞
          </DialogTitle>
        </DialogHeader>

        <SearchForm />

        {/* ユーザーリスト */}
        <div className="max-h-[300px] overflow-y-auto space-y-2">
          {friends.map((friend) => (
            <div key={friend.id} className="flex items-center space-x-3">
              <Checkbox
                checked={memoryFriends.some((m) => m.friend.id === friend.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setMemoryFriends((prev) => [
                      ...prev,
                      { friend: friend, reason: "" },
                    ]);
                  } else {
                    setMemoryFriends((prev) =>
                      prev.filter((m) => m.friend.id !== friend.id)
                    );
                  }
                }}
              />
              <div
                className="cursor-pointer"
                onClick={() => {
                  onSelectFriend(friend);
                }}
              >
                <UserRow
                  src="/user-icon.svg"
                  name={friend.display_name || ""}
                />
              </div>
            </div>
          ))}
        </div>

        {/* 決定ボタン */}
        <div className="flex justify-center mt-2">
          <button
            type="button"
            className="w-35 h-14 rounded-xl bg-[var(--brand-violet-3)] flex items-center justify-center"
            aria-label="チェックボタン"
            onClick={onSave}
          >
            <Check size={26} style={{ color: "var(--brand-violet-1)" }} />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type UserDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  friend: Friend | null;
  onSave: (friend: Friend, reason: string) => void;
};
// -------------------
// 追加対象として選んだユーザーに、理由メモを添えるダイアログ
// -------------------
export function UserDetailDialog({
  open,
  onOpenChange,
  friend,
  onSave,
}: UserDetailDialogProps) {
  const [text, setText] = useState(""); // ← ここで state を作る

  if (!friend) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="fixed inset-0 bg-black/40" />
      <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-sm bg-[var(--brand-violet-1)] h-[500px] p-4">
        <DialogHeader>
          <DialogTitle>
            <UserRow src="/user-icon.svg" name={friend.display_name || ""} />
          </DialogTitle>
        </DialogHeader>

        {/* 長方形入力 */}
        <textarea
          className="w-full h-32 rounded-xl border border-gray-300 p-4 mt-4 resize-none"
          placeholder="ここに入力"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* メモ説明 */}
        <div
          className="flex flex-col items-center 
             bg-[var(--brand-violet-1)] border-[var(--brand-violet-2)] border-2 
             rounded-2xl p-4 w-full font-serif"
        >
          <p className="text-[var(--brand-violet-3)] text-center text-lg">
            この人に話したいと思ったことを
            <br />
            メモできます
          </p>
        </div>

        <div className="flex justify-center mt-4 gap-2">
          {/* 閉じるボタン */}
          <button
            type="button"
            className="w-35 h-14 rounded-xl bg-white flex items-center justify-center"
            aria-label="閉じるボタン"
            onClick={() => onOpenChange(false)}
          >
            <X size={26} style={{ color: "var(--brand-violet-3)" }} />
          </button>

          {/* チェックボタン */}
          <button
            type="button"
            className="w-35 h-14 rounded-xl bg-[var(--brand-violet-3)] flex items-center justify-center"
            aria-label="チェックボタン"
            onClick={() => {
              onSave(friend, text);
              onOpenChange(false);
            }}
          >
            <Check size={26} style={{ color: "var(--brand-violet-1)" }} />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
