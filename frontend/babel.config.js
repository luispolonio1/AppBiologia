module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      // Reanimated 4 + worklets 0.8 requiere este plugin para transformar
      // private properties de clases y workletizar funciones correctamente.
      'react-native-worklets/plugin',
    ],
  };
};
