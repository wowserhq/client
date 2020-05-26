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
    extensions: ['.mjs', '.js'],
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      inject: true,
      template: './src/index.html',
    }),
    new webpack.DefinePlugin({
      // Prevent Fengari from loading Node-only libraries
      // See: https://github.com/fengari-lua/fengari/blob/master/src/loslib.js#L480-L489
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
  devServer: {
    contentBase: path.join(__dirname, 'public'),
  },
};
