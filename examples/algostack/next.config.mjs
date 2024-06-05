/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ["@avmkit/sdk", "siwa"],

  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
