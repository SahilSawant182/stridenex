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
      // Direct LMS wildcard
      {
        source: "/lms/:path*",
        destination: `${LMS_BASE_URL}/:path*`,
      },
      {
        source: "/courses",
        destination: `${LMS_BASE_URL}/courses`,
      },
      {
        source: "/courses/:slug",
        destination: `${LMS_BASE_URL}/course/:slug`,
      },
      {
        source: "/course/:path*",
        destination: `${LMS_BASE_URL}/course/:path*`,
      },
      {
        source: "/certificates",
        destination: `${LMS_BASE_URL}/certificates`,
      },
      {
        source: "/certificates/:path*",
        destination: `${LMS_BASE_URL}/certificates/:path*`,
      },
      {
        source: "/certificate-evaluations",
        destination: `${LMS_BASE_URL}/certificate-evaluations`,
      },
      {
        source: "/certificate-evaluations/:path*",
        destination: `${LMS_BASE_URL}/certificate-evaluations/:path*`,
      },
      {
        source: "/dashboard",
        destination: `${LMS_BASE_URL}/dashboard`,
      },
      {
        source: "/enrollments",
        destination: `${LMS_BASE_URL}/enrollments`,
      },
      {
        source: "/batches",
        destination: `${LMS_BASE_URL}/batches`,
      },
      {
        source: "/batches/:path*",
        destination: `${LMS_BASE_URL}/batches/:path*`,
      },
      {
        source: "/batch",
        destination: `${LMS_BASE_URL}/batch`,
      },
      {
        source: "/batch/:path*",
        destination: `${LMS_BASE_URL}/batch/:path*`,
      },
      {
        source: "/programs",
        destination: `${LMS_BASE_URL}/programs`,
      },
      {
        source: "/programs/:path*",
        destination: `${LMS_BASE_URL}/programs/:path*`,
      },
      {
        source: "/quizzes",
        destination: `${LMS_BASE_URL}/quizzes`,
      },
      {
        source: "/quizzes/:path*",
        destination: `${LMS_BASE_URL}/quizzes/:path*`,
      },
      {
        source: "/assignments",
        destination: `${LMS_BASE_URL}/assignments`,
      },
      {
        source: "/assignments/:path*",
        destination: `${LMS_BASE_URL}/assignments/:path*`,
      },
      {
        source: "/programming-exercises",
        destination: `${LMS_BASE_URL}/programming-exercises`,
      },
      {
        source: "/programming-exercises/:path*",
        destination: `${LMS_BASE_URL}/programming-exercises/:path*`,
      },
      {
        source: "/my-payments",
        destination: `${LMS_BASE_URL}/my-payments`,
      },
      {
        source: "/profile/payments",
        destination: `${LMS_BASE_URL}/profile/payments`,
      },
      {
        source: "/sales-earnings",
        destination: `${LMS_BASE_URL}/sales-earnings`,
      },
      {
        source: "/instructor/settings",
        destination: `${LMS_BASE_URL}/instructor/settings`,
      },
      {
        source: "/instructor/settings/:path*",
        destination: `${LMS_BASE_URL}/instructor/settings/:path*`,
      },
      {
        source: "/categories",
        destination: `${LMS_BASE_URL}/categories`,
      },
      {
        source: "/badges",
        destination: `${LMS_BASE_URL}/badges`,
      },
      {
        source: "/badges/:path*",
        destination: `${LMS_BASE_URL}/badges/:path*`,
      },
      {
        source: "/course-evaluators",
        destination: `${LMS_BASE_URL}/course-evaluators`,
      },
      {
        source: "/evaluators",
        destination: `${LMS_BASE_URL}/evaluators`,
      },
      {
        source: "/questions",
        destination: `${LMS_BASE_URL}/questions`,
      },
      {
        source: "/questions/:path*",
        destination: `${LMS_BASE_URL}/questions/:path*`,
      },
      {
        source: "/progress",
        destination: `${LMS_BASE_URL}/progress`,
      },
      {
        source: "/coupons",
        destination: `${LMS_BASE_URL}/coupons`,
      },
      {
        source: "/coupons/:path*",
        destination: `${LMS_BASE_URL}/coupons/:path*`,
      },
      {
        source: "/checkout",
        destination: `${LMS_BASE_URL}/checkout`,
      },
      {
        source: "/payment-success",
        destination: `${LMS_BASE_URL}/payment-success`,
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
