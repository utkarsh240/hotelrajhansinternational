import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Note: If you are hosting on GitHub Pages under a subfolder (e.g. https://<username>.github.io/<repo-name>),
  // you must add the repo name as basePath, like so:
  // basePath: "/<repo-name>",
};

export default nextConfig;
