/** 
  * @fileoverview gisMap 地图操作函数集合 
  * @author 创建者名称 xubao 
  * @createtime 创建时间 2020-02-12 09:57:53 
  * @lastmodifiedby 最后一次更新人 梁智超 
  * @lasttime 最后一次更新时间 2020-02-12 09:57:53 
  * @version 版本号 v0.1 
  */ 
 
/**
 * 初始化 gisMap 地图函数
 * @param {*} id
 * @param {*} center
 * @param {*} zoom
 * @param {*} maxZoom
 * @param {*} minZoom
 */
export const createEsrimap = (id, center, zoom, minZoom, maxZoom) => {
  return new esri.Map(id, {
    center: new esri.geometry.Point(...center),
    zoom: zoom, // 贵阳pgis底图 10-20
    maxZoom: maxZoom || 20, // 最大空间等级
    minZoom: minZoom || 10, // 最小空间等级
    autoResize: true,
    slider: false, // 左上的缩放 +/-;
    sliderPosition: 'bottom-right', // 缩放位置
    logo: false, // 右下的esri logo
    showAttribution: false
  })
}

/**
 * 初始化 gisMap 地图所需模块
 */
export const getMapModules = () => {
  let all = [
    'esri/map',
    // 点位图片
    'esri/symbols/PictureMarkerSymbol',
    // 点对象
    'esri/symbols/SimpleMarkerSymbol',
    // 线对象
    'esri/symbols/SimpleLineSymbol',
    // 文字对象
    'esri/symbols/TextSymbol',
    // 字体
    'esri/symbols/Font',
    // 面对象
    'esri/symbols/SimpleFillSymbol',
    // 图形（点，线，面）
    'esri/geometry',
    // 圆，引入上述模块后仍报Circle不存在的错误，单独引入
    'esri/geometry/Circle',
    // 弹窗
    'esri/dijit/InfoWindow',
    /* 热力图 */
    'esri/renderers/HeatmapRenderer',
    'esri/Color',
    /* 散点图 */
    'ClusterLayer',
    // 坐标系
    'esri/SpatialReference',
    // 画图
    'esri/toolbars/draw',
    // 编辑图形
    'esri/toolbars/edit',
    // 右键菜单
    'dijit/Menu',
    'dijit/MenuItem',
    'dijit/MenuSeparator',
    // 测距离、面积
    'esri/tasks/GeometryService',
    'esri/tasks/LengthsParameters',
    'esri/geometry/geodesicUtils',
    // 单位
    'esri/units',
    'dojo/dom-construct',
    // buffer
    'esri/tasks/BufferParameters',
    'esri/geometry/normalizeUtils',
    'esri/config',
    'esri/geometry/geometryEngine',
    // 底图
    'esri/layers/ArcGISTiledMapServiceLayer',
    // 路线规划
    'esri/tasks/RouteTask',
    'esri/tasks/RouteParameters',
    'esri/tasks/FeatureSet'
  ]

  return all
}

/**
 * 创建arcgis地图瓦片图层
 * @param {*} layerId 图层ID
 * @param {*} url 瓦片地址
 */
export const createTilesLayer = (layerId, url) => {
  return new esri.layers.ArcGISTiledMapServiceLayer(url, {
    id: layerId
  })
}

/**
 * 创建pgis地图瓦片图层
 * @param {*} layerId 图层ID
 * @param {*} url 瓦片地址
 */
export const createPgisTilesLayer = (layerId, url) => {
  return new esri.layers.HYPGISLayer(url, layerId)
}

/**
 * 创建图层
 * @param {String} layerId 图层id
 * @param {Number} layerOpacity 图层透明度
 */
export const createLayer = (layerId, opacity) => {
  return new esri.layers.GraphicsLayer({
    id: layerId,
    opacity: opacity || 1
  })
}

export const removeLayers = (map, layers) => {
  if (layers) {

  } else {
    map.removeAllLayers()
  }
}

