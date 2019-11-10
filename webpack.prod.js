'use strict';

// 引入 Node 内置的 path 模块
// 用于处理文件和目录路径
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// webpack v3.0 Replaced default export with named export CleanWebpackPlugin
const HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default;
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
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
    // 设置 .js 文件的 chunkhash
    filename: '[name]_[chunkhash:8].js',
    // __dirname: 当前模块的目录名
    // 等同于 path.dirname(__filename)
    path: __dirname + '/dist'
    // or
    // path.join 使用平台特定的分隔符将所有给定的路径段连接在一起，并规范化生成的路径
    // path: path.join(__dirname, 'dist')
    // or
    // path.resolve 用于将路径序列解析为绝对路径
    // path: path.resolve(__dirname, 'dist')
  },
  // mode 用于指定当前构建环境类型
  // production, development, none
  // 默认值为 production
  mode: 'production',
  // 开启文件监听
  // 另一种开启文件监听的方式是启动 webpack 命令时，带上 --watch 参数
  // 或/即在 package.json npm scripts 添加/修改命令
  // 开启文件监听，无需每次在文件变化后手动构建，但需要每次手动刷新浏览器
  // 默认 false，即不开启
  // watch: true,
  watch: false,
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
          // 'style-loader',
          // mini-css-extract-plugin 插件的 loader 用于将 CSS 提取出来
          // 与 style-loader 功能互斥
          MiniCssExtractPlugin.loader,
          // css-loader 用于加载解析 .css 文件，转换成 commonjs 对象，并传递给 style-loader
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            // autoprefixer 插件是 postcss 生态下的，与 webpack 插件没有关联，需要通过 loader 的 options 传递 postcss 所需要的插件
            options: {
              plugins: [
                // autoprefixer 用于自动补全 CSS3 前缀
                // autoprefixer 9.6 已废弃 browsers 选项
                // 建议将 `browserslist` 配置到 package.json
                require('autoprefixer')
              ]
            }
          },
          {
            loader: 'px2rem-loader',
            options: {
              // 1rem = 75px, 适合750px的视觉稿
              remUnit: 75,
              // px 转换为 rem 后小数点后的位数
              remPrecision: 8
            }
          },
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
          // {
          //   // url-loader 也可以处理图片和字体
          //   // 可以设置较小资源自动 base64
          //   // 添加到 JS 文件，看不到文件名？
          //   loader: 'url-loader',
          //   options: {
          //     // 小于 10KB(10240Bytes) 
          //     limit: 10240
          //   }
          // }
          {
            loader: 'file-loader',
            options: {
              // 为图片文件添加 hash
              // [ext] 为资源后缀名占位符
              name: '[name]_[hash:8].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        // use: 'file-loader'
        use: [
          {
            loader: 'file-loader',
            options: {
              // 为字体文件添加 hash
              // [ext] 为资源后缀名占位符
              name: '[name]_[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },
  // plugin 插件配置在 plugins 数组中
  plugins: htmlWebpackPlugins.concat([
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css'
    }),
    new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano')
    }),
    new HTMLInlineCSSWebpackPlugin(),
    new CleanWebpackPlugin()
  ])
};