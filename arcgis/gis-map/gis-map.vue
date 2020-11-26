<template>
  <div class="gis-map">
    <div :id="mapId" class="map"></div>
    <RemoteJs :src="PGISLayerUrl"></RemoteJs>
    <RemoteCss :href="tundraCssUrl"></RemoteCss>
  </div>
</template>
<script>
  import { mapMutations } from "vuex";
  import RemoteJs from './remoteJs'
  import RemoteCss from './remoteCss'
  import * as esriLoader from 'esri-loader'
  import * as mapUtil from './map-methods'
  import { ServiceUrl } from './map-serviceUrl'
  import { map_constant } from '@/config/config-mapResource'
  export default {
    name: 'GisMap',
    props: {
      mapId:{
        type:String,
        default:"gisMap"
      },
      isSaveVuex:{
        type:Boolean,
        default:true
      }
    },
    components: { RemoteCss, RemoteJs },
    data () {
      return {
        gisMap: null,
        layer: null,
        // center: [106.661796, 26.61657], //贵阳
        center: [113.583828,23.069997],
        zoom: {
          value: 15,
          min: 10,
          max: 20
        },
        ServiceUrl: ServiceUrl,
        PGISLayerUrl: ServiceUrl.pgisJs,
        tundraCssUrl: ServiceUrl.tundraCssUrl,
        claroCssUrl: ServiceUrl.claroCssUrl
      }
    },
    watch: {},
    methods: {
      ...mapMutations(["setEsriModules", "setGisInst","setMap","setMapConstant"]),
      init () {
        let gisModules = mapUtil.getMapModules()
        esriLoader.loadCss(this.ServiceUrl.css) // 加载css;
        // 加载模块
        esriLoader
          .loadModules(gisModules, {
            url: this.ServiceUrl.api
          })
          .then(modules => {
            this.saveEsriModules(modules, gisModules);
          })
          .then(this.initGisMap)
      },
      saveEsriModules(myModule,gisModules) {
        let esriModules = {};
        for (let i = 0; i < myModule.length; i++) {
          const element = myModule[i];
          this.$set(
            esriModules,
            gisModules[i].replace(/\//g, "_"),
            element
          );
        }
        this.setEsriModules(esriModules);
      },
      initGisMap () {
        initPGISLayer()
        // 配置map实例
        this.gisMap = mapUtil.createEsrimap(
          this.mapId,
          this.center,
          this.zoom.value,
          this.zoom.min,
          this.zoom.max
        )
        // 初始化底图
        this.initBaseLayer(this.gisMap)
        if(this.isSaveVuex){
          // 存vuex
          this.setMap(this.gisMap);
          // 地图常量存vuex
          this.setMapConstant(map_constant);
        }
        this.$emit("mapInit",this.gisMap)
      },
      initBaseLayer (map) {
        // pgis 矢量图
        if (this.ServiceUrl.map_pgis !== '') {
          map.addLayer(
            new esri.layers.HYPGISLayer(ServiceUrl.map_pgis, 'map_pgis')
          )
        }
        // pgis 影像图
        // if (this.ServiceUrl.map_pgis_img !== '') {
        //   map.addLayer(
        //     new esri.layers.HYPGISLayer(ServiceUrl.map_pgis_img, 'map_pgis_img')
        //   )
        // }
        // 自切 白色矢量图
        // if (this.ServiceUrl.map_white !== "")
        //   map.addLayer(
        //     mapUtil.createTilesLayer("map_white", this.ServiceUrl.map_white)
        //   );
        // 自切 深色矢量图
        // if (this.ServiceUrl.map_dark !== '') {
        //   map.addLayer(
        //     mapUtil.createTilesLayer('map_dark', this.ServiceUrl.map_dark)
        //   )
        // }
      }
    },
    mounted () {
      this.$nextTick(()=>{
        this.init()
      })
    }
  }
</script>
<style lang="less" scoped>
.fullscreen {
  width: 100%;
  height: 100%;
}
.gis-map {
  position: relative;
  .fullscreen;
  .map {
    .fullscreen;
  }
}
</style>
<style lang="less">
@import "./infoWindow.less";
</style>
