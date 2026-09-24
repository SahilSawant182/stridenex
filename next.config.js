const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "devstridenex.quantcloud.in",
      },
      {
        protocol: "https",
        hostname: "officestridenex.quantcloud.in",
      },
    ],
  },
};

module.exports = withPWA(nextConfig);