<!--分页-->
<template>
  <div id="viewDiv"></div>
</template>

<script>
import { loadModules } from 'esri-loader'
/**
 * options:
 *  layer: 图层对象
 *  layerId: 图层名称
 *  position: [经度,纬度]
 */
const arcigsModules = {
  'esri/Map': 'Map',
  'esri/views/MapView': 'MapView',
  'esri/layers/TileLayer': 'TileLayer',
  'esri/Graphic': 'Graphic',
  'esri/layers/GraphicsLayer': 'GraphicsLayer'
}
const modulesNames = Object.keys(arcigsModules)
const modulesVar = Object.keys(arcigsModules).map(key => {
  return arcigsModules[key]
})
export default {
  methods: {
    callAddPoint() {
      this.addPoint({
        position: [106.641467, 26.63847],
        layer: this.getLayer($map, 'point'),
        img: require('./images/gqsp.png'),
        size: '30'
      })
    },
    addPoint(options) {
      let pictureGraphic = new Gis.Graphic({
        geometry: {
          type: 'point',
          longitude: options.position[0],
          latitude: options.position[1]
        },
        symbol: {
          type: 'picture-marker',
          url: options.img,
          width: options.width || options.size,
          height: options.height || options.size
        }
      })
      console.log(options.layer)
      options.layer.add(pictureGraphic)
    },
    getLayer(map, layerId, pushMap = true) {
      let layer = map.layers.get(layerId)
      if (!layer) {
        layer = new Gis.GraphicsLayer({
          id: layerId
        })
        pushMap && map.add(layer)
      }
      return layer
    }
  },
  mounted() {
    let fn = ''
    window.Gis = {}
    loadModules(modulesNames).then(res => {
      modulesVar.forEach((key, i) => {
        window.Gis[key] = res[i]
      })
      let layer = new Gis.TileLayer({
        url: '/arcgis/rest/services/PGISALLW1/MapServer',
        id: 'test'
      })
      let map = new Gis.Map({
        layers: [layer]
      })
      let view = new Gis.MapView({
        container: 'viewDiv',
        map: map,
        // center: [-118.805, 34.027], // longitude, latitude
        center: [106.63888, 26.646349], // longitude, latitude
        zoom: 13
      })
      window.$map = map
      window.$view = view
      this.callAddPoint()
    })
  }
}
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}
#viewDiv {
  height: 100vh;
  width: 100vw;
}
</style>
