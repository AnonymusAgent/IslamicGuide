// https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure Flow-typed React Native internals are handled correctly
// by the hermes-parser. Without this file Metro falls back to
// an unoptimised default that fails on RN 0.79.x private webapis.
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    ...((config.transformer || {}).minifierConfig || {}),
  },
};

// Widen the resolver to handle .cjs modules (used by several Expo packages)
config.resolver = {
  ...config.resolver,
  sourceExts: [
    ...((config.resolver || {}).sourceExts || ['js', 'jsx', 'ts', 'tsx', 'json']),
  ],
};

module.exports = config;
