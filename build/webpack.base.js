const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isDev = process.env.NODE_ENV === 'development'

module.exports = {
    // 入口文件
    entry: path.join(__dirname, '../src/index.ts'),

    // 出口文件
    output: {
        filename: 'static/js/[name].[chunkhash:8].js', // 每个输出的js的位置和名称
        path: path.join(__dirname, '../dist'), // 打包后文件输出的路径
        clean: true, // true 没次打包会先删除dist文件夹，webpack4需要 clean-webpack-plugin插件来删除
        publicPath: '/' // 打包后文件的公共前缀路径
    },

    // 配置loader解析ts和vue
    module: {
        rules: [
            {
                test: /\.vue$/, //匹配.vue结尾的文件
                use: ['thread-loader', 'vue-loader'], // 用vue-loader 解析,使用thread-loader 开启多线程构建.vue文件
                include: [path.join(__dirname, '../src')], // 缩小loader的作用范围，减少构建耗时
            },
            {
                test: /\.ts$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                "@babel/preset-typescript",
                                {
                                    allExtensions: true, // 支持所有文件拓展名【重要】
                                }]
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                // 这里css-loader 的顺序是从右往左
                use: [
                    isDev ? 'style-loader' : MiniCssExtractPlugin.loader, // 开发环境css注入style,生产环境css最后抽离
                    'css-loader',
                    'postcss-loader',
                ],
                generator:{
                    filename:'static/css/[name].[contenthash:8][ext]'
                }
            },
            // 精准使用loader，避免不必要的文件被解析，如 css被less-loader解析
            {
                test: /\.less$/,
                // 这里css-loader 的顺序是从右往左
                use: [
                    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'less-loader'
                ],
                generator:{
                    filename:'static/css/[name].[contenthash:8][ext]'
                }
            },
            {
                test: /\.(ts|js)$/,
                exclude: /node_modules/,  // 排除某个路径下的文件，缩小loader的作用范围
                use: ["thread-loader", "babel-loader"], //使用thread-loader 开启多线程构建js ts 文件
                include: [path.join(__dirname, '../src')], // 缩小loader的作用范围，减少构建耗时
            },

            {// 处理图片文件， webpack 4 要用file-loader url-loader处理，webpack 5 自带asset-module
                // 其他类型的文件也同图片的处理一直，加多一个asset-modules loader配置对象就好
                test: /.(png|jpg|jpeg|svg)$/,
                type: 'asset', // type 选中asset
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024, // 小于10k的转换成base 64, 大于10K 则引入图片
                    }
                },
                generator: {
                    filename: 'static/images/[name].[ext]', // 将大于10k的图片输出到指定的目录下，并命名
                }
            },




        ]
    },

    // 安装插件

    plugins: [
        new VueLoaderPlugin(), // vue-loader 插件，用于在webpack构建中编译.vue内的模板 样式 脚本，转换为js模块
        // 生产index.html 模板 并引入js
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html'),//模板取定义root节点的文件,通过绝对路径
            inject: true, // 自动注入静态资源
        }),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
            "process.env.BASE_ENV": JSON.stringify(process.env.BASE_ENV)
        }),


    ],

    // 配置resolve 扩展 
    resolve: {
        // extensions 自动根据数据的元素依次补齐后缀再查找文件是否存在，这里只配置js ts vue json, 其他文件引入要求带上后缀，可以提高构建速度
        extensions: ['.vue', '.ts', '.js', '.json'],

        //配置别名-搭配stsconfig.json 中的 baseUrl 和 paths
        alias: {
            "@": path.join(__dirname, '../src')
        },

        // 如果用的是pnpm 就暂时不要配置这个，会有幽灵依赖的问题，访问不到很多模块。
        // 查找第三方模块只在本项目的node_modules中查找
        modules: [path.resolve(__dirname, '../node_modules')],

    },

    // webpack5 自动持久化缓存功能,filesystem是开启
    cache: {
        type: 'filesystem' //使用文件缓存
    }

}