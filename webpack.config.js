const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

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
  node: {
    fs: 'empty',
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      inject: true,
      template: './src/index.html',
    }),
    new webpack.DefinePlugin({
      'typeof process':  JSON.stringify('undefined'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.lua$/,
        use: 'raw-loader',
      },
    ],
  },
};
