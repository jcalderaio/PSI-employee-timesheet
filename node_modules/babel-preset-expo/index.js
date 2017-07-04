module.exports = {
  presets: ['babel-preset-react-native-stage-0/decorator-support'],
  plugins: [
    [
      'babel-plugin-module-resolver',
      {
        alias: {
          'react-native-vector-icons': '@expo/vector-icons',
        },
      },
    ],
  ],
};
