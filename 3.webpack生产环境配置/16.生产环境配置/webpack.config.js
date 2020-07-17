const { resolve } = require('path')
const MiniCssExtractorPlugin = require('mini-css-extract-plugin')
const OptimiziCssAssetsWebpackPlugin = require('optimizi-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

// 定义node.js的环境变量，决定使用browserslist的哪个环境
process.env.NODE_ENV = 'production'

// 复用loader的写法
const commonCssLoader = [
	// 这个loader取代style-loader。作用：提取js中的css成单独文件然后通过link加载
	MiniCssExtractPlugin.loader,
	// css-loader：将css文件整合到js文件中
	// 经过css-loader处理后，样式文件是在js文件中的
	// 问题：1.js文件体积会很大2.需要先加载js再动态创建style标签，样式渲染速度就慢，会出现闪屏现象
	// 解决：用MiniCssExtractPlugin.loader替代style-loader
	'css-loader',
	/*
    postcss-loader：css兼容性处理：postcss --> 需要安装：postcss-loader postcss-preset-env
    postcss需要通过package.json中browserslist里面的配置加载指定的css兼容性样式
    在package.json中定义browserslist：
    "browserslist": {
      // 开发环境 --> 设置node环境变量：process.env.NODE_ENV = development
      "development": [ // 只需要可以运行即可
        "last 1 chrome version",
        "last 1 firefox version",
        "last 1 safari version"
      ],
      // 生产环境。默认是生产环境
      "production": [ // 需要满足绝大多数浏览器的兼容
        ">0.2%",
        "not dead",
        "not op_mini all"
      ]
    },
  */
	{
		loader: 'postcss-loader',
		options: {
			ident: 'postcss', // 基本写法
			plugins: () => [
				// postcss的插件
				require('postcss-preset-env')(),
			],
		},
	},
]

module.exports = {
	entry: './src/js/index.js',
	output: {
		filename: 'js/built.js',
		path: resolve(__dirname, 'build'),
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [...commonCssLoader],
			},
			{
				test: /\.less$/,
				use: [...commonCssLoader, 'less-loader'],
			},
			/*
        正常来讲，一个文件只能被一个loader处理
        当一个文件要被多个loader处理，那么一定要指定loader执行的先后顺序
        先执行eslint再执行babel（用enforce）
      */
			{
				/*
          js的语法检查： 需要下载 eslint-loader eslint
          注意：只检查自己写的源代码，第三方的库是不用检查的
          airbnb(一个流行的js风格) --> 需要下载 eslint-config-airbnb-base eslint-plugin-import
          设置检查规则：
            package.json中eslintConfig中设置
              "eslintConfig": {
                "extends": "airbnb-base"， // 继承airbnb的风格规范
                "env": {
                  "browser": true // 可以使用浏览器中的全局变量(使用window不会报错)
                }
              }
        */
				test: /\.js$/,
				exclude: /node_modules/, // 忽略node_modules
				enforce: 'pre', // 优先执行
				loader: 'eslint-loader',
				options: {
					// 自动修复
					fix: true,
				},
      },
      /*
        js兼容性处理：需要下载 babel-loader @babel/core
          1. 基本js兼容性处理 --> @babel/preset-env
            问题：只能转换基本语法，如promise高级语法不能转换
          2. 全部js兼容性处理 --> @babel/polyfill
            问题：只要解决部分兼容性问题，但是将所有兼容性代码全部引入，体积太大了
          3. 需要做兼容性处理的就做：按需加载  --> core-js
      */
			{
				// 第三种方式：按需加载
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
          // 预设：指示babel做怎样的兼容性处理
					presets: [
						'@babel/preset-env', // 基本预设
						{
							useBuiltIns: 'usage', //按需加载
							corejs: { version: 3 }, // 指定core-js版本
							targets: { // 指定兼容到什么版本的浏览器
								chrome: '60',
                firefox: '50',
                ie: '9',
                safari: '10',
                edge: '17'
							},
						},
					],
				},
			},
			{
				// 图片处理
				test: /\.(jpg|png|gif)/,
				loader: 'url-loader',
				options: {
					limit: 8 * 1024,
					name: '[hash:10].[ext]',
					outputPath: 'imgs',
					esModule: false, // 关闭url-loader默认使用的es6模块化解析
				},
			},
			// html中的图片处理
			{
				test: /\.html$/,
				loader: 'html-loader',
			},
			// 处理其他文件
			{
				exclude: /\.(js|css|less|html|jpg|png|gif)/,
				loader: 'file-loader',
				options: {
					outputPath: 'media',
				},
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			// 对输出的css文件进行重命名
			filename: 'css/built.css',
		}),
		// 压缩css
		new OptimiziCssAssetsWebpackPlugin(),
		// HtmlWebpackPlugin：html文件的打包和压缩处理
		// 通过这个插件会自动将单独打包的样式文件通过link标签引入
		new HtmlWebpackPlugin({
			template: './src/index.html',
      // 压缩html代码
			minify: {
        // 移除空格
        collapseWhitespace: true,
        // 移除注释
				removeComments: true,
			},
		}),
  ],
  // 生产环境下会自动压缩js代码
	mode: 'production',
}
