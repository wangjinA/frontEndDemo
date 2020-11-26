/*
 * @Author: 梁智超
 * @Date: 2020-03-24 17:09:56
 * @LastEditors: 梁智超
 * @LastEditTime: 2020-04-20 18:52:50
 * @Description: 地图相关地址配置
 */
let companyNetPath = 'http://112.94.13.13:18398'
let policeNetPath = 'http://83.102.66.20:8081'
let filePath = '/arcgis_js_api/library/3.25/3.25'
const isGaNet = false

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

// 公安网
const policeNet = {
  api: `${policeNetPath}${filePath}/init.js`,
  css: `${policeNetPath}${filePath}/esri/css/esri.css`,
  pgisJs: `${policeNetPath}${filePath}/HYPGISLayer2.0.js`,
  map_pgis: '/baseMap_nomal/PGIS_S_TileMapServer/ags2/vector/',
  map_pgis_img: '/baseMap_nomal/PGIS_S_TileMapServer/ags2/raster/', // 影像图
  map_dark: '/baseMap_customs/arcgis/rest/services/PGISMAPB/PGISALLB20191125/MapServer',
  map_white: '/baseMap_customs/arcgis/rest/services/PGISMAPW/PGISALLW20191122/MapServer', // 矢量图
  tundraCssUrl: `${policeNetPath}${filePath}/dijit/themes/tundra/tundra.css`,
  claroCssUrl: `${policeNetPath}${filePath}/dijit/themes/claro/claro.css`,
  geometryServiceUrl: 'http://83.102.66.23:8399/arcgis/services/Geometry/GeometryServer?wsdl', // 测量长度面积服务
  routeUrl: '/baseMap_customs/arcgis/rest/services/network/NAServer/Route'
}
// 公司外网
const companyNet = {
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
const ServiceUrl = isGaNet ? policeNet : companyNet
export {
  ServiceUrl
}
