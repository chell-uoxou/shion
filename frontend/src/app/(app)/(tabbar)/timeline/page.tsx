"use client";
import { CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";

import MemoryCard from "@/features/memoryTimeline/components/MemoryCard";
import { SearchForm } from "@/features/memoryTimeline/components/SearchForm";
import { useGetMemories } from "@/generated/api/default/default";
import LoadingSpinner from "@/components/LoadingSpinner";
import LoadingWithText from "@/components/LoadingWithText";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  const { data, isLoading } = useGetMemories();
  const router = useRouter();

  const hasMemory = isLoading ? false : data?.data.length !== 0;
  const memories = data?.data ?? [];

  return (
    <>
      <SearchForm />
      <div className="w-full px-6 pt-12">
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
    </>
  );
}
