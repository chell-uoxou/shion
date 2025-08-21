"use client";

import { useState } from "react";

// ↑おまじない

export default function Page() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    // hensuというJSの変数に文字列を入れる
    const hensu = "こんにちは";

    // ブラウザのコンソールに、hensuの中身と、状態countの中身を出す
    console.log(hensu, count);

    // 状態「count」を今より1増やして、画面を書き直す
    setCount((prev) => prev + 1);
  };

  return (
    <div className="p-5">
      <div className="w-64 flex flex-col gap-2">
        <h1 className="bg-red-400 text-center">soraのReact練習°˖✧◝(⁰▿⁰)◜✧˖°</h1>
        <button
          className="bg-black text-white px-2 py-1 rounded-lg"
          onClick={handleClick}
        >
          押す
        </button>
        <p>{count}</p>
      </div>
    </div>
  );
}
