var HTMLWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var webpack = require('webpack');

var isProduction = process.env.NODE_ENV == 'production';
varisGitpod = (process.env.USER || '').match(/gitpod/i);

var stylesHandler = isProduction ? MiniCssExtractPlugin.loader : 'style-loader';

var config = {
   mode: 'development',
   entry: './src/index.ts',
   output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].bundle.js',
   },
   devServer: {
      port: 3000,
      hot: true,
      host: '0.0.0.0',
      disableHostCheck: true,
      allowedHosts: ['localhost', '*.gitpod.io'],
      contentBase: './public',
      proxy: {
         '/api': {
            target: 'http://localhost:8000',
            changeOrigin: true,
         },
      },
   },
   stats: 'errors-warnings',
   plugins: [
      new HtmlWebpackPlugin({
         template: './template.html',
         title: 'Canvas',
      }),
   ],
   externals: {
      p5: 'p5',
      gsap: 'gsap',
      lodash: {
         commonjs: 'lodash',
         amd: 'lodash',
         root: '_',
      },
   },
   module: {
      rules: [
         {
            test: /\.(ts|tsx)$/i,
            loader: 'ts-loader',
            exclude: ['/node_modules/'],
         },
         {
            test: /\.s[ac]ss$/i,
            use: [stylesHandler, 'css-loader', 'sass-loader'],
         },
         {
            test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
            type: 'asset',
         }
      ],
   },
   resolve: {
      extensions: ['.ts', '.js'],
   },
};

module.exports = () => {
   if (isProduction) {
      config.mode = 'production';

      config.plugins.push(new MiniCssExtractPlugin());
   }

   if (isGitpod) {
      config.devServer.public = require('child_process')
         .execSync('gp url 3000')
         .toString()
         .trim();
      config.devServer.proxy['/api'].target = require('child_process')
         .execSync('gp url 8000')
         .toString()
         .trim();
   } else {
      config.devServer.host = 'localhost';
   }
   return config;
};
