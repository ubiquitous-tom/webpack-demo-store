const path = require('path')
const { ProvidePlugin } = require('webpack')
// const {EnvironmentPlugin } = require('webpack')
const DotenvWebpack = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ESLintWebpackPlugin = require('eslint-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
// const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const NodeJsonMinify = require('node-json-minify')

module.exports = {
  entry: {
    index: './src/app.js',
  },
  output: {
    filename: '[name].bundle.js', // '[name].[hash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  resolve: {
    alias: {
      // add as many aliases as you like!
      img: path.resolve(__dirname, './src/assets/images'),
      // font: path.resolve(__dirname, './src/assets/fonts'),
      common: path.resolve(__dirname, './src/components/common'),
      shared: path.resolve(__dirname, './src/components/shared'),
      components: path.resolve(__dirname, './src/components'),
      routers: path.resolve(__dirname, './src/routers'),
    },
  },
  plugins: [
    new DotenvWebpack({
      // path: './.env',
      safe: true,
      systemvars: true,
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './public/index.html',
      favicon: './src/assets/images/favicon.ico',
      minify: {
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
      },
    }),
    new HtmlWebpackPlugin({
      filename: 'index.jsp',
      template: './public/index.html',
      favicon: './src/assets/images/favicon.ico',
      minify: {
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
      },
    }),
    new ESLintWebpackPlugin(),
    new CleanWebpackPlugin({
      verbose: true,
      cleanOnceBeforeBuildPatterns: ['**/*', '!manifest.json'],
    }),
    new ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      // jquery: 'jquery',
      // 'window.jQuery': 'jquery',
      // _: 'underscore',
      // Backbone: 'backbone',
    }),

    // new EnvironmentPlugin(),

    new CopyWebpackPlugin({
      patterns: [
        // { from: 'src/assets/fonts', to: 'font' },
        // { from: 'src/assets/images', to: 'img' },
        // { from: 'src/assets/images/atvlogo.png', to: 'img' },
        // { from: 'public/lang.json', to: 'lang.json' },
        {
          from: 'public/lang.json',
          transform: (content) => (NodeJsonMinify(content.toString())),
          to: 'lang.json',
        },
      ],
    }),

    new CssMinimizerWebpackPlugin(),
    // // https://stackoverflow.com/questions/44232366/how-do-i-build-a-json-file-with-webpack/54700817
    // new WebpackManifestPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
      { test: /\.less$/i, loaders: ['style-loader', 'css-loder', 'less-loader'] },
      {
        test: /\.(png|svg|jpg|gif)$/i,
        use: [
          { loader: 'url-loader', options: { limit: 8192 /* in bytes */ } },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        use: [
          { loader: 'url-loader', options: { limit: 8192 /* in bytes */ } },
        ],
      },
      // { test: /bootstrap\/dist\/js\/umd\//, loader: 'imports?jQuery=jquery' }
      { test: /\.(htm|html)$/i, use: ['html-loader'] },
      { test: /\.(hbs)$/i, use: ['handlebars-loader'] },
    ],
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
}
