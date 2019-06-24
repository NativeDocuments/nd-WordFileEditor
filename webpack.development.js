const merge = require('webpack-merge');
const config = require('./webpack.config.js');
const webpack = require('webpack');
const ndConfig = require('./webpack/ndConfig.js');
const ndConfigServiceUrl = ndConfig["process.env.ND_SERVICE_URL"];
const ndServiceUrl = (ndConfigServiceUrl&&ndConfigServiceUrl.length>0?JSON.parse(ndConfigServiceUrl):"https://canary.nativedocuments.com");
console.log("[ND] proxy to service at "+JSON.stringify(ndServiceUrl));

const CUSTOM_PATH=new RegExp("^/(...)/custom/(.*)$");

module.exports = merge(config, {
    devServer: {
        host: '127.0.0.1',
        port: 8888,
        https: false,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        },
        before: function(app) {
            app.get(CUSTOM_PATH, function(req, res) {
                res.redirect(req.url.replace(CUSTOM_PATH, "/custom/$2"));
            });
        },
        "proxy": {
            "/v1/": {
                "target": ndServiceUrl,
                "secure": false,
                "changeOrigin": true,
                "ws": true
            },
            "/w1/": {
                "target": ndServiceUrl,
                "secure": false,
                "changeOrigin": true,
                "ws": true
            },
            "/": {
                "target": ndServiceUrl,
                "secure": false,
                "changeOrigin": true,
                "autoRewrite": true,
                "protocolRewrite": "http",
                "headers": {
                    'X-ND-DEV-ENV': 'npm'
                }
            }
        }
    },
    mode: "development",
    plugins: [
        new webpack.DefinePlugin(Object.assign({
            'process.env.NODE_ENV': JSON.stringify("development")
        }, ndConfig))]
});
