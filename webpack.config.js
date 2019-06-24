const webpack = require('webpack');
const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    "custom/app": "./src/app.js",
    "host": "./host/host.ts",
  },
  output: {
    pathinfo: true,
    publicPath: "/",
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath)
  },
  devtool: 'source-map',
  module: {
    rules: [
      { // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
        test: /\.tsx?$/, 
        loader: "awesome-typescript-loader" 
      },
      { 
        test: /\.svg$/, 
        loader: "url-loader" 
      },
      {
            test: /\.css$/,
            use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre"
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
            presets: ['@babel/preset-env', '@babel/react']
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
        hash: false,
        template: './host/host.html',
        filename: 'index.html',
        chunks: []
    })
  ],
  "externals": {
    "NDAPI": "window.ndapi",
    "react": "window.ndapi.exports.React",
    "bootstrap": "window.ndapi.exports.Bootstrap",
    "@babel/polyfill": "window.ndapi.exports.babel.polyfill"
  }
};
