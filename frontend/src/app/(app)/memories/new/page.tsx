"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check, UserRoundPlus, Plus, MapPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserDetailDialog,
  UserSelectDialog,
} from "@/features/friendpicker/components/FriendPickerView";
import { useGetFriends } from "@/generated/api/default/default";
import { Friend } from "@/generated/api/model";
import UserRow, { UserIcon } from "@/features/FriendListitem/page";

export default function Page() {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [doneInput, setDoneInput] = useState(false);
  const [doneTextarea, setDoneTextarea] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [memoryFriends, setMemoryFriends] = useState<
    { friend: Friend; reason: string }[]
  >([]);

  const { data: friendsData } = useGetFriends();
  const friends = friendsData?.data || [];

  const today = new Date();

  const handleInputComplete = () => {
    if (title.trim() !== "") setDoneInput(true);
  };

  const handleTextareaComplete = () => {
    if (details.trim() !== "") setDoneTextarea(true);
  };

  return (
    <div className="bg-white w-full min-h-screen relative flex flex-col items-center">
      {/* ヘッダー */}
      <h1 className="flex justify-center items-center h-16">shion logo</h1>

      {/* 画像 */}
      <AnimatePresence>
        {!doneInput && (
          <motion.div
            className="relative w-55 mx-auto mt-5"
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
        className="w-[90%] max-w-md mt-3 mx-auto pl-0"
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
        className="flex flex-col justify-center w-[90%] max-w-md mt-2"
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
                    bg-[var(--brand-violet-1)] rounded-2xl p-4 w-[90%] max-w-md"
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

      {/* Textarea 完了後に表示する要素 */}
      {doneTextarea && (
        <motion.div
          className="flex flex-col items-center mb-10 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {memoryFriends.length == 0 ? (
            <div className="flex flex-col items-center gap-3">
              <Button
                onClick={() => setSelectOpen(true)}
                variant="link"
                className="border-2 border-dashed rounded-full text-[var(--brand-violet-3)]"
              >
                <UserRoundPlus />
              </Button>
              <p className="text-[var(--brand-violet-3)]">話し相手を追加</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              {memoryFriends.map((friend) => (
                <UserIcon
                  key={friend.friend.id}
                  src={friend.friend.avatar_icon || "/user-icon.svg"}
                  size={60}
                />
              ))}
            </div>
          )}

          <UserSelectDialog
            open={selectOpen}
            onOpenChange={setSelectOpen}
            memoryFriends={memoryFriends}
            setMemoryFriends={setMemoryFriends}
            friends={friends}
            onSelectFriend={(selected) => {
              if (selected) {
                setSelectedFriend(selected);
                setDetailOpen(true);
              }
              setSelectOpen(false);
              console.log("選択されたユーザー:", selected);
            }}
            onSave={() => {
              setSelectOpen(false);
            }}
          />
          <UserDetailDialog
            open={detailOpen}
            onOpenChange={(
              isOpen: boolean | ((prevState: boolean) => boolean)
            ) => {
              setDetailOpen(isOpen); // 詳細ダイアログの開閉
              if (!isOpen) setSelectOpen(true); // 閉じたら選択ダイアログを再表示
            }}
            friend={selectedFriend}
            onSave={(friend, reason) => {
              setMemoryFriends((prev) => [...prev, { friend, reason }]);
              setDetailOpen(false);
            }}
          />
          <div className="flex space-x-6 mb-8">
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
            className="w-24 mb-8 bg-[var(--brand-violet-3)] text-white rounded-2xl"
            variant="default"
          >
            <Check />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
