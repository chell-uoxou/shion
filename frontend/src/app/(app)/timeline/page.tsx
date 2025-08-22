"use client";
import { CirclePlus, Search } from "lucide-react";
export default function Page() {
  const hasMemory = false;

  return (
    <>
      <div className="flex justify-center relative max-w-[90%] mx-auto">
        <input
          type="text"
          className="w-full h-8 bg-white border-2 rounded-xl border-[#A19EA7] p-2"
        />
        <button
          className="absolute right-0 m-1"
          onClick={() => {
            console.log("押した");
          }}
        >
          <Search />
        </button>
      </div>
      <div className="w-full h-full">
        {hasMemory ? (
          <div>メモリー一覧</div>
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
