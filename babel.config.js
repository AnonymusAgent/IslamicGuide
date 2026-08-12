module.exports = function (api) {
  // Persistent cache prevents Metro from re-parsing React Native's Flow-typed
  // internals on every cold-cache rebuild (RN 0.79.x + hermes-parser).
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [],
  };
};
