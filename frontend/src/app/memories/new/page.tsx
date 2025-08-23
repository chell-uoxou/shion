"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check, UserRoundPlus, Plus, MapPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  UserDetailDialog,
  UserSelectDialog,
} from "@/features/friendpicker/components/FriendPickerView";

export default function Page() {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [doneInput, setDoneInput] = useState(false);
  const [doneTextarea, setDoneTextarea] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const today = new Date();

  //ダミーユーザー
  const users = [
    { id: "1", name: "ユーザー1" },
    { id: "2", name: "ユーザー2" },
    { id: "3", name: "ユーザー3" },
  ];

  const handleInputComplete = () => {
    if (title.trim() !== "") setDoneInput(true);
  };

  const handleTextareaComplete = () => {
    if (details.trim() !== "") setDoneTextarea(true);
  };

  return (
    <motion.div
      className="w-full min-h-screen relative flex flex-col items-center"
      animate={{
        backgroundColor: doneTextarea ? "var(--brand-violet-2)" : "white",
      }}
      transition={{ duration: 0.5 }}
    >
      {/* SVG 背景：入力後に表示 */}
      {doneTextarea && (
        <motion.img
          src="/vector.svg"
          alt="Background Vector"
          className="pointer-events-none fixed inset-0 w-[5000px] h-[5000px] opacity-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-200"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          style={{ transform: "translate(-50%, -50%)" }}
        />
      )}

      {/* ヘッダー */}
      <h1 className="flex justify-center items-center h-16 z-10">shion logo</h1>

      {/* 画像 */}
      <AnimatePresence>
        {!doneInput && (
          <motion.div
            className="relative w-55 mx-auto mt-5 z-10"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src="/shion_svgs/artboard_3.svg"
              className="w-full h-full object-contain"
              alt="illustration"
            />
            <p className="absolute top-1/2 left-1/2 w-full transform -translate-x-1/2 -translate-y-1/2 text-sm text-center font-serif">
              あなたの「話したい」をここに
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 日付 */}
      <motion.div
        className="w-[90%] max-w-md mt-3 mx-auto pl-0 z-10"
        animate={{ y: doneInput ? -20 : 0 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <p className="text-xl text-gray-400 text-left">
          {today.toLocaleDateString("ja-JP", {
            month: "numeric",
            day: "numeric",
          })}
        </p>
      </motion.div>

      {/* 入力エリア */}
      <motion.div
        className="flex flex-col justify-center w-[90%] max-w-md mt-2 z-10"
        animate={{ y: doneInput ? -20 : 0 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        {/* Input */}
        {!doneInput ? (
          <Input
            type="text"
            value={title}
            placeholder="タイトル"
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleInputComplete}
            onKeyDown={(e) => e.key === "Enter" && handleInputComplete()}
            className="h-14 w-full mx-auto border-none shadow-none focus-visible:ring-0 focus-visible:border-none focus-visible:shadow-none placeholder:text-gray-400 text-2xl mb-4"
          />
        ) : (
          <p className="text-2xl mb-4">{title}</p>
        )}

        {/* Textarea */}
        {!doneTextarea ? (
          <motion.div
            animate={{ height: doneInput ? 300 : 100 }}
            transition={{ type: "spring", stiffness: 80 }}
          >
            <Textarea
              value={details}
              placeholder="できごとや発見の詳細"
              onChange={(e) => setDetails(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTextareaComplete()}
              onBlur={handleTextareaComplete}
              className="w-full h-full border-none shadow-none focus-visible:ring-0 focus-visible:border-none focus-visible:shadow-none placeholder:text-gray-400 max-h-45 overflow-y-auto"
            />
          </motion.div>
        ) : (
          <p className="w-full p-2 max-h-55 overflow-y-auto">{details}</p>
        )}
      </motion.div>

      {/* 下部カード */}
      {!doneTextarea && (
        <div
          className="fixed bottom-70 left-1/2 transform -translate-x-1/2 flex flex-col items-center 
                        bg-[var(--brand-violet-1)] rounded-2xl p-4 w-[90%] max-w-md z-10"
        >
          <p className="text-[var(--brand-violet-2)] font-serif">
            {doneInput ? "2/2" : "1/2"}
          </p>
          <p className="text-[var(--brand-violet-3)] font-serif">
            {doneInput
              ? "タイトルに書ききれなかったエピソードや想いを自由に綴りましょう"
              : "そのできごとや発見を一言で表すと？"}
          </p>
        </div>
      )}

      {/* Textarea 完了後の要素 */}
      {doneTextarea && (
        <motion.div
          className="flex flex-col items-center mb-2 space-y-4 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <Button
              onClick={() => setSelectOpen(true)}
              variant="link"
              className="fixed bottom-80 left-1/2 transform -translate-x-1/2 border-2 border-dashed rounded-full text-[var(--brand-violet-3)]"
            >
              <UserRoundPlus />
            </Button>
            <UserSelectDialog
              open={selectOpen}
              onOpenChange={setSelectOpen}
              users={users}
              onConfirm={(selected) => {
                if (selected.length > 0) {
                  setSelectedUser(selected[0]);
                  setDetailOpen(true);
                }
                setSelectOpen(false);
              }}
            />
            <UserDetailDialog
              open={detailOpen}
              onOpenChange={(isOpen) => {
                setDetailOpen(isOpen);
                if (!isOpen) setSelectOpen(true);
              }}
              user={selectedUser}
            />
          </div>
          <p className="fixed bottom-65 text-[var(--brand-violet-3)]">
            話し相手を追加
          </p>

          <div className="fixed bottom-28 flex space-x-6 mb-6">
            <div className="flex flex-col items-center space-y-2 p-4 border-2 border-dashed rounded-2xl text-[var(--brand-violet-3)]">
              <Button variant="link">
                <Plus />
              </Button>
              <p>写真を追加</p>
            </div>
            <div className="flex flex-col items-center space-y-2 p-4 border-2 border-dashed rounded-2xl text-[var(--brand-violet-3)]">
              <Button variant="link">
                <MapPlus />
              </Button>
              <p>場所を追加</p>
            </div>
          </div>

          <Button
            className="fixed bottom-12 left-1/2 transform -translate-x-1/2 w-24 bg-[var(--brand-violet-3)] text-white rounded-2xl z-20"
            variant="default"
          >
            <Check />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
