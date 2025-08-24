import LoadingSpinner from "@/components/LoadingSpinner";
import TimelineInner from "@/features/timeline/TimelineInner";
import React, { Suspense } from "react";

function Page() {
  return (
    <Suspense
      fallback={
        <div className="size-full flex items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <TimelineInner />
    </Suspense>
  );
}

export default Page;
