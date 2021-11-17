const { execSync } = require('child_process');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

const isProduction = process.env.NODE_ENV == 'production';
const url = execSync('gp url 3000').toString().trim();

const stylesHandler = isProduction
    ? MiniCssExtractPlugin.loader
    : 'style-loader';

const config = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
    },
    devServer: {
      port: 3000,
      hot: true,
      public: url,
      host: '0.0.0.0',
      disableHostCheck: true,
      allowedHosts: ['localhost', '*.gitpod.io'],
    },
    stats: 'errors-warnings',
    plugins: [
        new HtmlWebpackPlugin({
            template: './template.html',
            title: 'Canvas',
        }),
        new webpack.ProvidePlugin({
            perlin: ['@chriscourses/perlin-noise']
        })
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
            },
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
    } else {
        config.mode = 'development';
    }
    return config;
};
