const prodConfig = require('./webpack.prod')
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin')
const smp = new SpeedMeasureWebpackPlugin() // 实例化分析插件
const { merge } = require('webpack-merge')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

// smp.wrap函数，传入prod配置，可以生成prod环境的构建结果
module.exports = smp.wrap(merge(prodConfig, {
    // 预留合并空位，给其他需要的配置
    plugins: [
        new BundleAnalyzerPlugin(), //开启打包后文件大小分析可视化 
    ]
}))