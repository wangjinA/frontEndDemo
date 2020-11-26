/*
 * @Author: 汪锦
 * @Date: 2020-08-22 11:32:55
 * @LastEditors: 汪锦
 * @LastEditTime: 2020-10-16 11:27:32
 * @Description: 通用请求
 */

import axios from '@/axios'
import Vue from 'vue'
const commonAPI = {
  // 天气
  getWeather: params =>
    axios.$default.get('https://apip.weatherdt.com/plugin/data?key=VRnKLeoUe6', {
      location: 101280105,
      ...params
    }),
  // 天气
  getWeather1: params =>
    axios.$default.get('https://tianqiapi.com/api', {
      params: {
        appid: '75282572',
        version: 'v1',
        city: '汕头',
        appsecret: 'RFj43URO',
        vue: 1,
        ...params,
      }
    })
}

Vue.prototype.$commonAPI = commonAPI
