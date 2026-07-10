import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Configured basePath for GitHub Pages deployment under the repository name '/ranjhans'
  basePath: "/ranjhans",
};

export default nextConfig;
