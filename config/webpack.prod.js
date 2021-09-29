const webpack = require('./webpack.base.js');
const path = require('path');
const FileManagerPlugin = require('filemanager-webpack-plugin');

webpack.output.filename = '[name].min.js';
webpack.output.libraryTarget = 'umd';
webpack.mode = 'production';
// webpack.devtool = 'source-map';

module.exports = webpack;
