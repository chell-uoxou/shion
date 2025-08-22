import { House, UserRound, UsersRound } from "lucide-react";
import { PropsWithChildren } from "react";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="h-svh flex flex-col gap-0">
      <div className="flex items-center justify-center h-16">shion logo</div>
      <div className="flex-1">{children}</div>
      <footer className="flex justify-between bg-neutral-200 h-14 items-center px-10">
        <UsersRound />
        <House />
        <UserRound />
      </footer>
    </div>
  );
}
