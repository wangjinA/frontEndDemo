/*
 * @Author: 汪锦
 * @Date: 2020-07-13 09:19:58
 * @LastEditors: 汪锦
 * @LastEditTime: 2020-11-02 09:23:46
 * @Description: 项目入口函数
 */
import Vue from 'vue'
import App from './App.vue'


Vue.config.productionTip = false
new Vue({
  render: h => h(App)
}).$mount('#app')
