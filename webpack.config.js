const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/index.mjs',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'wowser-client-[chunkhash:8].js',
  },
  resolve: {
    extensions: ['.js', '.mjs'],
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      inject: true,
      template: './src/index.html',
    }),
  ],
  module: {
    rules: [
    ],
  },
};
