import EslintConfigPrettier from 'eslint-config-prettier'
import EslintPluginReact from 'eslint-plugin-react'
import EslintPluginReactNative from 'eslint-plugin-react-native'
import EslintPluginPrettier from 'eslint-plugin-prettier'

export default [
  EslintConfigPrettier,
  {
    settings: {
      'import/resolver': {
        'babel-module': {},
      },
    },
    plugins: {
      prettier: EslintPluginPrettier,
      react: EslintPluginReact,
      'react-native': EslintPluginReactNative,
    },
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
  },
]
