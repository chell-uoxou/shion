"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return (
    <>
      {/* <h1>shion</h1>
      <Link href="/login">Login</Link> */}
    </>
  );
}
