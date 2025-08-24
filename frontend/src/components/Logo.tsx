import Image from "next/image";

interface LogoProps {
  className?: string;
}
export const Logo = ({ className }: LogoProps) => {
  return (
    <Image
      className={className}
      src="/logo.svg"
      alt="ロゴ画像"
      width={80}
      height={80}
    />
  );
};
