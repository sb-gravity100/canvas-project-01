const { execSync } = require('child_process');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const url = execSync('gp url 3000').toString().trim();

module.exports = {
   entry: ['./src/index.ts'],
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
      public: url,
      host: '0.0.0.0',
      disableHostCheck: true,
      allowedHosts: ['localhost', '*.gitpod.io'],
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
            use: ['style-loader', 'css-loader', 'sass-loader'],
         },
         {
            test: /\.(jpe?g|png|svg|ico|bmp)/,
            type: 'asset/resources',
         },
      ],
   },
   devtool: 'source-map',
   plugins: [
      new HTMLWebpackPlugin({
         template: path.resolve(__dirname, 'public/index.html'),
      }),
      new webpack.ProvidePlugin({
         gsap: ['gsap/all', 'gsap'],
         _times: ['lodash', 'times'],
         _chain: ['lodash', 'chain'],
      }),
   ],
};
