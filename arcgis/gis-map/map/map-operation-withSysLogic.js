/*
 * @Author: 梁智超
 * @Date: 2020-04-07 11:29:50
 * @LastEditors: 梁智超
 * @LastEditTime: 2020-10-12 11:12:55
 * @Description: 业务逻辑相关的方法
 */
import vueObj from "@/main";
import { creatPointGraphics, createMapLayer, addClickHandler } from "@/libs/map/map-common";
import {
  searchRect,
  searchCircle,
  searchPolygon,
} from "_api/map-view/getGeoPosition";
import store from '@/store'
let vm = '';
(function getVm() {
  vm = vueObj
  if(!vm){
    setTimeout(() => {
      getVm()
    }, 100);
  }
})()


/**
 * 图标上图
 * @param {Object} map 地图
 * @param {Object} data 数据
 * @param {Object} layer 图层对象
 * @param {Object} img 上图图标信息
 */
export const showIconInMap = (map, data, layer, img) => {
  let points = data;
  let defaultImg = {};
  if (img.size && img.size.length > 0) {
    defaultImg = img;
  } else {
    defaultImg = Object.assign(img, { size: [30, 30] });
  }
  points.forEach((res) => {
    if (
      res.X == "0" ||
      res.Y == "0" ||
      res.X == 0 ||
      res.Y == 0 ||
      !res.X ||
      !res.Y
    ) {
      // 坐标信息不全
    } else {
      let testLocation = [res.X, res.Y];
      // 点位信息
      let attributes = res;
      if (layer.id.includes("JQCASE")) {
        let level = attributes.JQ_LEVEL;
        let config_jqIcon = getJqState(level, res.JQZTDM_NAME);
        let jqImg = {
          imgUrl: config_jqIcon.imgUrl,
          size: config_jqIcon.imgSize,
        };
        creatPointGraphics(map, testLocation, attributes, layer, jqImg, false);
        // }
        // else if (layer.id.includes("POS_POLICE")) {
        //   // 警力状态图标
        //   let config_layer = config_mapSourceData.filter(l =>
        //     layer.id.includes(l.params.DATA_TYPE)
        //   )[0];
        //   if (config_layer) {
        //     defaultImg = img;
        //     if (
        //       config_layer.mapIconSize &&
        //       config_layer.mapIconSize.length > 0
        //     ) {
        //       img = Object.assign(defaultImg, {
        //         size: config_layer.mapIconSize
        //       });
        //     }
        //     if (res.STATUS > 0 && res.STATUS < 5) {
        //       img = Object.assign(defaultImg, {
        //         imgUrl: config_layer[`status${res.STATUS}`]
        //       });
        //     }
        //   // img['imgUrl']= config_layer[`status${res.STATUS}`]
        //   }
        //   creatPointGraphics(
        //     map,
        //     testLocation,
        //     attributes,
        //     layer,
        //     img,
        //     true
        //   );
      } else {
        const checkIsOffline = (data,img) => {
          let imgUrl = {};
          if(data.IF_ONLINE && data.IF_ONLINE == '离线') {
            imgUrl = img.imgUrl_offline;
          }else{
            imgUrl = img.imgUrl;
          }
          return imgUrl;
        }
        creatPointGraphics(map, testLocation, attributes, layer, defaultImg, false, checkIsOffline);
      }
    }
  });
};

/**
 * 弹窗功能按钮
 * @param {Object} e //点击事件对象
 * @param {Object} graphic //点击的图形对象
 */
export const popupEvent = (e, graphic) => {
  let func = e.key;
  if (func == "bf") {
    // 播放    jia的！！！
    vm.$bus.$emit('mapModal_openLSSP', graphic.attributes)
  } else if (func == "sbjl") {
    // 人脸识别--识别历史
    vm.$bus.$emit("mapModal_openSBLS", graphic.attributes);
  } else if (func == "rlsb") {
    // 人脸识别--识别界面
    vm.$bus.$emit("mapModal_openRLSB");
  } else if (func == "gwcl") {
    // 过往车辆
    vm.$bus.$emit("mapModal_openGWCL", graphic.attributes);
  }else if (func == "sssp") {
    // 实时视频
    vm.$bus.$emit('mapModal_openLSSP', graphic.attributes);
  }else if (func == "cjxx") {
    // 采集信息
    vm.$bus.$emit('mapModal_openCJXX', graphic.attributes)
  }else if(func == 'gjhf') {
    // 轨迹回放
    store.commit('mapStatus/set_gjhf_status', 1)
    store.commit('mapStatus/set_gjhf_data', graphic.attributes)
  }else if(func == 'sbjl_spjgh'){
    // 识别记录--视频结构化
    vm.$bus.$emit('mapModal_openSBJL', graphic.attributes)
  }else if(func == 'ytsy_spjgh'){
    // 以图识图--视频结构化
    vm.$bus.$emit('mapModal_openSPJGH', graphic.attributes)
  }else if(func == 'check-more'){
    // 以图识图--视频结构化
    vm.$bus.$emit('mapModal_checkMore', graphic.attributes)
  }
};

