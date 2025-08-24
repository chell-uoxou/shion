"use client";
import { ChevronLeft, CirclePlus } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

import MemoryCard from "@/features/memoryTimeline/components/MemoryCard";
import { SearchForm } from "@/features/memoryTimeline/components/SearchForm";
import {
  useGetFriendsId,
  useGetMemories,
} from "@/generated/api/default/default";
import LoadingWithText from "@/components/LoadingWithText";
import Link from "next/link";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const friendIdFilter = searchParams.get("friend_id");
  const { data, isLoading } = useGetMemories(
    friendIdFilter ? { friend_id: Number(friendIdFilter) } : undefined
  );
  const { data: filteringFriendData } = useGetFriendsId(Number(friendIdFilter));
  const hasMemory = isLoading ? false : data?.data.length !== 0;
  const memories = data?.data ?? [];
  console.log(friendIdFilter);

  const handleback = () => {
    router.push("/recent");
  };
  return (
    <div className="h-[calc(100vh-120px)] flex flex-col w-full">
      {friendIdFilter ? (
        <div className="relative flex items-center justify-center py-2 h-20">
          <div className="absolute left-2" onClick={handleback}>
            <ChevronLeft size={28} className="cursor-pointer text-primary" />
          </div>
          <h1 className="text-lg text-center text-primary">
            {filteringFriendData?.data.display_name} さんに伝えたいできごと
          </h1>
        </div>
      ) : (
        <div className="mb-12">
          <SearchForm />
        </div>
      )}
      <div className="flex-1 w-full px-6 overflow-y-auto">
        <div className="flex flex-col items-center gap-6">
          {isLoading ? (
            <LoadingWithText />
          ) : hasMemory ? (
            memories.map((memory) => (
              <MemoryCard
                key={memory.id}
                occurredAt={memory.created_at ?? null}
                title={memory.title ?? "タイトルなし"}
                detail={memory.note ?? "詳細なし"}
                location={memory.location ?? "場所なし"}
                imageUrl={null}
              />
            ))
          ) : (
            <div className="h-full flex items-center justify-center text-center">
              できごとがありません <br />
              右下のボタンから追加しましょう
            </div>
          )}
        </div>
      </div>
      <Link href="/memories/new">
        <CirclePlus className="fill-[var(--brand-violet-3)] text-[var(--brand-violet-1)] w-16 h-16 fixed bottom-18 right-5" />
      </Link>
    </div>
  );
}
