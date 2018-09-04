const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const config = require('./base.config')
const utils = require('./utils')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
// 清理 /dist 文件夹插件
const CleanWebpackPlugin = require('clean-webpack-plugin')
// 复制静态文件
const CopyWebpackPlugin = require('copy-webpack-plugin')
// 把css从js中分离出来
const ExtractTextPlugin = require('extract-text-webpack-plugin')
//打包
const FileManagerPlugin = require('filemanager-webpack-plugin');
const HtmlIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

module.exports = merge(common, {
  // 入口
  entry: {
    main: './src/main.js',
  },
  mode: 'production', // 生产环境
  // 对调试源码(debug)和运行基准测试(benchmark tests)很有帮助
  // devtool: 'source-map', //
  // 出口文件(js)
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('scripts/[name].[hash].js'),
    chunkFilename: utils.assetsPath('scripts/[id].[hash].js')
  },
  plugins: [
    // 构建之前先清里dist文件
    new CleanWebpackPlugin([config.build.outputPath]),
    new webpack.DllReferencePlugin({
      context: path.resolve(__dirname),
      manifest: require('./vendor-manifest.json')
    }),
    new UglifyJSPlugin({
      sourceMap: true // 开启代码压缩
    }),
    new webpack.DefinePlugin({
      'process.env': 'production'
    }),
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: './src/index.html',
      favicon: './favicon.ico',
      inject: true,  // 向template或者templateContent中注入所有静态资源
      // false就是不使用html压缩
      minify: {
        collapseWhitespace: true //折叠空白区域 也就是压缩代码
      },
      hash: true, // 是否为所有注入的静态资源添加webpack每次编译产生的唯一hash值
    }),

    // css分离
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[hash].css'),
      allChunks: true,
    }),
    // 复制自定义静态资源
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ]),
   
    // // 这个主要是将生成的vendors.lib.js文件加上hash值插入到页面中。
    new HtmlIncludeAssetsPlugin({
      assets: ['static/scripts/vendor.dll.js'],
      append: false // false 在其他资源的之前添加 true 在其他资源之后添加
    }),
    new ParallelUglifyPlugin({
      workerCount: 4,
      uglifyJS: {
        output: {
          beautify: false, // 不需要格式化
          comments: false // 保留注释
        },
        compress: { // 压缩
          warnings: false, // 删除无用代码时不输出警告
          drop_console: true, // 删除console语句
          collapse_vars: true, // 内嵌定义了但是只有用到一次的变量
          reduce_vars: true // 提取出出现多次但是没有定义成变量去引用的静态值
        }
      }
    }),

    //打包
    new FileManagerPlugin({
      onEnd: {
        delete: [
          './build/wcenter-web.tar.gz'
        ],
        archive: [
          { source: `./build/dist`, destination: './build/wcenter-web.tar.gz' }
        ]
      }
    })
  ]
});