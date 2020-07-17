/*
  loader: 1. 下载   2. 使用（配置loader）
  plugins: 1. 下载  2. 引入  3. 使用
*/
const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 引用plugin

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'build.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    // loader的配置
    rules: [
    ]
  },
  plugins: [
    // plugin的配置
    // html-webpack-plugin
    // 功能：默认会创建一个空的html文件，自动引入打包输出的所有资源（JS/CSS）
    // 需要有结构的HTML文件可以加一个template
    new HtmlWebpackPlugin({
      // 复制这个./src/index.html文件，并自动引入打包输出的所有资源（JS/CSS）
      template: './src/index.html'
    })
  ],
  mode: 'development'
}