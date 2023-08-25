## 从0 开始构建一个基于vue3+webpack5+ts 项目需要打npm包和作用

#### npm init y 初始化

#### npm i webpack@5.85.1 webpack-cli@5.1.3 -D 按照webpack相关包

#### npm i vue@^3.3.4 -S 按照vue3

#### 配置tsconfig.json的内容

#### npm i serve -g 
1. 全局安装本地node服务器 serve
2. 在本地执行  serve -s dist（dist是本地打包后的目录） 就可以启动本地打包后的项目了

#### npm i webpack-dev-server -D 
1. wenpack 本地开发服务器，开启热更新自动监听变化，自动打包构建，自动刷新浏览器。。。等等

#### npm i webpack-merge -D
1. 可以合并两个webpack.config.js 的配置，用以区分webpack 公共基础配置和开发、生产环境配置

#### npm i cross-env -D 
1. 兼容各系统的设置环境变量-process.env.xxx 如  process.env.NODE_ENV等
2. webpack.DefinePlugin : webpack **内置**的插件，可以为业务代码注入环境变量，webpack在构建是识别到对应的环境变量就会替换成DefinePlugin 设置的对应的值
3. NODE_ENV 表示开发还是生产环境   BASE_ENV 表示接口对应的环境 ， 并修改package.json 的script指令
4. webpack.base.js 中使用Webpack.DefinePlugin 将环境变量注入到业务代码中 


#### npm i style-loader css-loader postcss-loader autoprefixer less-loader -D
1. less-loader 将less代码解析为css代码
2. postcss-loader 搭配 autoprefixer **可以给css 自动添加前缀，兼容.browserslistrc 指定的浏览器版本**
```
{
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: ['autoprefixer']
                            }
                        }
                    },

// 可以将配置提取到 postcss.config.js 中，webpack的loader中就可以直接使用postcss-loader了
```
3. css-loader 解析css代码
4. style-loader 把解析的css代码从js中抽离，放到头部style中(**在运行时**)
5. **通过 include 或者 exclude 缩小loader的作用范围**
   
#### npm i babel-loader @babel/core @babel/preset-env core-js -D
1. 许多新标准的js和非标准的js语法在低版本浏览器不兼容，使用babel及相关包来转换新的js语法为es5 以兼容低版本浏览器。
2. babel-loader: 使用babel加载最新的js代码并转换成ES5
3. @babel/core : babel编译的核心包
4. @babel/preset-env : babel编译的预设，可以转换目前最新的js标准语法
5. core-js : 使用低版本js语法模拟高版本的库，也即是垫片(polyfill)
```
 {
        test: /\.ts$/,
        use: {
          loader: 'babel-loader',
          options: {
            // 执行顺序由右往左,所以先处理ts,再处理js,最后再试一下babel转换为低版本语法
            presets: [
              [
                "@babel/preset-env",
                {
                  // 设置兼容目标浏览器版本,这里可以不写,babel-loader会自动寻找上面配置好的文件.browserslistrc
                  // "targets": {
                  //  "chrome": 35,
                  //  "ie": 9
                  // },
                   "useBuiltIns": "usage", // 根据配置的浏览器兼容,以及代码中使用到的api进行引入polyfill按需添加
                   "corejs": 3, // 配置使用core-js低版本
                  }
                ],
              [
                '@babel/preset-typescript',
                {
                  allExtensions: true, //支持所有文件扩展名，很关键
                },
              ]
            ]
          }
        }
      }

可以抽离webpack内关于babel相关的配置 到babel.config.js中

```

#### npm i copy-webpack-plugin -D
1. 可以将指定目录下的静态资源直接复制到webpack打包后的文件夹中，不需要webpack解析，一般public文件夹放一些静态资源，可以直接绝对路径引入使用
2. 在生产环境的webpack.prod.js 中使用插件
3. 执行 npm run build:dev 打包操作后，public下的静态文件直接被复制到dist里

#### webpack5 使用 asset-modules 代替了原来webpack4的file-loader 和 url-loader
1.  asset 类型会自动区分文件大小，小于maxSize的就转换base64链接，大于的就复制引入文件，图片，字体，媒体类型的文件都可以使用asset-module
1. .vue 文件在引入使用图片等其他类型文件时，需要先声明好.d.ts 模块类型 如：declare module '*.png'



#### npm i speed-measure-webpack-plugin -D 
1. 用于输出各个loader和plugin的构建花费时间，可以针对性优化构建速度
2. 使用
   1. 引入插件  const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin')
   2. const smp = new SpeedMeasureWebpackPlugin() //实例化
   3. smp.wrap(webpackConfig) 开始该webpackConfig的配置的构建分析
   4. 使用前后的效果   打包： 2.6s -> 324ms   ; 开发：  2.65s -> 811

#### npm i thread-loader -D 
1. webpack是单线程构建，可用thread-loader开启多线程构建，减少构建时间
2. 多线程构建启动需要500ms左右，适用于比较大项目

