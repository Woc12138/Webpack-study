const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'js/[name].js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      // loader的配置
      {
        test: /\.css$/,
        // 多个loader用use
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        // 排除node_modules下的js文件
        exclude: /node_modules/,
        // 只检查 src 下的js文件
        include: resolve(__dirname, 'src'),
        enforce: 'pre', // 优先执行
        // enforce: 'post', // 延后执行
        // 单个loader用loader
        loader: 'eslint-loader',
        options: {} // 指定配置选项
      },
      {
        // 以下配置只会生效一个
        oneOf: []
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin()],
  mode: 'development'
};
