// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
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
  },
}
