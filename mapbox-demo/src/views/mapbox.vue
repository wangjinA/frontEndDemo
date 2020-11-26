<!--
 * @Author: 梁智超
 * @Date: 2020-11-11 17:05:43
 * @LastEditors: 梁智超
 * @LastEditTime: 2020-11-12 16:27:18
 * @Description: mapbox主文件
-->
<template>
  <div class="mapbox-content">
    <div class="map" ref="basicMapbox"></div>
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";
export default {
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  methods: {
    created() {},
    // 初始化
    init() {
      mapboxgl.accessToken =
        "pk.eyJ1IjoibHpjMTEzNzU3NjM3OCIsImEiOiJja2hkN3h5cjQwNzFuMnR0OTBucDEyNnRuIn0.A_pX_bpiLHJJvv1SZQYF6A"; //地图秘钥，自行获取 https://docs.mapbox.com/mapbox-gl-js/api/
      window.hyMapbox = new mapboxgl.Map({
        container: this.$refs.basicMapbox,
        // maxZoom: 17,
        zoom: 15,
        center:[113.264780, 23.123900], // 广州市局
        style: {
          version: 8,
          name: "mapboxdata",
          sources: {
            tdtbase: {
              type: "raster",
              tiles: [
                "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}"
              ],
              tileSize: 256
            }
          },
          layers: [
            {
              id: "tdtbase",
              type: "raster",
              source: "tdtbase",
              minzoom: 0,
              maxzoom: 18
            }
          ]
        }
      });
      this.addControls();
    },
    // 添加地图自带工具
    addControls() {
      // 导航（NavigationControl，放大、缩小以及指北针按钮）
      let nav = new mapboxgl.NavigationControl();
      hyMapbox.addControl(nav, "top-left");
      // 定位(GeolocateControl)、
      let geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true // 高精度定位
        },
        trackUserLocation: true // 跟踪位置变化
      });
      hyMapbox.addControl(geolocate);
      // 比例尺(ScaleControl)
      let scale = new mapboxgl.ScaleControl({
        maxwidth: 80, // 控件最大宽度，单位像素
        unit: "metric" // 距离单位设为米
      });
      hyMapbox.addControl(scale);
      // 全屏(FullscreenControl)
      let fullScreen = new mapboxgl.FullscreenControl();
      hyMapbox.addControl(fullScreen);
    }
  }
};
</script>
<style lang="css">
  @import url('https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.2/mapbox-gl.css');
</style>
<style lang="less" scoped>
.mapbox-content,
.map {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
