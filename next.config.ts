import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/og/shop-desk.png", destination: "/og/shop-desk" },
    ];
  },
};

export default nextConfig;
