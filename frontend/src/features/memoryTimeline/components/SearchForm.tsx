import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const SearchForm = () => {
  return (
    <div className="flex justify-center relative max-w-[90%] mx-auto my-2 items-center">
      {/* shadcn/ui の Input を使う */}
      <Input
        type="text"
        className="w-full h-10 bg-white border-2 rounded-xl border-[#A19EA7] p-2"
      />
      <button
        className="absolute right-2 m-1"
        aria-label="検索ボタン"
        onClick={() => {
          console.log("押した");
        }}
      >
        <Search className="text-[#A19EA7]" size={24} />
      </button>
    </div>
  );
};
