"use client";
import { useState } from "react";

const Page = () => {
  const [data, setData] = useState<string | null>(null);

  const handleClick = async () => {
    setData("loading"); // Reset data before fetching
    const response = await fetch("http://localhost:8080/health");
    const result = await response.json();
    setData(JSON.stringify(result, null, 2)); // Format JSON for better readability
  };

  return (
    <div>
      <h1>localhost shion backend health check</h1>
      <button onClick={handleClick}>Check Health</button>
      {data && <p>{data}</p>}
    </div>
  );
};

export default Page;
