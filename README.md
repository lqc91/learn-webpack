# 什么是 Webpack

本质上，Webpack 是一个现代 JavaScript 应用程序的静态模块打包器（static module bundler）。在 Webpack 处理应用程序时，它会在内部创建一个依赖图（dependency graph），用于映射到项目需要的每个模块，然后将所有这些依赖生成一个或多个 bundle。

## webpack & Node.js

### [`__dirname`](https://nodejs.org/api/modules.html#modules_dirname)

- webpack 使用了 Node.js 模块作用域下的 `__dirname` 变量
- 用于防止不同操作系统之间的文件路径问题
- 指代当前模块的目录名
- 等同于 `path.dirname(__filename)`

### [`path`](https://nodejs.org/api/path.html)

- webpack 使用了 Node.js 内置的 `path` 模块
- `path` 模块用于处理文件和目录路径

    ```js
    // 引入 Node.js path 模块
    const path = require('path');
    ```

- `path.join([...paths])` 使用平台特定的分隔符将给定的路径序列连接在一起，并规范化生成的路径
    `path.join(__dirname, 'dist');`
- `path.resolve([...paths])` 用于将路径序列解析为绝对路径
    `path.resolve(__dirname, 'dist')`

## 核心概念

### `entry`

- 指定 webpack 的项目打包入口，即依赖图的入口
- 单文件入口 entry 可以是字符串、对象或数组
- 多文件入口 entry 是一个对象

```js
// 单文件入口：字符串形式
module.exports = {
    entry: './path/to/my/entry/file.js'
};

// 单文件入口：对象形式
module.exports = {
    entry: {
        main: './path/to/my/entry/file.js'
    }
};

// 单文件入口：数组形式
// 合并输出，实际是一个入口
module.exports = {
    entry: ['./src/app.js', './src/home.js']
};

// 多文件入口：对象形式
module.exports = {
    entry: {
        home: './src/home.js',
        search: './src/search.js',
        list: './src/list.js'
    }
};
```

### `output`

- 指定如何将编译后的文件输出到磁盘
- 一个 webpack 配置，只能有一个 output
- 对于多入口，通过占位符确保文件名的唯一

```js
// 单文件入口
module.exports = {
    outpput: {
        filename: 'bundle.js',
        // __dirname 表被执行 JS 文件的绝对路径？
        path: __dirname + 'dist'
    }
};

// 多文件入口
module.exports = {
    output: {
        filename: '[name].js',
        path: __dirname + 'dist'
    }
};
```

### `loader`

- 模块转化器，模块的处理器，对模块进行转换处理
- webpack 开箱即用只支持 JS 和 JSON 两种文件类型
- 通过 loaders 去支持其他文件类型，把它们转化成有效的模块，添加到依赖图中
- loader 本身是一个函数，接受源文件作为参数，返回转换的结果
- 使用对应的 loader 之前，需要先安装：`npm i -D <loader>`
- **webpack 的 loader 解析顺序是从右到左（从后到前）**

```js
const path = require('path');

module.exports = {
    module: {
        rules: [
            {
                test: /\.txt$/, // test 指定匹配规则
                use: 'raw-loader' // use 指定使用的 loader 名称
            }
        ]
    }
};
```

### `plugin`

- 插件用于 bundle 文件的优化，资源管理和环境变量注入
- 可以处理 chunk，也可以对最后的打包结果（bundle 文件）进行处理，可以完成 loader 完不成的任务
- 作用于整个构建过程

```js
const path = require('path');

// 非默认的插件
// ExtractTextWebpackPlugin 用于将CSS 从 bundle 文件里提取成一个独立的 CSS 文件
const ExtractTextPlugin = require('extract-text-webpack-plugin);

module.exports = {
    plugins: [
        // 导出 css 文件到单独的内容
        new ExtractTextPlugin({
            filename: 'style.css'
        })
    ]
};
```

### `mode`

- mode 用来指定当前的构建环境是：production, development 还是 none
- 设置 mode 可以使用 webpack 内置的函数，开启一些优化选项
- 默认值为 `production`
- `development`: 设置 `process.env.NODE_ENV` 的值为 `development`；开启
`NamedChunksPIugin` 和 `NamedModuIesPIugin`
- `production`: 设置 `process.env.NODE_ENV` 的值为 `production`；开启
`FIagDependencyUsagePlugin`, `FIagIncIudedChunksPIugin`, `ModuIeConcatenationPIugin`, `NoEmitOnErrorsPIugin`, `OccurrenceOrderPIugin`, `SideEffectsFtagPlugin` 和 `TerserPIugin`
- `none`: 不开启任何优化选项

