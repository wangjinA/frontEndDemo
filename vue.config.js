module.exports = {
  devServer: {
    // dev环境下代理（解决跨域）
    proxy: {
      "/arcgis": {
        target: "http://10.44.50.27:8399/", //公安网
        changeOrigin: true,
        pathRewrite: {
          // "^/": "",
        },
      },
      '/testapi': {
        target: 'http://localhost:8083/',
        changeOrigin: true,
        pathRewrite: {
          "^/testapi": "",
        },
      },
      // '/testapi': {
      //   target: 'http://10.44.50.27:8399/',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     "^/testapi": "",
      //   },
      // }
    }

  },
}