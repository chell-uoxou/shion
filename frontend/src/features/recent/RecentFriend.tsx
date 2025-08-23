"use client";

import React from "react";

type RecentFriendProps = {
  name: string;
  event: string;
  date: string;
};
export function RecentFriend(props: RecentFriendProps) {
  return (
    <div className="flex items-center space-x-4 pt-2 pb-2 m-2">
      <span className="w-15 h-15 items-center rounded-full bg-purple-600"></span>
      <div className="flex flex-col">
        <span className="text-sm text-purple-600">{props.name}</span>
        <span className="text-xs text-gray-500 opacity-75">{props.event}</span>
      </div>
      <span className="text-xs text-gray-500 ml-auto">{props.date}</span>
    </div>
  );
}
