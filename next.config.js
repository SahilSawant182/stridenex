const withPWA = require("next-pwa")({
  dest: "public",
  disable: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },

  experimental: {
    webpackBuildWorker: false,
    cpus: 1,
  },

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
      {
        protocol: "https",
        hostname: "www.tbsnews.net",
        pathname: "/sites/default/files/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/lms/:path*",
        destination: "http://127.0.0.1:3003/lms/:path*",
      },
      {
        source: "/courses",
        destination: "http://127.0.0.1:3003/lms/courses",
      },
      {
        source: "/courses/:path*",
        destination: "http://127.0.0.1:3003/lms/courses/:path*",
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
