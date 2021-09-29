/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('./webpack.base.js');

webpack.mode = 'development'; // production , development
// webpack.devtool = 'eval-source-map';

webpack.plugins.push(
    // new BundleAnalyzerPlugin({ //可视化调试页面
    //     analyzerMode: 'server',
    //     analyzerHost: '127.0.0.1',
    //     analyzerPort: 8889,
    //     reportFilename: 'report.html',
    //     defaultSizes: 'parsed',
    //     openAnalyzer: true,
    //     generateStatsFile: false,
    //     statsFilename: 'stats.json',
    //     statsOptions: null,
    //     logLevel: 'info'
    // })
);

module.exports = webpack;
