const merge = require('webpack-merge');
const config = require('./webpack.config.js');
const webpack = require('webpack');
const ndConfig = require('./webpack/ndConfig.js');

module.exports = merge(config, {
    devServer: {
        host: '127.0.0.1',
        port: 8080,
        https: false,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        },
    },
    mode: "development",
    plugins: [
        new webpack.DefinePlugin(Object.assign({
            'process.env.NODE_ENV': JSON.stringify("development")
        }, ndConfig))]
});
