import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Server dynamic mode enabled for API routes, Auth middleware, and Database connection */
  images: {
    unoptimized: true,
  },
  // Keep basePath if configured for subpath routing, or empty for standard domain hosting
  basePath: "/ranjhans",
};

export default nextConfig;
