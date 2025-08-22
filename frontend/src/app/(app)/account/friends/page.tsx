import React from "react";
import UserRow from "@/features/FriendListitem/page"; // パスは実際の場所に合わせて調整

export default function Page() {
  return (
    <main>
      <h1>話し相手の一覧</h1>
      <UserRow src="/user-icon.svg" name="ユーザー1" />
    </main>
  );
}
