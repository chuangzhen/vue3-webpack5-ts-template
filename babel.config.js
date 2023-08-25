module.exports = {
    //  数组从右往左执行，先处理ts，再处理js，最后再babel转换为低版本语法
    "presets": [
        [
            "@babel/preset-env",
            {
                // babel 会自动找上.broswerslistrc的配置，兼容浏览器版本
                "useBuiltIns": "usage", // 根据配置的浏览器兼容，以及代码中使用到的es api, 按需引入对应的polyfill
                "corejs": 3, // 配置使用core-js 3版本
            }
        ],
        [
            "@babel/preset-typescript", //处理ts
            {
                allExtensions: true //支持所有文件扩张名
            }
        ]
    ]
}