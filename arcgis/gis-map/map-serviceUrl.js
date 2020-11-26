/*
 * @Author: 梁智超
 * @Date: 2020-03-24 17:09:56
 * @LastEditors: 汪锦
 * @LastEditTime: 2020-10-29 17:51:26
 * @Description: 地图相关地址配置
 */
let companyNetPath = 'http://112.94.13.13:18398'
let filePath = '/arcgis_js_api/library/3.25/3.25'

/**
 * baseMap: 底图url， 这里可以定义自己服务器上的底图的地址，也可以使用ArcGis提供的底图，详见Basemap类
 * map_pgis: 地图底图，pgis矢量图
 * map_pgis_img: 地图底图，pgis影像图
 * map_dark: 地图底图，自切白色矢量图
 * map_white: 地图底图，自切深色矢量图
 * api: 地图API
 * pgisJs: pgis API
 * css: 地图API样式css
 * tundraCssUrl: 主题
 * claroCssUrl: 主题
 * routeUrl: 路线计算服务
 */

// 公司外网
export default {
  api: `${companyNetPath}${filePath}/init-ww.js`,// 公司外网
  // api: `${companyNetPath}${filePath}/init.js`, // 公司内网
  css: `${companyNetPath}${filePath}/esri/css/esri.css`,
  pgisJs: `${companyNetPath}${filePath}/HYPGISLayer2.0.js`,
  tundraCssUrl: `${companyNetPath}${filePath}/dijit/themes/tundra/tundra.css`,
  claroCssUrl: `${companyNetPath}${filePath}/dijit/themes/claro/claro.css`,
  map_pgis: '',
  map_pgis_img: '', // 影像图
  map_dark: '/baseMap_nomal/arcgis/rest/services/PGISALLB/MapServer',
  // map_white: '/baseMap_nomal/arcgis/rest/services/PGISALLW1/MapServer', // 矢量图
  map_white: '/baseMap_nomal/arcgis/rest/services/mcraster/MapServer', // 麻涌矢量图
  routeUrl: '/baseMap_nomal/arcgis/rest/services/network/NAServer/Route'
}