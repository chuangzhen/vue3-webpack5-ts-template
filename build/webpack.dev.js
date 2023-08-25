const path = require('path')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.js')

module.exports = merge(baseConfig, {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map', //源码映射-便于调试直接定位到源码指定的行信息
    devServer: {
        port: 3000, //端口号
        compress: false, //gzip压缩，开发环境不启动,提升热更新速度
        hot: true, // 开启热更新 ?? todo v3热替换具体配置
        historyApiFallback: true, // 解决history 路由 404的问题
        static: {
            directory: path.join(__dirname, '../pubilc') // 托管开发环境静态资源文件夹
        }
    },
})