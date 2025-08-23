import React from "react";
import Logo from "./Logo";

const LoadingSpinner = () => {
  return (
    <div className="animate-[spin_5s_linear_infinite] size-12">
      <Logo />
    </div>
  );
};

export default LoadingSpinner;
