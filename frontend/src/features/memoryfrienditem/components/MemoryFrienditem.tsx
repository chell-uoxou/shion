import Image from "next/image";
import React from "react";

type UserIconProps = {
  src: string;
  alt?: string;
  size?: number;
};

const UserIcon: React.FC<UserIconProps> = ({ src, alt = "user icon", size = 48 }) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="rounded-full object-cover"
    />
  );
};

type UserRowProps = {
  src: string;      // ユーザーアイコン画像
  name: string;     // ユーザー名
  comment?: string; // コメント（オプション）
  iconSize?: number;
};

const UserRow: React.FC<UserRowProps> = ({ src, name, comment, iconSize = 48 }) => {
  return (
    <div className="flex flex-col space-y-2">
      {/* 上段: アイコンと名前 */}
      <div className="flex items-center space-x-3">
        <UserIcon src={src} size={iconSize} />
        <span className="text-lg font-medium">{name}</span>
      </div>

      {/* 下段: コメント */}
      {comment && (
        <div className="ml-12 px-3 py-1 text-sm text-[var(--brand-violet-4)]">
          {comment}
        </div>
      )}
    </div>
  );
};

export default UserRow;
