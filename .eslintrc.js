// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
  extends: ['expo', 'prettier', 'plugin:react-native/all'],
  plugins: ['prettier', 'react', 'react-native'],
  env: { node: true },
  rules: {
    'prettier/prettier': [
      'error',
      {
        semi: false,
        singleQuote: true,
        jsxSingleQuote: true,
      },
    ],
    'react-native/no-raw-text': 'off',
    'react-native/sort-styles': 'off',
  },
}
