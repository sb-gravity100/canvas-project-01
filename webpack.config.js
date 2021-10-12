const HTMLWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  entry: {
    main: ['./src/index.ts'],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'build'),
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  stats: 'errors-warnings',
  devServer: {
    port: 3000,
    hot: true,
    proxy: [
      {
        context: ['/static'],
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    ],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
      },
      {
        test: /\.s(c|a)ss$/,
        exclude: /node_modules/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(jpe?g|png|svg|ico|bmp)/,
        type: 'asset/resources',
      },
    ],
  },
  devtool: isDev ? 'eval' : 'source-map',
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
    }),
    isDev && new MiniCssExtractPlugin(),
  ].filter(Boolean),
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: 'multiple',
  },
};
