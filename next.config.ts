import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // output: "export",
  
  images: {
    // loader:"custom",
    // loaderFile:"/my-loader.ts",
    unoptimized: true,
  },
};

export default nextConfig;
