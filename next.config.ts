import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/scoreboard",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
