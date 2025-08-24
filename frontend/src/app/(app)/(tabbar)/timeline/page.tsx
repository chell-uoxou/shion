"use client";
import { ChevronLeft, CirclePlus } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

import MemoryCard from "@/features/memoryTimeline/components/MemoryCard";
import { SearchForm } from "@/features/memoryTimeline/components/SearchForm";
import { useGetMemories } from "@/generated/api/default/default";
import LoadingWithText from "@/components/LoadingWithText";
import Link from "next/link";

export default function Page() {
  const { data, isLoading } = useGetMemories();
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasMemory = isLoading ? false : data?.data.length !== 0;
  const memories = data?.data ?? [];

  const friendIdFilter = searchParams.get("friend_id");
  console.log(friendIdFilter);

  const handleback = () => {
    router.push("/recent");
  };
  return (
    <div className="h-[calc(100vh-120px)] flex flex-col w-full">
      {friendIdFilter ? (
        <div className="relative flex items-center justify-center py-2">
          <div className="absolute left-1" onClick={handleback}>
            <ChevronLeft size={28} className="cursor-pointer text-primary" />
          </div>
          <h1 className="text-2xl text-center text-primary">
            {friendIdFilter}の話し相手
          </h1>
        </div>
      ) : (
        <SearchForm />
      )}
      <div className="flex-1 w-full px-6 pt-12 overflow-y-auto">
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
            <div className="h-full flex items-center justify-center ">
              まだ出来事がありません
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
