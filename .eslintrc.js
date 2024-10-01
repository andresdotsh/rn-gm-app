// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        semi: false,
        singleQuote: true,
        jsxSingleQuote: true,
      },
    ],
  },
}
