import type { NextConfig } from "next";

/**
 * Two build modes.
 *
 * Default — a normal Next.js app for a Node host (Vercel, Netlify, a
 * container). `next/image` optimises the hero photography at request time.
 *
 * `NEXT_OUTPUT=export` — a fully static site for a file host such as GitHub
 * Pages. There is no image optimiser there, so images are served as-is, and
 * `NEXT_BASE_PATH` lets the site live under a sub-path (a GitHub Pages project
 * site is served from /<repo>/).
 */
const isStaticExport = process.env.NEXT_OUTPUT === "export";
const basePath = process.env.NEXT_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  ...(isStaticExport
    ? {
        output: "export",
        images: { unoptimized: true },
      }
    : {
        images: {
          // The hero photography is hotlinked from Unsplash and Pexels until
          // scripts/fetch-images.sh is run and src/data/cities.ts points at
          // local files; then these can go.
          remotePatterns: [
            { protocol: "https", hostname: "images.unsplash.com" },
            { protocol: "https", hostname: "images.pexels.com" },
          ],
        },
      }),
};

export default nextConfig;
