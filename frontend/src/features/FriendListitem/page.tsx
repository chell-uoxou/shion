import Image from "next/image";
import React from "react";

type UserIconProps = {
  src: string;
  alt?: string;
  size?: number;
};

export const UserIcon: React.FC<UserIconProps> = ({
  src,
  alt = "user icon",
  size = 48,
}) => {
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
  src: string; // ユーザーアイコン画像
  name: string; // ユーザー名
  iconSize?: number;
};

const UserRow: React.FC<UserRowProps> = ({ src, name, iconSize = 48 }) => {
  return (
    <div className="flex items-center space-x-3">
      <UserIcon src={src} size={iconSize} />
      <span className="text-lg font-medium">{name}</span>
    </div>
  );
};

export default UserRow;
