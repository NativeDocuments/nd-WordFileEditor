const webpack = require('webpack');
const path = require('path');


module.exports = {
  entry: {
    "app": "./src/app.js",
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
  "externals": {
    "NDAPI": "window.ndapi",
    "react": "window.ndapi.exports.React",
    "bootstrap": "window.ndapi.exports.Bootstrap",
    "@babel/polyfill": "window.ndapi.exports.babel.polyfill"
  }
};
