const merge = require('webpack-merge');
const config = require('./webpack.config.js');
const webpack = require('webpack');
const path = require('path');
const ndConfig = require('./webpack/ndConfig.js');

module.exports = merge(config, {
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin(Object.assign({
            'process.env.NODE_ENV': JSON.stringify("production")
        }, ndConfig))]
});