#### webpack5配置alias 别名
1. resolve.alias = {'@':path.join(__dirname,'../src')}, 配置tsconfig.json 内的 compilerOptions的 baseUrl = "." 和paths = {"@/*:["src/*"]"}属性
2. 修改完就可以 通过@/xxx 样子的路径 访问src下的文件


#### webpack 5 开启devtool配置可以开启source-map 源码映射
1. 便于显示排查bug出现在源码的位置而不是只能看到构建后的文件位置
2. devtool 的命名规则是 **^(inline-|hidden-|eval-)?(nosources-)?(cheap-(module-)?)?source-map** 
3. 开发环境建议配置为   eval-cheap-module-source-map
4. 正式环境就配置为 "" 可以不用配置， 正式环境要用的话推荐 cheap-module-source-map 只展示含信息，单独存在map文件，大小速度均衡
5. 命名的含义
   1. inline- : 代码通过dataUrl的形式引入sourcemap
   2. hidden- : 生成sourcemap但是不使用
   3. eval- : eval(...)的形式执行代码，通过dataUrl的形式引入sourcemap
   4. nosources- : 不生产sourcemap
   5. cheap- : 只定位到行信息，不需要列信息
   6. module- : 展示源码中的错误位置
   
#### npm i webpack-bundle-analyzer -D
  1. webpack打包后的文件大小结果可视化插件
  2. 使用 ： const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer'); plugins:[new BundleAnalyzerPlugin()]
  3. 注意 ： 运行npm run build:analyze 分析指令的时候，本地不能处于运行的状态，需要先退出dev运行状态 

#### npm i mini-css-extract-plugin -D 抽离css到单独的文件，以便后续压缩css文件  
  1. 使用上是要实例化该插件，并且插件类暴露loader对象用于抽离css
  2. const MiniCssExtractPlugin = require('mini-css-extract-plugin')
  3. 在rules的css 文件loader处理中，MiniCssExtractPlugin.loader 代替style-loader， 将css抽离
  4. new MiniCssExtractPlugin({filename:'static/css/[name].css'}) // 实例化插件，将要腠理的css输出到指定的路径下
   
#### npm i css-minimizer-webpack-plugin -D 
  1. 压缩构建后的 .css文件内容
  2. 在optimization.minimizer属性中配置
  3. **【注意】：当mode='production',webpack会默认使用内置插件terser-webpack-plugin去压缩js代码，且该插件默认支持多线程压缩，但是使用了optimization.minimizer之后，js压缩就失效了，需要手动引入terser-webpack-plugin**

#### npm i terser-webpack-plugin -D
1. 当开启optimization.minimizer的压缩插件时，手动引入terser-webpack-plugin 开始js压缩
2. parallel:true 开启多线程压缩
3. terserOptions.compress.pure_func = ["console.log"] // 可以删除console.log代码 

#### 合理配置打包文件的hash,可以起到优化浏览器缓存的策略,hash 分三种
1. hash:只要有文件改动，每次打包整个项目的hash都会改变，且都是同一个hash
2. chunkhash:根据不同的入口文件构建的依赖文件解析，构建对应的chunk,文件本身或者依赖的文件发生改动，该chunkHash的值才会改动，**适用于合并都一个chunk的配置,例如第三方库打包后的js**
3. contenthash:每个文件自己单独的contenthash,只要当文件变动才会改变该文件的hash值，**适用于不常变动/单独的文件，例如图片，css**

#### webpack 代码分割 optimization.splitChunks
1. 按照代码的共同引用次数来分割代码到不同的chunk里边，优化构建速度和浏览器缓存
2. 详情查看 [https://webpack.docschina.org/plugins/split-chunks-plugin/#optimizationsplitchunks]


#### tree-shaking 清理引用了但没有使用到的js和css
1. mode=production时，webpack4+以后构建时会自动清理掉没有使用的引用js
2. 要移除未使用到的css，需要使用 purgecss-webpack-plugin  插件的**PurgeCSSPlugin** 搭配 glob-all 插件，识别目标路径下的文件使用到哪些**类名，id 和标签名**,以移除其他没有用到的样式
   1. 注意， purgecss-webpack-plugin 不是万能，可能存在移除了第三方UI的样式，如 element-ui  以^el- 开头的样式，页面里没有声明，就会被移除
   2. 【白名单】： prugecss-webpack-plugin 提供了safelist:{standar:[]} ，以过滤数组内符合正则条件的样式，如 standar:[/^el-/],过滤以el-开头的类名，哪怕没用到也不删除
3. css modules 会生成随机字符串的css类名，也会被删除，解决办法是
   1. 在css-loader 里给添加 options.modules = {localIdentName:'css_module_[name]_[local][chunkhash:8]'}
   2. 构建时给每个css 加个前缀，然后 purgecss-webpack-plugin 的safelist.standard 加上对应的前缀，就可以避免css module 被删除
   3. 参考[https://betheme.net/yidongkaifa/373.html?action=onClick]
   
#### npm i compression-webpack-plugin -D
1. 在构建时就压缩代码成gzip, 也可以在nginx 上开启gzip:on,但是耗时耗内存
   
 