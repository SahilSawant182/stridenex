const withPWA = require("next-pwa")({
  dest: "public",
  disable: true,
});

const LMS_PORT = process.env.LMS_PORT || (process.env.NODE_ENV === "production" ? "3004" : "3003");
const LMS_BASE_URL = process.env.LMS_URL || process.env.LMS_INTERNAL_URL || `http://127.0.0.1:${LMS_PORT}`;

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
      // 1. Direct LMS wildcard (MUST retain /lms in destination so Port 3004 does not redirect)
      {
        source: "/lms/:path*",
        destination: `${LMS_BASE_URL}/lms/:path*`,
      },

      // 2. Direct Root Shorthands mapped to their LMS basePath equivalent
      {
        source: "/courses",
        destination: `${LMS_BASE_URL}/lms/courses`,
      },
      {
        source: "/courses/:slug",
        destination: `${LMS_BASE_URL}/lms/course/:slug`,
      },
      {
        source: "/course/:path*",
        destination: `${LMS_BASE_URL}/lms/course/:path*`,
      },
      {
        source: "/certificates",
        destination: `${LMS_BASE_URL}/lms/certificates`,
      },
      {
        source: "/certificates/:path*",
        destination: `${LMS_BASE_URL}/lms/certificates/:path*`,
      },
      {
        source: "/certificate-evaluations",
        destination: `${LMS_BASE_URL}/lms/certificate-evaluations`,
      },
      {
        source: "/certificate-evaluations/:path*",
        destination: `${LMS_BASE_URL}/lms/certificate-evaluations/:path*`,
      },
      {
        source: "/dashboard",
        destination: `${LMS_BASE_URL}/lms/dashboard`,
      },
      {
        source: "/enrollments",
        destination: `${LMS_BASE_URL}/lms/enrollments`,
      },
      {
        source: "/batches",
        destination: `${LMS_BASE_URL}/lms/batches`,
      },
      {
        source: "/batches/:path*",
        destination: `${LMS_BASE_URL}/lms/batches/:path*`,
      },
      {
        source: "/batch",
        destination: `${LMS_BASE_URL}/lms/batch`,
      },
      {
        source: "/batch/:path*",
        destination: `${LMS_BASE_URL}/lms/batch/:path*`,
      },
      {
        source: "/programs",
        destination: `${LMS_BASE_URL}/lms/programs`,
      },
      {
        source: "/programs/:path*",
        destination: `${LMS_BASE_URL}/lms/programs/:path*`,
      },
      {
        source: "/quizzes",
        destination: `${LMS_BASE_URL}/lms/quizzes`,
      },
      {
        source: "/quizzes/:path*",
        destination: `${LMS_BASE_URL}/lms/quizzes/:path*`,
      },
      {
        source: "/assignments",
        destination: `${LMS_BASE_URL}/lms/assignments`,
      },
      {
        source: "/assignments/:path*",
        destination: `${LMS_BASE_URL}/lms/assignments/:path*`,
      },
      {
        source: "/programming-exercises",
        destination: `${LMS_BASE_URL}/lms/programming-exercises`,
      },
      {
        source: "/programming-exercises/:path*",
        destination: `${LMS_BASE_URL}/lms/programming-exercises/:path*`,
      },
      {
        source: "/my-payments",
        destination: `${LMS_BASE_URL}/lms/my-payments`,
      },
      {
        source: "/profile/payments",
        destination: `${LMS_BASE_URL}/lms/profile/payments`,
      },
      {
        source: "/sales-earnings",
        destination: `${LMS_BASE_URL}/lms/sales-earnings`,
      },
      {
        source: "/instructor/settings",
        destination: `${LMS_BASE_URL}/lms/instructor/settings`,
      },
      {
        source: "/instructor/settings/:path*",
        destination: `${LMS_BASE_URL}/lms/instructor/settings/:path*`,
      },
      {
        source: "/categories",
        destination: `${LMS_BASE_URL}/lms/categories`,
      },
      {
        source: "/badges",
        destination: `${LMS_BASE_URL}/lms/badges`,
      },
      {
        source: "/badges/:path*",
        destination: `${LMS_BASE_URL}/lms/badges/:path*`,
      },
      {
        source: "/course-evaluators",
        destination: `${LMS_BASE_URL}/lms/course-evaluators`,
      },
      {
        source: "/evaluators",
        destination: `${LMS_BASE_URL}/lms/evaluators`,
      },
      {
        source: "/questions",
        destination: `${LMS_BASE_URL}/lms/questions`,
      },
      {
        source: "/questions/:path*",
        destination: `${LMS_BASE_URL}/lms/questions/:path*`,
      },
      {
        source: "/progress",
        destination: `${LMS_BASE_URL}/lms/progress`,
      },
      {
        source: "/coupons",
        destination: `${LMS_BASE_URL}/lms/coupons`,
      },
      {
        source: "/coupons/:path*",
        destination: `${LMS_BASE_URL}/lms/coupons/:path*`,
      },
      {
        source: "/checkout",
        destination: `${LMS_BASE_URL}/lms/checkout`,
      },
      {
        source: "/payment-success",
        destination: `${LMS_BASE_URL}/lms/payment-success`,
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
