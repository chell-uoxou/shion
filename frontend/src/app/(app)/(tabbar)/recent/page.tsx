"use client";

import { SearchForm } from "@/features/memoryTimeline/components/SearchForm";
import { RecentFriend } from "@/features/recent/RecentFriend";
import { useGetRecentFriends } from "@/generated/api/default/default";

export default function Page() {
  const { data } = useGetRecentFriends();

  const friends = data?.data ?? [];

  console.log(friends);

  return (
    <div className="h-full bg-[var(--brand-violet-1)]">
      <SearchForm />
      <div className="p-4">
        <div className="space-y-3 max-h-160 overflow-y-auto">
          {friends.map((friend) => (
            <RecentFriend
              key={friend.friend?.id}
              id={String(friend.friend?.id)}
              name={friend.friend?.display_name ?? ""}
              event={friend.recent_memory?.title ?? ""}
              date={
                friend.recent_memory?.occurred_at
                  ? new Date(friend.recent_memory?.occurred_at)
                  : undefined
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
