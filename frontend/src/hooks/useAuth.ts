"use client";

import { useGetMe } from "@/generated/api/default/default";

export const useAuth = () => {
  const { data, isLoading, error } = useGetMe();
  const isLoggedIn = !!data?.data && !isLoading && !error;

  console.log("User data:", data?.data);

  return {
    user: data?.data,
    isLoggedIn,
    isLoading,
    error,
  };
};
