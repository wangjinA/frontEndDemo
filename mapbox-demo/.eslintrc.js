/*
 * @Author: 梁智超
 * @Date: 2020-03-24 17:09:57
 * @LastEditors: 梁智超
 * @LastEditTime: 2020-11-11 17:07:11
 * @Description: eslint配置
 */
module.exports = {
  root: true,
  parserOptions: {
    parser: "babel-eslint"
  },
  env: {
    browser: true
  },
  extends: ["plugin:vue/essential"],
  // required to lint *.vue files
  plugins: ["vue"],
  // add your custom rules here
  rules: {
    // allow async-await
    "generator-star-spacing": "off",
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "eol-last": 0,
    "space-before-function-paren": 0,
    indent: "off",
    "vue/script-indent": [
      "error",
      2,
      {
        baseIndent: 1
      }
    ],
    // v-for和v-if一起使用报错
    "vue/no-use-v-if-with-v-for": ["error", {
      "allowUsingIterationVar": true
    }],
    // 解决iview Input标签报错
    "vue/no-parsing-error": [2, { "x-invalid-end-tag": false }],
    // 强制一行的最大长度
    "max-len": [1, 200]
  }
};
