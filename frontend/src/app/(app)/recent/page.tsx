"use client";

import { SearchForm } from "@/features/memoryTimeline/components/SearchForm";
import { RecentFriend } from "@/features/recent/RecentFriend";

export default function Page() {
  const friends = [
    { id: 1, name: "ユーザー1", event: "出来事A", date: "7/28" },
    { id: 2, name: "ユーザー2", event: "出来事B", date: "7/30" },
    { id: 3, name: "ユーザー3", event: "出来事C", date: "8/1" },
    { id: 4, name: "ユーザー4", event: "出来事D", date: "8/3" },
    { id: 4, name: "ユーザー5", event: "出来事E", date: "8/4" },
    { id: 4, name: "ユーザー5", event: "出来事E", date: "8/4" },
    { id: 4, name: "ユーザー5", event: "出来事E", date: "8/4" },
    { id: 4, name: "ユーザー5", event: "出来事E", date: "8/4" },
    { id: 4, name: "ユーザー5", event: "出来事E", date: "8/4" },
  ];
  return (
    <div className="h-full bg-[var(--brand-violet-1)]">
      <SearchForm />
      <div className="p-4">
        <div className="space-y-3 max-h-160 overflow-y-auto">
          {friends.map((friend) => (
            <RecentFriend
              key={friend.id}
              name={friend.name}
              event={friend.event}
              date={friend.date}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
