module.exports = {
  root: true,
  env: {
    amd: true,
    commonjs: true,
    node: true,
    browser: true,
    es6: true,
    jquery: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:prettier/recommended',
    'plugin:backbone/recommended',
    'airbnb-base',
  ],
  globals: {
    // '_': 'underscore',
    // 'Backbone': 'backbone',
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
  },
  plugins: ['import', 'backbone'],
  ignorePatterns: ['node_modules/'],
  rules: {
    semi: ['error', 'never'],
    'no-debugger': 0, // process.env.NODE_ENV === 'production' ? 2 : 0,
    // 'import/no-unresolved': ['error', { commonjs: true, caseSensitive: true }],
    // 'import/extensions': ['error', 'ignorePackages', {
    //   js: 'never',
    //   jsx: 'never'
    // }],
    'no-console': 0, // process.env.NODE_ENV === 'production' ? 2 : 0,
    // // 'padded-blocks': ['error', { 'blocks': 'always' }]
    'no-underscore-dangle': ['error', { allow: ['_getItem', '_itemName', '_clear'] }],
    'no-new': 0,
    'class-methods-use-this': 0,
    'prettier/prettier': 0,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.hbs'],
      },
      webpack: {
        config: 'webpack.config.js',
        env: {
          NODE_ENV: process.env.NODE_ENV === 'production' ?? 'development',
          production: process.env.NODE_ENV === 'production' ? 2 : 0,
        },
      },
    },
    backbone: {
      Model: ['ATVModel'],
      View: ['ATVView'],
    },
  },
}
