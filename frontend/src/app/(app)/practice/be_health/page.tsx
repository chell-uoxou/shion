"use client";
import { useGetHealth } from "@/generated/api/default/default";

const Page = () => {
  const { data, error, isLoading } = useGetHealth();

  return (
    <div>
      <h1>shion API Server Health Check</h1>
      {isLoading && <p>Loading...</p>}
      {data && <p>{data.data.message}</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default Page;
