"use client";

import { useState } from "react";

type CounterProps = {
  initialValue?: number;
};

export const Counter = (props: CounterProps) => {
  const [count, setCount] = useState(props.initialValue ?? 0);

  const handleClick = () => {
    // hensuというJSの変数に文字列を入れる
    const hensu = "こんにちは";

    // ブラウザのコンソールに、hensuの中身と、状態countの中身を出す
    console.log(hensu, count);

    // 状態「count」を今より1増やして、画面を書き直す
    setCount((prev) => prev + 1);
  };
  return (
    <div className="flex gap-4 items-center border-1 p-4 rounded-xl">
      <button
        className="bg-black text-white px-2 py-1 rounded-lg"
        onClick={handleClick}
      >
        押す
      </button>
      <p>{count}</p>
    </div>
  );
};
