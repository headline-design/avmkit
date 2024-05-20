/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ["@siwa/sdk", "siwa"],

  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
