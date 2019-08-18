/*
    webpack.config.js
*/

const path = require('path');
const isProd = process.env.NODE_ENV === 'prod';

module.exports = {
  mode: isProd ? 'production' : 'development',

  entry: {
    app: './src/index.tsx'
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'index.js',
    libraryTarget: 'umd'
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'awesome-typescript-loader'
      }
    ]
  },

  externals: {
    'react': 'commonjs react'
  }
};
