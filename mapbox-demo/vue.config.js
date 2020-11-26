/*
 * @Author: 梁智超
 * @Date: 2020-02-10 17:28:31
 * @LastEditors: 梁智超
 * @LastEditTime: 2020-11-11 17:20:28
 * @Description: vue配置
 */
const path = require("path");

const resolve = dir => {
  return path.join(__dirname, dir);
};

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,例如：http://68.61.1.8/ ,默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：http://68.61.1.8/szqw-web-app/ 需要将它改为'/szqw-web-app/'
const BASE_URL = process.env.NODE_ENV === "production" ? "./" : "./";

module.exports = {
  publicPath: BASE_URL,
  lintOnSave: false,
  chainWebpack: config => {
    config.resolve.alias
      .set("@", resolve("src"))
    // 转base64大小
    // config.module.rule('images').use('url-loader').loader('url-loader').options({
    //     limit: 15000
    // })
    // config.module.rule('compile').test(/\.js$/).include.add(resolve('src'));
  },
  // 打包时不生成.map文件
  productionSourceMap: false,
  /* less全局公共配置 */
  pluginOptions: {
    "style-resources-loader": {
      // preProcessor: "less",
      // patterns: [
      //   //这个是加上自己的路径，
      //   //注意：试过不能使用别名路径
      //   path.resolve(__dirname, "./src/style/globalStyle_var.less")
      // ]
    }
  },
  devServer: {
    // dev环境下代理（解决跨域）
  //   proxy: {
  //     "/baseMap_nomal": {
  //       target: "http://112.94.13.13:18399",
  //       changeOrigin: true,
  //       secure: false,
  //       pathRewrite: {
  //         "^/baseMap_nomal": ""
  //       }
  //     }
  //   }
  }
};
