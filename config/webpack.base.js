/* eslint-disable max-len */
/* eslint-disable no-undef */

const path = require('path');
const webpack = require('webpack');
const package = require('../package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {},
    module: {
        rules: [
            {
                test: /\.(mp3|svg|png|jpg|gif)$/i,
                loader: 'url-loader',
            },
            {
                test: /\.ts(x?)$/,
                loader: 'ts-loader',
                exclude: /node_modules/,

            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: '[name].js',
        libraryTarget: 'umd',
        library: 'vf.oasis',
        path: path.resolve(__dirname, '../dist'),
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new webpack.BannerPlugin(`[filebase] \n Compiled ${new Date()} \n https://yunkc.gitee.io/docs/`),
        new webpack.DefinePlugin({
            VFBUILDDATE: JSON.stringify(new Date().toLocaleString()),
            VERSION: JSON.stringify(package.version),
        }),
        new HtmlWebpackPlugin({
            title: 'vf - oasis',
            filename: path.join(__dirname, '../dist/index.html'),
            template:  path.join(__dirname, '../index.html'),
        }),
    ],
};

module.exports.entry[`./oasis`] = './src/index.ts';
