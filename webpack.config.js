/*
    webpack.config.js
*/

const path = require('path');
const isProd = process.env.NODE_ENV === 'prod';

module.exports = {
  mode: isProd ? 'production' : 'development',

  entry: {
    app: './src/index.jsx'
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'index.js',
    libraryTarget: 'umd'
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },

  externals: {
    'react': 'commonjs react'
  }
};
