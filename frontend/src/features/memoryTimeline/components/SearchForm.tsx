import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const SearchForm = () => {
  return (
    <div className="flex justify-center relative max-w-[90%] mx-auto my-12">
      {/* shadcn/ui の Input を使う */}
      <Input
        type="text"
        className="w-full h-8 bg-white border-2 rounded-2xl border-[#A19EA7] p-2"
      />
      <button
        className="absolute right-0 m-1"
        onClick={() => {
          console.log("押した");
        }}
      >
        <Search className="text-[#A19EA7]" />
      </button>
    </div>
  );
};
