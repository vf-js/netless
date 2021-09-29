const webpack = require('./webpack.base.js');

webpack.output.filename = '[name].min.js';
webpack.output.libraryTarget = 'umd';
webpack.mode = 'production';
// webpack.devtool = 'source-map';

module.exports = webpack;
