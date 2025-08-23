"use client";
import { CirclePlus } from "lucide-react";

import MemoryCard from "@/features/memoryTimeline/components/MemoryCard";
import { SearchForm } from "@/features/memoryTimeline/components/SearchForm";

export default function Page() {
  const hasMemory = true;

  return (
    <>
      <SearchForm />
      <div className="w-full h-full">
        {hasMemory ? (
          <MemoryCard />
        ) : (
          <div className="h-full flex items-center justify-center ">
            まだ出来事がありません
          </div>
        )}
      </div>
      <CirclePlus className="fill-[#7C56B5] text-[#F4EFFA] w-16 h-16 fixed bottom-18 right-5" />
    </>
  );
}
