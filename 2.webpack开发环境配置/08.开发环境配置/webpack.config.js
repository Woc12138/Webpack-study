/*
  开发环境配置：能让代码运行
    运行项目指令：
      webpack 会将打包结果输出出去（build文件夹下）
      npx webpack-dev-server 只会在内存中编译打包，没有输出
*/
/*
  loader: 1. 下载 2. 使用（配置loader）
  plugins: 1.下载 2. 引入 3. 使用
*/

// resolve用来拼接绝对路径的方法
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin') // 引用plugin

module.exports = {
  // webpack配置
  entry: './src/js/index.js', // 入口起点
  output: {
    // 输出
    // 输出文件名
    filename: 'js/build.js',
    // __dirname是nodejs的变量，代表当前文件的目录绝对路径
    path: resolve(__dirname, 'build'), // 输出路径，所有资源打包都会输出到这个文件夹下
  },
  // loader配置
  module: {
    rules: [
      // 详细的loader配置
      // 不同文件必须配置不同loader处理
      {
        // 匹配哪些文件
        test: /\.less$/,
        // 使用哪些loader进行处理
        use: [
          // use数组中loader执行顺序：从右到左，从下到上，依次执行(先执行css-loader)
          // style-loader：创建style标签，将js中的样式资源插入进去，添加到head中生效
          'style-loader',
          // css-loader：将css文件变成commonjs模块加载到js中，里面内容是样式字符串
          'css-loader',
          // less-loader：将less文件编译成css文件，需要下载less-loader和less
          'less-loader'
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        // url-loader：处理图片资源，问题：默认处理不了html中的img图片
        test: /\.(jpg|png|gif)$/,
        // 需要下载 url-loader file-loader
        loader: 'url-loader',
        options: {
          // 图片大小小于8kb，就会被base64处理，优点：减少请求数量（减轻服务器压力），缺点：图片体积会更大（文件请求速度更慢）
          // base64在客户端本地解码所以会减少服务器压力，如果图片过大还采用base64编码会导致cpu调用率上升，网页加载时变卡
          limit: 8 * 1024,
          // 给图片重命名，[hash:10]：取图片的hash的前10位，[ext]：取文件原来扩展名
          name: '[hash:10].[ext]',
          // 问题：因为url-loader默认使用es6模块化解析，而html-loader引入图片是conmonjs，解析时会出问题：[object Module]
          // 解决：关闭url-loader的es6模块化，使用commonjs解析
          esModule: false,
          outputPath: 'imgs',
        },
      },
      {
        test: /\.html$/,
        // 处理html文件的img图片（负责引入img，从而能被url-loader进行处理）
        loader: 'html-loader',
      },
      // 打包其他资源(除了html/js/css资源以外的资源)
      {
        // 排除html|js|css|less|jpg|png|gif文件
        exclude: /\.(html|js|css|less|jpg|png|gif)/,
        // file-loader：处理其他文件
        loader: 'file-loader',
        options: {
          name: '[hash:10].[ext]',
          outputPath: 'media',
        },
      },
    ],
  },
  // plugin的配置
  plugins: [
    // html-webpack-plugin：默认会创建一个空的html文件，自动引入打包输出的所有资源（JS/CSS）
    // 需要有结构的HTML文件可以加一个template
    new HtmlWebpackPlugin({
      // 复制这个./src/index.html文件，并自动引入打包输出的所有资源（JS/CSS）
      template: './src/index.html',
    }),
  ],
  // 模式
  mode: 'development', // 开发模式
  // 开发服务器 devServer：用来自动化，不用每次修改后都重新输入webpack打包一遍（自动编译，自动打开浏览器，自动刷新浏览器）
  // 特点：只会在内存中编译打包，不会有任何输出（不会像之前那样在外面看到打包输出的build包，而是在内存中，关闭后会自动删除）
  // 启动devServer指令为：npx webpack-dev-server
  devServer: {
    // 项目构建后路径
    contentBase: resolve(__dirname, 'build'),
    // 启动gzip压缩
    compress: true,
    // 端口号
    port: 3000,
    // 自动打开浏览器
    open: true,
  },
}
