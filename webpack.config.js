/* eslint-env node */
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
   entry: {
      background: './src/background/index.js',
      content: './src/content/index.js',
      options: './src/options/index.js',
      controller: './src/controller/index.js'
   },
   mode: 'development',
   plugins: [
      new CleanWebpackPlugin({
         cleanStaleWebpackAssets: false,
      }),
      new HtmlWebpackPlugin({
         title: 'Workline',
         filename: 'options/index.html',
         template: 'src/options/index.html',
         inject: 'body',
         chunks: ['options'],
      }),
      new CopyPlugin([
         {
            from: 'src/manifest.json',
            to: 'manifest.json',
         },
      ]),
   ],
   module: {
      rules: [
         {
            test: /\.(js|jsx)$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader',
         },
         {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
         },
      ],
   },
   resolve: { extensions: ['*', '.js', '.jsx'] },
   output: {
      path: path.resolve(__dirname, 'build'),
      filename: '[name]/bundle.js',
   },
   watch: true,
   devtool: 'inline-source-map',
};
