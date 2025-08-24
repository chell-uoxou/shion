import LoadingWithText from "@/components/LoadingWithText";
import CallbackPageInner from "@/features/callback/CallbackPageInner";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="h-svh w-full flex items-center justify-center">
          <LoadingWithText text="ログイン中..." />
        </div>
      }
    >
      <CallbackPageInner />
    </Suspense>
  );
}
