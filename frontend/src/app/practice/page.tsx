"use client";
// ↑おまじない

import { Counter } from "@/features/reactPractice/components/Counter";
import { RedTitle } from "@/features/reactPractice/components/RedTitle";

export default function Page() {
  return (
    <div className="p-5">
      <div className="flex flex-col gap-4">
        <RedTitle text="soraのReact練習°˖✧◝(⁰▿⁰)◜✧˖°" />
        <RedTitle text="こんにちは" />
        <RedTitle text="React教室です" />
        <RedTitle text="よろしくお願いします" />
        <Counter initialValue={50} />
        <Counter />
        <Counter />
        <Counter />
        <Counter />
      </div>
    </div>
  );
}
