"use client";

import { Button } from "@/components/ui/button";

export default function Page() {
  const handleClick = () => {
    window.location.href = "http://localhost:8080/login";
  };

  return (
    <div>
      <h1>Shion login</h1>
      <Button onClick={handleClick}>Login with Google</Button>
    </div>
  );
}
