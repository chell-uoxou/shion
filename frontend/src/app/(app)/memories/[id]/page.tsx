"use client";
import { use } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div>
      <p>できごとidが{id}のできごとを表示</p>
    </div>
  );
}
