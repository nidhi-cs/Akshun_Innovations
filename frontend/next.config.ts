import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/products/electrical-engineering", destination: "/products/electrical", permanent: true },
      { source: "/products/electronics-engineering", destination: "/products/electronics", permanent: true },
      { source: "/products/robotics-mechatronics", destination: "/products/plc-automation", permanent: true },
      { source: "/products/measuring-instruments", destination: "/products/test-measuring", permanent: true },
      { source: "/products/workbenches", destination: "/products/lab-furniture", permanent: true },
      { source: "/products/ev-lab", destination: "/products/ev-renewable", permanent: true },
    ];
  },
};

export default nextConfig;
