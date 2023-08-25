const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.js')
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerWebpacPlugin = require('css-minimizer-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin')
const globAll = require('glob-all')
const CompressionWebpackPlugin = require('compression-webpack-plugin')

module.exports = merge(baseConfig, {
    mode: 'production', //生产模式 ， 会开启tree-shaking 和 代码压缩和其他优化
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, '../public'), // 从这个路径下复制静态文件
                    to: path.resolve(__dirname, '../dist'), //复制到打包后的dist内
                    filter: (source) => !source.includes('index.html') // 过滤掉index.html的复制，htmlwebpackPlugin插件已经复制了
                }
            ]
        }),
        // 压缩抽离后的css文件
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash:8].css'
        }),

        // 删除没有引用到的css
        new PurgeCSSPlugin({
            paths: globAll.sync([
                `${path.join(__dirname, '../src')}/**/*.vue`,
                path.join(__dirname, '../public/index.html')
            ]),
            safelist: {
                standard: [/^el/], // 跳过以el-开头的css不删除
            }
        }),
        new CompressionWebpackPlugin({
            test:/.(css|js)$/, // 只压缩css 和js文件
            filename:'[path][base].gz', //文件命名
            algorithm:'gzip', //压缩格式， gzip是浏览器默认支持的格式，默认是gzip
            threshold:10240, // 只有大小大于该值的资源才会被压缩，默认是10K
            minRatio:0.8 ,//压缩比率，默认值是0.8
        })
    ],

    optimization: {
        minimizer: [
            new CssMinimizerWebpacPlugin(), // 压缩构建抽离后.css的文件内容
            new TerserWebpackPlugin({
                parallel: true,
                terserOptions: {
                    compress: {
                        pure_funcs: ["conosle.log"]
                    }
                }
            }), // 手动开启js压缩，没有使用optimization.minimizer的话，mode=production时，时默认使用的
        ],
        splitChunks: { // 代码分割
            cacheGroups: {
                vendors: {
                    test: /node_modules/, // 只匹配node_modules里的模块
                    name: 'vendors',// 提前文件命名为vendors, js后缀和chunkhash会字段加上
                    minChunks: 1, // 使用次数，满足要求就会被提取出来
                    chunks: 'initial', // 有 all：所以情况 async：异步模块 initial：初始化直接能获取的模块 三种
                    minSize: 0, // 提取的代码体积大于多少Byte就提取出来
                    priority: 1,//提取优先级，同样满足不同cacheGroup的属性配置，优先级高的优先提取

                },
                commons: {
                    name: 'commons',
                    minChunks: 2,
                    chunks: 'initial',
                    minSize: 1000
                }
            }
        }
    }
    // devtool: "" , //不用配置

})