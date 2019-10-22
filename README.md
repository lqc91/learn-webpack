# 什么是 Webpack

[TOC]

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
- `cleanWebpackPlugin`: 清理构建目录
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
        // 增加 ES6 的 babel preset 配置
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
        // 增加 React 的 bebel preset 配置
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

## 参考资料

- 三水清 · [Webpack 从零入门到工程化实战](https://www.imooc.com/read/29)
- 程柳锋 · [玩转 webpack](https://time.geekbang.org/course/intro/190)
- [webpack 中文文档](https://webpack.docschina.org/concepts/)