### `module`

- 模块，开发中每一个文件都可以看作模块，模块不局限于 js，也包含 css、图片等

### `chunk`

- 代码块，一个 chunk 可以由多个模块组成

### `bundle`

- 最终打包完成的文件，一般就是和 chunk 一一对应的关系，bundle 就是对 chunk 进行编译压缩打包等处理后的产出

### loader VS plugin

- loader 面向的是解决某个或某类模块的问题
- plugin 面向的是项目整体，解决的是 loader 解决不了的问题

## 常见的 loader

- `babel-loader`: 转换 ES6, ES7等 JS 新特性语法
- `css-loader`: 支持 `.css` 文件的加载和解析
- `less-loader`: 将 less 文件转换成 css
- `ts-loader`: 将 TS 转换成 JS
- `file-loader`: 进行图片、字体等的打包
- `raw-loader`: 将文件以字符串的形式导入
- `thread-loader`: 多进程打包 JS 和 CSS

## 常见的 plugin

- `CommonsChunkPlugin`: 将 chunks 相同的模块代码提取成公共 JS
- [`clean-webpack-plugin`](https://github.com/johnagan/clean-webpack-plugin): 构建前清理构建文件
- `ExtractTextWebpackPlugin`: 将 CSS 从 bundle 文件里提取成一个独立的 CSS 文件
- `CopyWebpackPlugin`: 将文件或文件夹拷贝到构建的输出目录
- `HtmlWebpackPlugin`: 创建 html 文件去承载输出的 bundle
- `UglifyjsWebpackPlugin`: 压缩 JS
- `ZipWebpackPlugin`: 将打包出的资源生成一个 zip 包

## 资源解析

### ES6

- 使用 `babel-loader`(依赖 babel)
- babel 的配置文件是：`.babelrc`

```js
const path = require('path');

module.exports = {
    mode: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader'
            }
        ]
    }
};

```

### 增加 ES6 的 babel preset 配置

- `@babel/preset-env`
- babel presets: 一系列 babel plugins 的集合
- babel plugins: 一个 plugin 对应一个功能

```json
// .babelrc
{
    "presets": [
        "@babel/preset-env"
    ],
    "plugins": [
        "@babel/proposal-class-properties"
    ]
}
```

### 解析 React  JSX

- `@babel/preset-react`

```json
// .babelrc
{
    "presets": [
        "@babel/preset-react"
    ],
    "plugins": [
        "@babel/proposal-class-properties"
    ]
}
```

### 解析 CSS

- css-loader 用于加载 `.css` 文件，并且转换成 commonjs 对象
- style-loader 将样式通过 `<style>` 标签插入到 head 中

```js
module.exports = {
    rules: [
        {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader'
            ]
        }
    ]
};
```

### 解析 Less 和 SaSS

- less-loader 用于将 less 转换成 css
- sass-loader 用于将 sass 转换成 css

```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                    // or
                    // 'sass-loader'
                ]
            }
        ]
    }
};
```

### 解析图片

- file-loader 用于处理文件

```js
module.exports = {
    rules: [
        {
            test: /\.(png|svg|jpg|jpeg|gif)$/,
            use: [
                'file-loader'
            ]
        }
    ]
};
```

### 解析字体

- file-loader 也可以用于处理字体

```js
module.exports = {
    rules: [
        {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [
                'file-loader'
            ]
        }
    ]
};
```

### 资源解析：使用 url-loader

- url-loader 也可以处理图片和字体
- 可以设置较小资源自动 base64

```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            // 10240 Byte = 10 KB
                            limit: 10240
                        }
                    }
                ]
            }
        ]
    }
};
```

## 文件监听

- 文件监听是在发现源码发生变化时，自动重新构建出新的输出文件

### webpack 开启监听模式的两种方式

#### 启动 webpack 命令时，带上 `--watch` 参数

```json
// package.json
{
    "scripts": {
        "watch": "webpack --watch"
    }
}
```

#### 在 `webpack.config.js` 中设置 `watch: true`

```js
// webpack.config.js
module.export = {
    // 默认 false，即不开启
    watch: true,
    // 只有开启监听模式，watchOptions 才有意义
    watchOptions: {
        // 默认为空，不监听的文件或文件夹，支持正则匹配
        ignored: /node_modules/,
        // 监听到变化发生后等待 300ms 再执行，默认 300ms
        aggregateTimeout: 300,
        // 判断文件是否发生变化是通过不停询问系统指定文件有没有变化实现的，默认每秒询问 1000次
        poll: 1000
    }
}
```

### 文件监听的原理

- 轮询判断文件的最后编辑时间是否变化
- 某个文件发生变化，并不会立刻告诉监听者，而是先缓存起来，等待 `aggregateTimeout` 时间后执行

### 文件监听的缺陷

- 每次需要手动刷新浏览器

## 热更新

### webpack-dev-server

- WDS 不刷新浏览器
- WDS 不输出文件，而是放在内存（而非磁盘）中，构建速度更快
- 需配合 `HotModuleReplacementPlugin` （webpack 内置）插件使用
- 主要在开发环境中使用，生产环境不需要

### ? webpack-dev-middleware

- WDM 将 webpack 输出的文件传输给服务器
- 适用于灵活的定制场景

### ? 热更新原理

![热更新原理](https://upload-images.jianshu.io/upload_images/16121135-54fd28b1f487f9fb.png?imageMogr2/auto-orient/strip|imageView2/2/format/webp)

- Webpack Compile: 将 JS　编译成 Bundle
- HMR Server: 将热更新的文件输出给 HMR Runtime
- Bundle Server: 提供文件在浏览器的访问
- HMR Runtime: 会被注入到浏览器，更新文件的变化
- bundle.js: 构建输出的文件

## 文件指纹

- 文件指纹是指打包后输出的文件名的后缀（指定文件名与扩展名之间的 hash）
- 通常用于文件的版本管理，未修改文件依然可用浏览器缓存，加速页面访问
- 需要使用生产环境的 webpack 配置，因为 chunkhash 无法与热更新（HMR 开发环境使用）一起使用
- `hash`: 和整个项目的构建相关，只要项目文件有修改，整个项目构建的 hash 值就会更改
- `chunkhash`: 和 webpack 打包的 chunk 有关，不同的 entry 会生成不同的 chunkhash 值
- `contenthash`: 根据文件内容来定义 hash，文件内容不变，则 contenthash 不变

### JS 文件指纹设置

- 设置 output 的 filename，使用 [chunkhash]

```js
module.exports = {
    output: {
        // chunkhash:8
        filename: '[name][chunkhash:8].js'
    }
};
```

### CSS 的文件指纹设置

- 设置 `MiniCssExtractPlugin` 的 filename，使用 [contenthash]

```js
module.exports = {
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name][contenthash:8].css'
        });
    ]
};
```

### 图片的文件指纹设置

- 设置 file-loader 的 name，使用 [hash]
- 占位符
  - `[ext]`: 资源后缀名
  - `[name]`: 文件名称
  - `[path]`: 文件的相对路径
  - `[folder]`: 文件所在的文件夹
  - `[contenthash]`: 文件的内容 hash，默认是 md5 生成
  - `[hash]`: 文件内容的 hash，默认是 md5 生成
  - `[emoji]`: 一个随机的指代文件内容的 emoji

```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'img/[name][hash:8].[ext]'
                    }
                }]
            }
        ]
    }
};
```

## 代码压缩

### JS 文件的压缩

- 内置了 `uglifyjs-webpack-plugin`
- webpack v4.0+ mode 设置为 production，默认开启 `uglifyjs-webpack-plugin`，无需额外处理

### CSS 文件的压缩

- 使用 `optimize-css-assets-webpack-plugin`，同时使用预处理器 `cssnano`

```js
module.exports = {
    plugins: [
        new OptimizeCSSAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano')
        })
    ]
};
```

### HTML 压缩

- 修改 [`html-webpack-plugin`](https://github.com/jantimon/html-webpack-plugin)，设置压缩参数

```js
module.exports = {
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src/search.html'),
            filename: 'search.html',
            chunks: ['search],
            inject: true,
            minify: {
                html5: true,
                collapseWhitespace:true,
                preserveLineBreaks: false,
                minifyCSS: true,
                minifyJS: true,
                removeComments: false
            }
        })
    ]
};
```

## 自动清理构建目录产物

- 每次构建时不清理目录，会造成构建的输出目录 output 文件越来越多
- 通过 `npm scripts` 清理构建目录

    ```js
    // 递归删除目录及其内容，并执行 webpack 构建
    rm -rf ./dist && webpack

    // 使用 npm 包 rimraf 删除目录及其内容，并执行 webpack 构建
    rimraf ./dist && webpack
    ```

- 使用 [`clean-webpack-plugin`](https://github.com/johnagan/clean-webpack-plugin)

  - 默认删除 output 指定的输出目录

    ```js
    // 安装
    npm -i clean-webpack-plugin -D

    // webpack.config.js
    // v3.0.0 引入方式
    // es modules
    import { CleanWebpackPlugin } from 'clean-webpack-plugin';
    // common js
    const { CleanWebpackPlugin } = require('clean-webpack-plugin');

    // v2.0.2 引入方式
    const CleanWebpackPlugin = require('clean-webpack-plugin');

    // 使用
    modeule.exports = {
        plugins: [
            new CleanWebpackPlugin()
        ]
    };
    ```

## PostCSS 插件 autoprefixer 自动补全 CSS3 前缀

- CSS3 属性前缀
  - IE: Trident(-ms)
  - Firefox: Geko(-moz)
  - Chrome: Webkit(-webkit)
  - Opera: Presto(-o)
- 使用 autoprefixer 插件
  - 根据 [Can I Use](https://caniuse.com/) 规则
  - `postcss-loader` 执行顺序必须保证在 `css-loader` 之前（需要在 `css-loader` 将样式转换成 cjs 对象插入到 js 代码前），建议放在 `less` 或 `sass` 等预处理器之后，即 loader 顺序：
    - `less-loader` or `sass-loader` > `postcss-loader` > `css-loader` > `style-loader` or `MiniCssExtractPlugin.loader`
    - 不过 `postcss-loader` 放在 `less-loader` 之前问题也不大，平时使用的 `less` 语法基本不会和 `autoprefixer` 处理产生冲突
  - `autoprefixer` 插件是 `postcss` 生态下的，与 webpack 插件没有关联，需要通过 `loader` 的 `options` 传递 `postcss` 所需要的插件
  - [autoprefixer](https://github.com/postcss/autoprefixer) 9.6 已废弃 browsers 选项
  - 建议将 `browserslist` 配置到 `package.json` 或 `.browserslistrc` 文件中
  - 也可以将 `browsers` 改成 `overrideBrowserlist`，但不推荐
  - 将版本列表写做类似 `last 2 version` 会被转换为 `versions`

```js
// webpack.config.js
module.exports = {
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                require('autoprefixer')
                            ]
                        }
                    }
                ]
            }
        ]
    }
};
```

```json
// package.josn
{
    "dependencies": {
        "autoprefixer": [
            "last 2 versions",
            "> 1%",
            "IE 10"
        ]
    }
}
```

## 移动端 CSS px 自动转换成 rem

- CSS 媒体查询实现响应式布局
  - 缺陷：需要写多套适配样式代码
- rem
  - W3C 对 rem 的定义：font-size of the root element
  - rem 和 px 的对比
    - rem 是相对单位
    - px 是绝对单位
- 移动端 CSS px 自动转换成 rem
  - 使用 px2rem-loader
  - 页面渲染时计算根元素的 font-size 值
    - 可以使用手淘的 [lib-flexible](https://github.com/amfe/lib-flexible) 库
    - 需要复制js代码到 `<head>` 内，因为需要页面打开时立刻计算根元素的 font-size 值，且 node_modules 文件夹不会出现在仓库中
- 处理 less or sass 文件的 loader 顺序
  - `less-loader` or `sass-loader` > `px2rem-loader` > `postcss-loader` > `css-loader` > `style-loader` or `MiniCssExtractPlugin.loader`

```js
// webpack.config.js
module.exports = {
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                require('autoprefixer')
                            ]
                        }
                    },
                    {
                        loader: 'px2rem-loader',
                        options: {
                            // 1 rem = 75 rem, 适合 750px 的视觉稿
                            remUnit: 75,
                            // px 转换为 rem 后小数点后的位数
                            remPrecision: 8
                        }
                    },
                    'less-loader'
                ]
            }
        ]
    }
};
```

## 静态资源内联

- 资源内联的意义
  - 代码层面
    - 页面框架的初始化脚本？
    - 上报相关打点？
    - CSS 内联避免页面闪动
  - 请求层面：减少 HTTP 网络请求数
    - 小图片或字体内联（url-loader）
  - raw-loader 内联 HTML，JS
    - raw-loader 可以将文件作为字符串导入
    - HTML 内联
      - `${require('raw-loader!./meta.html')}`
    - JS 内联
      - `<script>${require('raw-loader!babel-loader!../node_modules/lib-flexible/flexible.js')}</script>`
    - **raw-loader 需使用 0.5.1 版**（`npm i raw-loader@0.5.1 -D`）
      - 最新版的 3.x 导出模块直接使用了 export default 的写法，html 里面的模块这样写，webpack 解析不了，需要是 cjs 的写法才行
  - CSS 内联
    - 方案一：借助 style-loader

        ```js
        // webpack.config.js
        module.exports = {
            module: {
                rules: [
                    {
                        test: /\.scss$/,
                        use: [
                            {
                                loader: 'style-loader',
                                options: {
                                    // 样式插入到 <head>
                                    insertAt: 'top',
                                    // 将所有的 style 标签合并成一个
                                    singleton: true
                                }
                            },
                            'css-loader',
                            'sass-loader'
                        ]
                    }
                ]
            }
        };
        ```

    - 方案二：[html-inline-css-webpack-plugin](https://github.com/Runjuu/html-inline-css-webpack-plugin)
      - ==html-inline-css-webpack-plugin 需放在 html-webpack-plugin 后面==

        ```js
        // webpack.config.js
        const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;
        module.exports = {
            plugins: [
                new MiniCssExtractPlugin({
                    filename: '[name]_[contenthash:8].css'
                }),
                new HtmlWebpackPlugin(),
                new HTMLInlineCSSWebpackPlugin()
            ]
        };
        ```

  - 压缩导入的html, css, js 可使用 html-webpack-plugin 的 minify 参数

## 多页面应用打包通用方案

- 多页应用(MPA)概念
  - 每一次页面跳转的时候，后台服务器都会返回一个新的 html 文档，这种类型的网站也就是多页网站，也叫做多页应用
- 单页面应用所有业务都放在一个大的入口，不同的子业务是同一个 URL，只是 hash 会发生变化
- 多页面打包基本思路
  - 每个页面对应一个 entry，一个 html-webpack-plugin
  - 优点：每个页面之间是解耦的；对 SEO 更加友好
  - 缺点：每次新增或删除页面需要更改 webpack 配置

  ```js
  module.exports = {
      entry: {
          index: './src/index.js',
          search: './src/search.js'
      }
  };
  ```

- 多页面打包通用方案
  - 动态获取 entry 和设置 html-webpack-plugin 数量

    ```js
    module.exports = {
        entry: {
            index: './src/index/index.js',
            search: './src/search/index.js'
        }
    };
    ```

  - [glob](https://www.npmjs.com/package/glob)
  - 利用 glob.sync
    - `entry: glob.sync(path.join(__dirname, './src/*/index.js'))`

```js
// webpack.config.js
// 引入 glob 模块
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
    entry: entry,
    output: {
      filename: '[name]_[chunkhash:8].js',
      path: __dirname + '/dist'
    },
    // html-inline-css-webpack-plugin 需放在 html-webpack-plugin 后面
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
```

## 使用 sourcemap

- 作用：通过 source map 定位到源代码的错误位置
  - [source map 科普文](http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html)
- 开发环境开启，线上环境关闭
  - 线上排查问题的时候可以将 sourcemap 上传到错误监控系统
- [source map 关键字(可组合使用)](https://webpack.docschina.org/configuration/devtool)
  - eval: 使用 eval 包裹模块代码
  - source-map: 产生 .map 文件
  - cheap: 不包含列信息
  - inline: 将 .map 作为 DataURI 嵌入，不单独生成 .map 文件
  - module: 包含 loader 的 sourcemap
- **通过 devtool 控制如何显示 sourcemap**
- 一般在实际项目中
  - 生产环境不使用 `source-map` 或有 Sentry 之类错误跟踪系统时使用 `source-map`（既不暴露源代码，也方便解决生产环境遇到的 bug）
  - 开发环境使用 `cheap-module-eval-source-map`
    - 综合考虑首次构建及二次构建打包速度，及是否可定位源码

### 不同 source map 类型对应打包速度及特点

- +++ 非常快速，++ 快速，+ 比较快，0 中等，- 比较慢，-- 慢

devtool | 首次构建速度 | 二次构建速度 | 是否适合生产环境 | 可定位的代码
------- | ------------ | ------------ | ---------------- | ------------
留空，none | +++ | +++ | yes | 打包后最终输出的代码
eval | +++ | +++ | no | webpack 生成的代码（一个个的模块）
cheap-eval-source-map | + | ++ | no | 经过loader转换过的代码（只能看到行）
cheap-module-eval-source-map | 0 | ++ | no | 源代码（只能看到行）
eval-source-map | - | + | no | 源代码
cheap-source-map | + | 0 | no | 经过loader转换过的代码（只能看到行）
cheap-module-source-map | 0 | - | no | 源代码（只能看到行）
inline-cheap-source-map | + | 0 | no | 经过loader转换过的代码（只能看到行）
inline-cheap-module-source-map | 0 | - | no | 源代码（只能看到行）
source-map | - | - | yes | 源代码
inline-source-map | - | - | no | 源代码
hidden-source-map | - | - | yes | 源代码
nosources-source-map | - | - | yes | 无源代码内容

## 提取页面公共资源

- 基础库分离
  - 思路：将 react, react-dom 基础包通过 cdn 引入，不打入 bundle 中
  - 方法：使用 html-webpack-externals-plugin
    - ==html-webpack-externals-plugin 需放在 html-webpack-plugin 后面==
    - ==react 和 react-dom 在 index.html 中被引入一次，在 search.html 中被引入两次？==

    ```js
    // webpack.config.js
    const const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');

    module.exports = {
        plugins: [
            new HtmlWebpackPlugin(),
            new HtmlWebpackExternalsPlugin(
                externals: [
                    {
                      module: 'react',
                      entry: 'https://cdn.bootcss.com/react/16.10.2/umd/react.production.min.js',
                      global: 'React'
                    },
                    {
                      module: 'react-dom',
                      entry: 'https://cdn.bootcss.com/react-dom/16.10.2/umd/react-dom.production.min.js',
                      global: 'ReactDOM'
                    }
                ]
            )
        ]
    }
    ```

- 利用 SplitChunksPlugin 进行公共脚本分离
  - Webpack4 内置的 SplitChunksPlugin，替代 CommonsChunksPlugin 插件
  - chunks 参数说明
    - async: 异步引入的库进行分离（默认）
    - initial: 同步引入的库进行分离
    - all: 所有引入的库进行分离（推荐）
  - test: 匹配出需要分离的包
  - minChunks: 设置最小引用次数为2次
  - minSize: 分离的包的体积的大小
  - **公共文件打包出来后，在页面中引用需要在htmlWebpackPlugin.chunks中加入公共文件名**

```js
// webpack.config.js
module.exports = {
    // ...
    optimization: {
        splitChunks: {
            // 三选一： "initial" | "all" | "async" (默认)
            chunks: 'async',
            // 最小尺寸，30K，development 下是10k
            // 越大那么单个文件越大，chunk 数就会变少
            // 针对于提取公共 chunk 的时候，不管再大也不会把动态加载的模块合并到初始化模块中
            // 当这个值很大的时候就不会做公共部分的抽取了
            minSize: 30000,
            // 文件的最大尺寸，0为不限制，优先级：maxInitialRequest/maxAsyncRequests < maxSize < minSize
            maxSize: 0,
            // 默认1，被提取的一个模块至少需要在几个 chunk 中被引用，这个值越大，抽取出来的文件就越小
            minChunks: 1,
            // 在做一次按需加载的时候最多有多少个异步请求，为 1 的时候就不会抽取公共 chunk 了
            maxAsyncRequests: 5,
            // 针对一个 entry 做初始化模块分隔的时候的最大文件数，优先级高于 cacheGroup，所以为 1 的时候就不会抽取 initial common 了
            maxInitialRequests: 3,
            // 打包文件名分隔符
            automaticNameDelimiter: '~',
            // 拆分出来文件的名字，默认为 true，表示自动生成文件名，如果设置为固定的字符串那么所有的 chunk 都会被合并成一个
            name: true,
            cacheGroups: {
                vendors: {
                    // 正则规则，如果符合就提取 chunk
                    test: /[\\/]node_modules[\\/]/,
                    // 缓存组优先级，当一个模块可能属于多个 chunkGroup，这里是优先级
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20, // 优先级
                    // 如果该chunk包含的modules都已经另一个被分割的chunk中存在，那么直接引用已存在的chunk，不会再重新产生一个
                    reuseExistingChunk: true
                }
            }
        }
    }
};
```

```js
// webpack.config.js
module.exports = {
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /(react|react-dom)/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    }
};
```

```js
// webpack.config.js
module.exports = {
    optimization: {
        splitChunks: {
            minSize: 0,
            cacheGroups: {
                commons: {
                    name: 'commons',
                    chunks: 'all',
                    minChunks: 2
                }
            }
        }
    }
};
```

## Tree Shaking 的使用和原理分析

### tree shaking(摇树优化)

- 概念：1个模块可能有多个方法，只要其中的某个方法使用到了，则整个文件都会被打到 bundle 里面去，tree shaking 就是只把用到的方法打入 bundle，没用到的方法会在 uglify 阶段被擦除掉
- 使用：webpack 默认支持，在 `.babelrc` 里面设置 `modules: false` 即可
  - production mode 的情况下默认开启
- 要求
  - 必须是 ES6 语法，CJS 的方式不支持
  - 模块代码方法不能有副作用，否则 tree shaking 会失效

### DCE (Dead code elimination，死码清除)

- 代码不会被执行，不可到达
- 代码执行的结果不会被用到
- 代码只会影响死变量（只写不读）

### Tree-shaking 原理

- 利用 ES6 模块的特点
  - 只能作为模块顶层的语句出现
  - import 的模块名只能是字符串常量
  - import binding 是 immutable（不可改变） 的
- 代码擦除：uglify 阶段删除无用代码

## Scope Hoisting 使用和原理分析

- 现象：构建后的代码存在大量闭包代码
- 导致的问题
  - 大量作用域包裹代码，导致体积增大（模块越多越明显）
  - 运行代码时创建的函数作用域变多，内存开销变大

### webpack 的模块机制

- 被 webpack 转换后的模块会带上一层包裹
- import 会被转换成 `__webpack_require__`
- 打包出来的是一个 IIFE（匿名函数）
- modules 是一个数组，每一项是一个模块初始化函数
- `__webpack-require__` 用来加载模块，返回 `module.exports`
- 通过 `WEBPACK_REQUIRE_METHOD(0)` 启动程序

### scope hoisting 原理

- 原理：将所有模块的代码按照引用顺序放在一个函数作用域里，然后适当的重命名一些变量以防止变量名冲突
- 对比：通过 scope hoisting 可以减少函数声明代码和内存开销

### scope hoisting 使用

- webpack4 mode 为 production 默认开启
- 必须是 ES6 语法，CJS 不支持
- webpack3 中需要使用 webpack.optimize.MuduleConcatenationPlugin
  - 直接使用 production mode 时，代码会被压缩，不容易看出前后变化，可将 mode 设为 none，手动引入该插件，方便观察前后变化

```js
// webpack.config.js
// webpack3
const webpack = require('webpack');

module.exports = {
    plugins: [
        new webpack.optimize.MuduleConcatenationPlugin()
    ]
};
```

### 其他

- bundle 文件中的 harmony 是 ES6 的简称？
- harmony import 指代 ES6 的 import 语法
- harmony export 指代 ES6 的 export 语法

## 31. 代码分割和动态 import

### 代码分割的意义

- 对于大的 Web 应用来讲，将所有的代码都放在一个文件中显然是不够有效的，特别是当你的某些代码是在某些特殊的时候才能被使用到。webpack 有一个功能就是将你的代码库分割成 chunks(语块)，当代码运行到需要它们的时候再进行加载
- 适用的场景
  - 抽离相同代码到一个共享块
  - 脚本懒加载，使得初始下载的代码更小

### 懒加载 JS 脚本的方式

- CommonJS: require.ensure
- ES6: 动态 import（目前还没有原生支持，需要 babel 转换）

### 如何使用动态 import

- 安装 babel 插件
  - `npm install @babel/plugin-synax-dynamic-import --save-dev`
- ES6: 动态 import（目前还没有原生支持，需要 babel 转换）
  - `{ "plugins": ["@babel/plugin-syntax-dynamic-import"] }`

## 参考资料

- 三水清 · [Webpack 从零入门到工程化实战](https://www.imooc.com/read/29)
- 程柳锋 · [玩转 webpack](https://time.geekbang.org/course/intro/190)
- 程柳锋 · [webpack4 中如何实现资源内联？](https://github.com/cpselvis/blog/issues/5)
- [webpack 中文文档](https://webpack.docschina.org/concepts/)
