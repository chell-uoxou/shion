import React from "react";
import Spiner from "./Spiner";

const LoadingSpinner = () => {
  return (
    <div className="animate-[spin_5s_linear_infinite] size-12">
      <Spiner />
    </div>
  );
};

export default LoadingSpinner;
