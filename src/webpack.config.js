/* global __dirname */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './main.js',
  watch: true,
  output: {
    filename: 'bundle.min.js',
    path: path.join(__dirname, '../'),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
  ],
};