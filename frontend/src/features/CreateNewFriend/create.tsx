"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import { X, Check } from "lucide-react";

type User = {
  id: string;
  name: string;
};

type CreateFriendDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
};

export function CreateFriendDialog({
  open,
  onOpenChange,
  user,
}: CreateFriendDialogProps) {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="fixed inset-0 bg-black/40" />
      <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-sm bg-[var(--brand-violet-1)] h-[500px] p-4">
        <DialogHeader>
          <DialogTitle className="text-xl text-[var(--brand-violet-4)] text-center">
            ＜話し相手を追加＞
          </DialogTitle>
        </DialogHeader>

        {/* 長方形入力 1 */}
        <div className="flex flex-col gap-2">
          <p>名前</p>
          <textarea
            className="w-full h-15 rounded-xl border border-gray-300 p-4 resize-none"
            placeholder="名前を入力…"
            value={text1}
            onChange={(e) => setText1(e.target.value)}
          />
        </div>

        {/* 長方形入力 2 */}
        <div className="flex flex-col gap-2">
          <p>メモ </p>
          <textarea
            className="w-full h-32 rounded-xl border border-gray-300 p-4 resize-none"
            placeholder="メモを入力…"
            value={text2}
            onChange={(e) => setText2(e.target.value)}
          />
        </div>
        {/* ボタン群 */}
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
          >
            <Check size={26} style={{ color: "var(--brand-violet-1)" }} />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
