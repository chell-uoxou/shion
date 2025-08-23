import Image from "next/image";
import React from "react";
import Link from "next/link";
import {
  Edit3,
  Trash2,
  ChevronRight,
  UsersRound,
  KeyRound,
} from "lucide-react";

type UserIconProps = {
  src: string;
  alt?: string;
  size?: number;
  className?: string;
};

const UserIcon: React.FC<UserIconProps> = ({
  src,
  alt = "user icon",
  size = 48,
  className,
}) => {
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
    {
      label: "話し相手一覧",
      leftIcon: <UsersRound size={20} className="text-[var(--brand-violet-2)]" />,
      href: "/account/friends",
    },
    {
      label: "プロフィール編集",
      leftIcon: <Edit3 size={20} className="color-brand-violet-2" />,
    },
    {
      label: "パスワード変更",
      leftIcon: <KeyRound size={20} className="color-brand-violet-2" />,
    },
    {
      label: "アカウント削除",
      leftIcon: <Trash2 size={20} className="color-brand-violet-2" />,
    },
  ];

  return (
    <main className="flex flex-col items-center mt-4">
      <UserProfile src="/user-icon.svg" name="ユーザー1" />

      {/* ボタン群 */}
      <div className="flex flex-col items-center mt-6 space-y-5">
        {buttons.map((btn, index) => {
          const content = (
            <button
              key={index}
              className="flex items-center justify-between w-full px-4 py-3 rounded-lg shadow-md hover:shadow-lg transition"
              style={{
                backgroundColor: "white",
                color: "var(--brand-violet-4)",
                border: "2px solid var(--brand-violet-3)",
              }}
            >
              <div className="flex items-center gap-x-2">
                <div>{btn.leftIcon}</div>
                <span>{btn.label}</span>
              </div>
              <ChevronRight className="text-[var(--brand-violet-2)]" size={20} />
            </button>
          );

          return btn.href ? (
            <Link key={index} href={btn.href} className="w-64">
              {content}
            </Link>
          ) : (
            <div key={index} className="w-64">
              {content}
            </div>
          );
        })}

      </div>
    </main>
  );
}