export const clearMarkers = (map, layerId) => {

}

/**
 * 根据图层ID数组，创建图层并添加至地图
 * @param {*} map gis map 地图对象
 * @param {*} layers 图层ID数组
 */
export const addLayersById = (map, layers) => {
  if (map && layers && layers.length > 0) {
    layers.map(layer => {
      map.addLayer(new esri.layers.GraphicsLayer({
        id: layer,
        opacity: 1
      }))
    })
  } else {
    console.log('图层添加失败！参数不存在或参数错误')
  }
  return layers
}


/**
 * 弹窗功能按钮
 * @param {*} map gis map 地图对象
 * @param {*} layers 图层ID数组
 */
export const popupEvent = (e, graphic) => {
  if (e.key == "bf") {
    /* 视频-视频播放 */
    let spList = [graphic.attributes.DATA_NUM];
    let spNum = 1;
    let spLink = getSPUrl(spList, spNum);
    let spWindow = window.open(
      spLink,
      "viewCamera",
      "location=0,menubar=0,status=0,height=200,toolbar=0,width=500,top=450,left=500"
    );
    setTimeout(res => {
      spWindow.close();
    }, 5000);
  } else if (e.key == "gwcl") {
    /* 卡口-过往车辆 */
    let DATA_NUM = graphic.attributes.DATA_NUM;
    let gwclNAME = graphic.attributes.NAME;
    if (DATA_NUM) {
      this.$parent.gwclNum = DATA_NUM;
      this.$parent.gwclNAME = gwclNAME ? `(${gwclNAME})` : "";
      this.$parent.hyModal.isGWCL = true;
    } else {
      this.$Message.error("没卡口数据");
    }
  } else if (e.key == "yjls") {
    /* 重点人员-预警历史 */
    let DATA_NUM = graphic.attributes.CAMERA_ID;
    let yjlsName = graphic.attributes.CAMERA_NAME;
    if (DATA_NUM) {
      this.$parent.yjlsNum = DATA_NUM;
      this.$parent.yjlsName = yjlsName ? `(${yjlsName})` : "";
      this.$parent.hyModal.isYJLS = true;
    } else {
      this.$Message.error("没重点人员数据");
    }
  } else if (e.key == "lsgj_jy" || e.key == "gjhf") {
    /* 警员-历史轨迹、重点人员-轨迹回放 */
    this.$Message.info({
      duration: 5,
      content: `请先选择时间，确定后再查看轨迹！`
    });
    this.historyType = e.key;
    this.$parent.isHistory = true;
    this.functionEvt = graphic;
  } else if (e.key == "cz") {
    /* 警情-处置 */
    let data = graphic.attributes;
    if (this.$route.name == "yjzh") {
      this.bus.$emit("chuzhi_JQ", data);
    } else {
      this.$router.push({
        name: "yjzh",
        params: {
          data: data,
          action: "chuzhi"
        }
      });
    }
  } else if (e.key == "tjzfz") {
    /* 视频-添加至分组 */
    this.bus.$emit("selectVideo", "mapView", graphic.attributes);
  } else if (e.key == "addVideoList") {
    /* 视频-添加至播放 */
    this.bus.$emit("addVideoList", graphic.attributes);
  } else if (e.key == "tjzya") {
    /* 视频-添加至重大活动视频预案 */
    this.bus.$emit("tjzya", graphic.attributes);
  } else if (e.key == "editAttribute") {
    // 编辑属性
    this.bus.$emit("editAttribute", graphic.attributes);
  } else if (e.key == "cjlx") {
    this.bus.$emit("jl_cjlx", graphic.attributes);
  } else if(e.key == "sssp") {
    if(graphic.attributes.DATA_NUM){
      let spLink = getPoliceSPUrl(graphic.attributes.DATA_NUM);
      window.open(spLink,'_blank');
    }else{
      this.$Message.error("该警员无设备编号！")
    }
  }
}
