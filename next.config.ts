import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The handoff hotlinks the hero photography from Unsplash and Pexels.
    // Before launch, download the originals (scripts/fetch-images.sh), drop them
    // in public/images/ and switch `image`/`imageAlt` in src/data/cities.ts to
    // the local paths — then these remote patterns can go.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
};

export default nextConfig;
