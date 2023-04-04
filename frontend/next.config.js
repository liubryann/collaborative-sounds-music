/** @type {import('next').NextConfig} */
const { withSentryConfig } = require("@sentry/nextjs");
const nextConfig = {
  reactStrictMode: true,
  // Optional build-time configuration options
  sentry: {
    hideSourceMaps: true,
  },
};

const sentryWebpackPluginOptions = {
  silent: true, // Suppresses all logs
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
