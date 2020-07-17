const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/[name].js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin()],
  mode: 'development',
  // 解析模块的规则
  resolve: {
    // 配置解析模块路径别名: 优点：当目录层级很复杂时，简写路径；缺点：路径不会提示
    alias: {
      $css: resolve(__dirname, 'src/css')
    },
    // 配置省略文件路径的后缀名（引入时就可以不写文件后缀名了）
    extensions: ['.js', '.json', '.jsx', '.css'],
    // 告诉 webpack 解析模块应该去找哪个目录
    modules: [resolve(__dirname, '../../node_modules'), 'node_modules']
  }
};
