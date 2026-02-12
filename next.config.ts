const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // 👈 IMPORTANT
});

module.exports = withPWA({
  reactStrictMode: true,
});