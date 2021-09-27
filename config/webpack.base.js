/* eslint-disable max-len */
/* eslint-disable no-undef */

const path = require('path');
const webpack = require('webpack');
const package = require('../package.json');
const common = require('./common');

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
        library: 'vf.netless',
        path: path.resolve(__dirname),
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new webpack.BannerPlugin(`[filebase] \n Compiled ${new Date()} \n https://yunkc.gitee.io/docs/`),
        new webpack.DefinePlugin({
            VFBUILDDATE: JSON.stringify(new Date().toLocaleString()),
            VERSION: JSON.stringify(package.version),
        }),
    ],
};

module.exports.entry[`../dist/netless`] = './src/index.ts';
