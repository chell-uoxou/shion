export default function Page() {
  const today = new Date();

  return (
    <div className="bg-white w-full h-screen">
      <h1 className="flex justify-center ">shion logo</h1>
      <div>
        <p>
          {" "}
          {today.toLocaleDateString("ja-JP", {
            month: "numeric",
            day: "numeric",
          })}
        </p>
      </div>
      <div className="flex flex-col justify-center">
        <input type="text" placeholder="タイトル" className="w-[90%] mx-auto" />
        <textarea
          name=""
          id=""
          placeholder="できごとや発見の詳細"
          className="w-[90%] mx-auto"
        ></textarea>
      </div>
      <div className="flex flex-col items-center bg-[var(--light)] border-[var(--thirdly)] border-2 rounded-2xl mx-10">
        <p className="text-[var(--thirdly)]">1/2</p>
        <p className="text-[var(--secondary)]">
          そのできごとや発見を一言で表すと？
        </p>
      </div>
    </div>
  );
}
