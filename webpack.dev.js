'use strict';

// 引入 Node 内置的 path 模块
// 用于处理文件和目录路径
const path = require('path');
const webpack = require('webpack');
const {CleanWebpackPlugin}= require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');

// 动态设置 entry 和 htmlWebpackPlugins
const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];

  const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'));

  Object.keys(entryFiles)
    .map(index => {
      const entryFile = entryFiles[index];

      const match = entryFile.match(/src\/(.*)\/index\.js/);

      const pageName = match && match[1];

      entry[pageName] = entryFile;

      htmlWebpackPlugins.push(
        new HtmlWebpackPlugin({
          template: path.join(__dirname, `src/${pageName}/index.html`),
          filename: `${pageName}.html`,
          // 当前页面包含的 chunk，
          // 可直接用 entry 的 key 命名
          chunks: [pageName],
          inject: true,
          minify: {
              html5: true,
              collapseWhitespace: true,
              preserveLineBreaks: false,
              minifyCSS: true,
              minifyJS: true,
              removeComments: false
          }
        })
      );
    });

  return {
    entry,
    htmlWebpackPlugins
  }
};

const {entry, htmlWebpackPlugins} = setMPA();

module.exports = {
  // 打包的入口文件
  // 单入口：entry 是一个字符串
  // entry: './src/index.js',
  // 多入口：entry 是一个对象
  entry: entry,
  // 打包的输出
  // output 只能有一个
  output: {
    // 对于多入口配置，通过占位符确保文件名称的唯一
    filename: '[name].js',
    // __dirname: 当前模块的目录名
    // 等同于 path.dirname(__filename)
    path: __dirname + '/dist'
    // or
    // path.join 使用平台特定的分隔符将所有给定大的路径段连接在一起，并规范化生成的路径
    // path: path.join(__dirname, 'dist')
    // or
    // path.resolve 用于将路径序列解析为绝对路径
    // path: path.resolve(__dirname, 'dist')
  },
  // mode 用于指定当前构建环境类型
  // production, development, none
  // 默认值为 production
  // mode: 'production',
  mode: 'development',
  // 开启文件监听
  // 另一种开启文件监听的方式是启动 webpack 命令时，带上 --watch 参数
  // 或/即在 package.json npm scripts 添加/修改命令
  // 开启文件监听，无需每次在文件变化后手动构建，但需要每次手动刷新浏览器
  // 默认 false，即不开启
  watch: true,
  // 只有开启监听模式，watchOptions 才有意义
  watchOptions: {
    // 默认为空，不监听的文件或文件夹，支持正则匹配
    ignored: /node_modules/,
    // 监听到变化发生后会等待 300ms 再执行，默认 300ms
    aggregateTimeout: 300,
    // 判断文件是否发生变化是通过不断询问系统指定文件是否变化实现的
    // 默认询问 1000次/秒
    poll: 1000
  },
  module: {
    // loader 配置在 module.rules 数组中
    rules: [
      {
        // test 指定匹配规则
        test: /\.js$/,
        // use 指定使用的 loader 名称
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          // webpack loader 执行从右到左的链式调用
          // style-loader 将样式通过 <style> 标签插入到 head 中
          'style-loader',
          // css-loader 用于加载解析 .css 文件，转换成 commonjs 对象，并传递给 style-loader
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          // less-loader 用于将 less 转换成 css
          // less-loader 依赖 less，需同时安装
          'less-loader'
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        // file-loader 用于处理文件
        // 可用于解析图片，也可用于解析字体
        // use: 'file-loader'
        use: [
          {
            // url-loader 也可以处理图片和字体
            // 可以设置较小资源自动 base64
            loader: 'url-loader',
            options: {
              // 小于 10KB(10240Bytes) 
              limit: 10240
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: 'file-loader'
      }
    ]
  },
  // plugin 插件配置在 plugins 数组中
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin()
  ].concat(htmlWebpackPlugins),
  devServer: {
    contentBase: './dist',
    // 开启 webpack-dev-server 的 HMR （热更新）功能
    hot: true
  },
  devtool: 'cheap-module-eval-source-map'
};