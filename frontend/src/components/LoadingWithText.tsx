import React from "react";
import LoadingSpinner from "./LoadingSpinner";

const LoadingWithText = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <LoadingSpinner />
      <p className="text-black/50">思い出しています...</p>
    </div>
  );
};

export default LoadingWithText;
