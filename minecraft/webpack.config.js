const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: path.join(__dirname, './src/index.js'),
  target: 'web',
  devtool: 'source-map',
  resolve: {
    extensions: ['.js'],
    alias: {},
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'app.bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: [/node_modules/],
      },
      { test: /\.(sc|sa|c)ss$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'] },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './src/index.html'),
    }),
    new MiniCssExtractPlugin({ filename: 'index.css' }),
  ],
  devServer: {
    contentBase: './src/public',
    port: 3000,
  },
};
