import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    //GoogleとGitHubのアカウント画像の読み込みを許可
    domains: ["lh3.googleusercontent.com"],
  },
};

export default nextConfig;