export const setParams_yzt = (sourceType, params) => {
  return params
}

/**
 * 画图查询
 * @param {Array} searchList 搜索的资源列表
 * @param {String} type 画图类型
 * @param {Object} result 画图结果回调
 */
export const searchScope = (data = {}) => {
  let params;
  let hyMap = vm.$store.state.map.hyMap
  data.searchList.forEach((item) => {
    let exactJsonParam = { DATA_TYPE: item.params.DATA_TYPE };
    let image = {
      imgUrl: item.mapIconUrl,
      size: item.mapIconSize
    }
    params = {
      handlerType: item.params.handlerType,
      exactJsonParam: JSON.stringify(exactJsonParam),
    };
    if (data.type == "rect") {

      params.minX = data.result.minX
      params.minY = data.result.minY
      params.maxX = data.result.maxX
      params.maxY = data.result.maxY

      params = setParams_yzt(item.text, params);
      searchRect(params)
        .then((res) => {
          let data = res.data.data
          if (data && data.length > 0) {
            vm.$bus.$emit('sendResult_qxts', {
              type: item.text,
              data,
              layerConfig: item
            })
            resultCallback(res.data.data, image, item.params.DATA_TYPE)
          } else {
            vm.$Message.warning("暂无数据！");
          }
        })
        .catch((res) => {
          console.log(res);
          vm.$Message.warning("查询结果出错");
        });
    }else {
      params.locations = JSON.stringify(data.result.locations)
      params = setParams_yzt(item.text, params);
      searchPolygon(params)
        .then((res) => {
          let data = res.data.data
          if (data && data.length > 0) {
            vm.$bus.$emit('sendResult_qxts', {
              type: item.text,
              data,
              layerConfig: item
            })
            resultCallback(res.data.data, image, item.params.DATA_TYPE)
          } else {
            vm.$Message.warning("暂无数据！");
          }
        })
        .catch((res) => {
          console.log(res);
          vm.$Message.warning("查询结果出错！");
        });
    }
  });
  function resultCallback(data, img, layerName) {
    // 清除资源图层
    vm.$bus.$emit('clearResourceLayer')
    // 更新聚合图  待优化
    // this.gisInst.clusterLayer = mapUtil.addPointCluster(
    //   this.gisInst.map,
    //   res.data.data
    // );
    // 获取数据上图
    let layer = createMapLayer(hyMap, `zhszSearch-${layerName}`)
    // 添加点击事件
    dojo.connect(layer, "onClick", evt => {
      addClickHandler(evt, hyMap, popupEvent);
    });
    showIconInMap(
      hyMap,
      data,
      layer,
      img
    );
    // 数据传给右边的结果列表 待优化
    // vm.$bus.$emit("yzt_sourceList_KC", res.data.data);
  }
};

/**
 * 资源图层条件过滤
 * @param {Object} data 资源图层接口返回的数据
 * @param {Object} layerConfig 图层配置对象
 */
export const filterData = (data, layerConfig) => {
  let data1 = [...data];
  let filterListByType = [];
  layerConfig.filterList.filter(l=>l.default).forEach(r=>{
    let isExist = filterListByType.filter(p=>p.params_key == r.params_key)
    if(isExist.length > 0){
      isExist[0].value.push(r.value);
    }else{
      filterListByType.push({
        params_key:r.params_key,
        value : [r.value]
      })
    }
  });
  for(var i = 0; i < filterListByType.length; i++){
    let e = filterListByType[i];
    data1 = data1.filter(item => {
      return e.value.some(r=>
      {
        return item[e['params_key']] == r
      })
    })
  }
  return data1;  
}
export default {
  showIconInMap,
  popupEvent,
  searchScope,
  filterData
};
