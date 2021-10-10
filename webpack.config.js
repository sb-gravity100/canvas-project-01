const HTMLWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: ['./src/index.ts'],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'build'),
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  stats: 'errors-warnings',
  devServer: {
    port: 3000,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader']
      },
      {
        test: /\.s(c|a)ss$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(jpe?g|png|svg|ico|bmp)/,
        type: 'asset/resources'
      }
    ]
  },
  devtool: 'source-map',
  plugins: [new HTMLWebpackPlugin({
    template: path.resolve(__dirname, 'public/index.html')
  })],
};
