<!--分页-->
<template>
  <div>1</div>
</template>

<script>
import { loadModules } from "esri-loader";
export default {
  /* eslint-disable */
  mounted() {
    let fn = "";
    loadModules(["esri/Map", "esri/views/MapView", "esri/layers/TileLayer"]).then(
      ([Map, MapView, TileLayer]) => {
        var layer = new TileLayer({
          url: "/arcgis/rest/services/PGISALLW1/MapServer",
          id: "test",
        });
        var map = new Map({
          layers: [layer],
        });
        // fn = () => {
        // return new esri.layers.ArcGISTiledMapServiceLayer(url, {
        //   id: layerId
        // })
        // }
        var view = new MapView({
          container: "viewDiv",
          map: map,
          // center: [-118.805, 34.027], // longitude, latitude
          center: [106.63888, 26.646349], // longitude, latitude
          zoom: 13,
        });
      }
    );
  },
  /* eslint-disable */
};
</script>
