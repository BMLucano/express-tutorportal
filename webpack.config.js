import path from 'path';
import { fileURLToPath } from 'url';
import  webpack  from 'webpack';
// import pkg from 'webpack';
// const { webpack } = pkg;
import webpackNodeExternals from 'webpack-node-externals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: './src/server.ts',
  target: 'node',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'build'),
    module: true,
    chunkFormat: 'module',
  },
  experiments: {
    outputModule: true,
  },
  externals: [
    'bcrypt',
    'dotenv',
    'express',
    'jsonwebtoken',
    'pg',
    'zod',
    'node:process',],
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^(node-gyp|npm|mock-aws-s3|aws-sdk|nock)$/,
    }),
  ],
};

// function nodeExternals() {
//   const nodeExternals = require('webpack-node-externals');
//   return nodeExternals();
// }
// webpackNodeExternals()