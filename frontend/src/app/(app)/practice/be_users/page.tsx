"use client";

import { useGetPracticeUsers } from "@/generated/api/default/default";

const Page = () => {
  const { data, error, isLoading } = useGetPracticeUsers();
  const users = data?.data || [];
  return (
    <div>
      <h1>shion API Server Users Debug</h1>
      {isLoading && <p>Loading...</p>}
      {users && (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.id}:{user.name}
            </li>
          ))}
        </ul>
      )}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default Page;
