import Image from "next/image";
import React from "react";
import { Edit3, Trash2, Settings, Info, ChevronRight, UsersRound, KeyRound } from "lucide-react";


type UserIconProps = {
  src: string;
  alt?: string;
  size?: number;
  className?: string;
};

const UserIcon: React.FC<UserIconProps> = ({ src, alt = "user icon", size = 48, className }) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full object-cover ${className ?? ""}`}
    />
  );
};

// ここでアイコン + 名前のセットを作成
type UserProfileProps = {
  src: string;
  name: string;
  size?: number;
};

const UserProfile: React.FC<UserProfileProps> = ({ src, name, size = 100 }) => {
  return (
    <div className="text-center mt-6">
      <UserIcon src={src} size={size} className="mx-auto" />
      <p className="mt-[20px] text-2xl">{name}</p>
    </div>
  );
};

export default function Page() {

  const buttons = [
    { label: "話し相手一覧", leftIcon: <UsersRound size={20} /> },
    { label: "プロフィール編集", leftIcon: <Edit3 size={20} /> },
    { label: "パスワード変更", leftIcon: <KeyRound size={20} /> },
    { label: "アカウント削除", leftIcon: <Trash2 size={20} /> },
  ];

  return (
    <main className="flex flex-col items-center mt-4">
      <UserProfile src="/user-icon.svg" name="ユーザー1" />

      {/* ボタン群 */}
      <div className="flex flex-col items-center mt-6 space-y-5">
        {buttons.map((btn, index) => (
          <button
            key={index}
            className="flex items-center justify-between w-64 px-4 py-3 rounded-lg shadow-md hover:shadow-lg transition"
            style={{
              backgroundColor: "white",               // 背景色
              color: "var(--primary)",               // 文字色
              border: "2px solid var(--secondary)",  // 枠線
            }}
          >
            {/* 左アイコン + ラベル */}
            <div className="flex items-center space-x-2">
              {React.cloneElement(btn.leftIcon, { color: "var(--thirdly)", size: 20 })}
              <span>{btn.label}</span>
            </div>

            {/* 右の矢印 */}
            {React.createElement(ChevronRight, { color: "var(--thirdly)", size: 20 })}
          </button>
        ))}
      </div>
    </main>
  );
}