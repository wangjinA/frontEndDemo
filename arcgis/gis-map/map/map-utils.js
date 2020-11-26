import Vue from 'vue'
// import {
//     ServiceUrl
// } from "../../libs/map/serviceUrl";
import Store from '../../store';
import {
    map_constant,
    config_mapSourceData
} from '@/config/config-mapResource'
import {
    getLineSymbol,
    getPolygonSymbol
} from './transfer-data'
import { createMapLayer } from './map-common'
import { $required } from '@/libs/util'
let mapUtil = {};

const theme = Store.state.user.theme;
// const serviceUrl = ServiceUrl;

// 历史轨迹定时器画图
let drawingID = null;
let isTimeContinue = true;
let sumLong_drawLines = 0;
let drawLinesLength = 0;
// 聚类图
var clusterLayer;
var isFirstGetData;
var isFirstSetJqCluster;
// 画图
let navDraw = null
let crptype = 1 //画图类型
let DrawBh = null
let mapConstant = map_constant
let configMapSourceData = config_mapSourceData
/**
 * 生成热力图
 * @param {Object} map 地图对象
 * @param {Array} data 数据
 */
mapUtil.addHeatMap = (map, data) => {
    let HeatmapRenderer = Store.state.map.esriModules["esri_renderers_HeatmapRenderer"];
    let SimpleMarkerSymbol = Store.state.map.esriModules["esri_symbols_SimpleMarkerSymbol"]
    if (HeatmapRenderer) {
        let heatMapLayer = {};
        // 处理数据
        let arrData = [];
        for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            if (obj.X && obj.Y) {
                var temp = {
                    data: JSON.parse(JSON.stringify(obj)),
                    X: obj.X, //经度
                    Y: obj.Y, //纬度 
                }
                arrData.push(temp);
            }
        }
        // 设置FeatureLayer参数
        var layerDefinition = {
            "geometryType": "esriGeometryPoint",
            "fields": [{
                "name": "heatMapLayer",
                "type": "esriFieldTypeInteger",
                "alias": "heatMapLayer"
            }]
        };
        var collect = {
            layerDefinition: layerDefinition,
            featureSet: null
        };

        heatMapLayer = new esri.layers.FeatureLayer(collect, {
            mode: esri.layers.FeatureLayer.MODE_SNAPSHOT
        });
        heatMapLayer.setOpacity(1);
        map.addLayer(heatMapLayer);
        // 热力图样式
        var heatmapRenderer = new HeatmapRenderer({
            colors: ["rgba(80,125,246,0)", "rgb(0,0,255)", "rgb(255,255,0)", "rgb(255,0,0)"],
            blurRadius: 10, // 10
            field: "count",
            maxPixelIntensity: 2000, // 500
            minPixelIntensity: 10
        });
        heatmapRenderer.setColorStops({
            colorStops: [{
                    ratio: 0,
                    color: "rgba(80,125,246,0)"
                },
                {
                    ratio: 0.2,
                    color: "rgba(0,0,255,0.8)"
                },
                {
                    ratio: 0.6,
                    color: "rgba(255,255,0,0.8)"
                },
                {
                    ratio: 0.9,
                    color: "rgba(255,0,0,0.8)"
                }
            ]
        });
        heatMapLayer.setRenderer(heatmapRenderer);
        // 上图
        heatMapLayer.clear();
        heatMapLayer.hide();
        for (var i = 0; i < arrData.length; i++) {
            var pointx = arrData[i].X == null ? "" : arrData[i].X;
            var pointy = arrData[i].Y == null ? "" : arrData[i].Y;
            var pt = new esri.geometry.Point(pointx, pointy, null);
            var obj = {
                X: pointx,
                Y: pointy,
                count: 15,
                ID: 5
            };
            var g = new esri.Graphic(pt, new SimpleMarkerSymbol(), obj, null);
            heatMapLayer.add(g);
        }
        if (arrData.length != 0) {
            heatMapLayer.show();
        }
        return heatMapLayer;
    }
}

/**
 * 轨迹回放
 * @param {Object} map 地图对象
 * @param {Array} data 数据
 * @param {Function} callback 完成回调
 */
mapUtil.traceTrack = params => {
    $required(['map', 'data'], params)
    const {map, data, callback} = params
    let startIconPath = params.startIconPath || require('@/assets/images/map/start.png');
    let endIconPath = params.endIconPath || require('@/assets/images/map/end.png');
    let zoom = params.zoom || 14;
    return new Promise((resolve, reject) => {
        let trackLayer = createMapLayer(map, 'trackLayer');
        trackLayer && trackLayer.clear()
        if (trackLayer) {
            // 改为参数传进来
            var attributes = new Object();
            var xNum = Number(data[0].X);
            var yNum = Number(data[0].Y);
            var x2 = Number(data[data.length - 1].X);
            var y2 = Number(data[data.length - 1].Y);
            var startGraphic = new esri.Graphic(new esri.geometry.Point(xNum, yNum), new esri.symbol.PictureMarkerSymbol(startIconPath, 30, 30), attributes);

            // 设置地图中心
            var point = new esri.geometry.Point(parseFloat(xNum), parseFloat(yNum));
            map.centerAndZoom(point, zoom);

            // 计算速度（总时间10秒）
            let interval = data.length > 10 ? 10000 / data.length : 500;
            setTimeout(function () {
                var endGraphic = new esri.Graphic(new esri.geometry.Point(x2, y2), new esri.symbol.PictureMarkerSymbol(endIconPath, 30, 30), attributes);
                trackLayer.add(startGraphic);
                trackLayer.add(endGraphic);
                var lines = new Array();
                for (var i = 0; i < data.length; i++) {
                    var arr = new Array();
                    arr.push(data[i].X);
                    arr.push(data[i].Y);
                    lines.push(arr);
                }
                drawLinesLength = lines.length;
                sumLong_drawLines = lines.length;
                isTimeContinue = true;
                if (drawingID) {
                    window.clearInterval(drawingID);
                }
                drawingID = window.setInterval(() => {
                    // mapUtil.drawLine(trackLayer, lines)
                    mapUtil.drawLine({
                        layer: trackLayer,
                        data,
                        lines: lines,
                        isError: params.isError,
                        callback
                    }).then(_=>{resolve(_)}).catch(reject)
                }, interval);
            }, 500);
        }
    })
}

/**
 * 地图画线
 */
mapUtil.drawLine = params => {
    $required(['layer', 'lines', 'data'], params)
    const {layer, lines, data, callback} = params
    return new Promise((resolve, reject) => {
        let drawLines = lines;
        var linesNode = [];
        if (isTimeContinue) {
            let startLength = sumLong_drawLines - drawLinesLength;
            var pointA = drawLines[startLength];
            var pointB = drawLines[startLength + 1];
            linesNode.push(pointA);
            linesNode.push(pointB);

            var attributes = new Object();
            dojo.require("esri.symbols.SimpleLineSymbol");
            var lineSymbol = new esri.symbols.SimpleLineSymbol({
                width: 3,
                style: "solid",
                color: theme == "dark" ? new esri.Color([5, 186, 226]) : new esri.Color([2, 104, 48, 0.9])
            });
            var _line = new esri.geometry.Polyline(linesNode);
            var drawGraphic = new esri.Graphic(_line, lineSymbol, attributes);
            layer.add(drawGraphic);
            linesNode = [];
            // 每次画完线，回调
            let pointArr = [data[startLength],data[startLength + 1]]
            callback && callback({
                flag:true,
                type:'step',
                data:pointArr,
                msg:'单次历史轨迹加载完'
            })

            drawLinesLength--;
            if (drawLinesLength <= 1)
                isTimeContinue = false;

        } else {
            if(drawLinesLength <= 1){
                window.clearInterval(drawingID);
                resolve({
                    flag: true,
                    type:'all',
                    msg: '历史轨迹加载完毕'
                    });
                Vue.prototype.$Message.success("历史轨迹加载完毕")
                console.log('历史轨迹加载完毕');
            }else { // 绘线过程中被手动关闭了
                if(params.isError){
                    reject({
                        flag: false,
                        msg: '关闭历史轨迹'
                    })
                }else {
                    resolve({
                        flag: false,
                        msg: '关闭历史轨迹'
                    });
                }
            }
        }
    })
}

/**
 * 历史轨迹-停止
 */
mapUtil.stopTraceTrack = params => {
    if($required(['map'], params)){
        const { map } = params
        if(drawingID){
            clearInterval(drawingID);
            let trackLayer = createMapLayer(map, 'trackLayer');
            trackLayer && trackLayer.clear()
        }
    }
}

/**
 * 轨迹回放暂停和关闭
 */
mapUtil.clearTraceTrack = params => {
    $required(['map'], params)
    isTimeContinue = false
    let layer = params.map.getLayer('trackLayer')
    layer && layer.clear()
}

/**
 * 生成聚类图
 * @param {Object} map 地图对象
 * @param {Array} data 数据
 */
mapUtil.addPointCluster = (map, data) => {
    let arrayUtils = dojo.require("dojo._base.array");
    let SpatialReference = dojo.require("esri.SpatialReference");
    let PopupTemplate = dojo.require("esri.dijit.PopupTemplate");
    let ClassBreaksRenderer = dojo.require("esri.renderers.ClassBreaksRenderer");
    let webMercatorUtils = dojo.require("esri.geometry.webMercatorUtils");
    // let ClusterLayer = dojo.require("ClusterLayer");

    let PictureMarkerSymbol = Store.state.map.esriModules["esri_symbols_PictureMarkerSymbol"];
    let SimpleMarkerSymbol = Store.state.map.esriModules["esri_symbols_SimpleMarkerSymbol"];
    let Color = Store.state.map.esriModules["esri_Color"];
    let ClusterLayer = Store.state.map.esriModules["ClusterLayer"];

    // 函数实现
    var photoInfo = {};
    var wgs = new SpatialReference({
        "wkid": 4326
    });

    // 处理空坐标
    let effectiveData = data.filter(res => {
        return res.X && res.Y
    })
    photoInfo.data = effectiveData.map(function (p) {
        if (p.X && p.Y) {
            var latlng = new esri.geometry.Point(Number(parseFloat(p.X)), Number(parseFloat(p.Y)), wgs);
            var webMercator = webMercatorUtils.geographicToWebMercator(latlng);
            // 经纬度（例："113.264780, 23.123900"）
            var attributes = {
                msg: "点位信息示例",
                data: p
            };
            // 处理attributes中的空数据为:"-",避免后续使用数据时遇到空数据报错
            // for (const key in attributes) {
            //     if (attributes.hasOwnProperty(key)) {
            //         const element = attributes[key];
            //         attributes[key] = handleNull(element);
            //     }
            // }
            return {
                "x": latlng.x,
                "y": latlng.y,
                "attributes": attributes
            };
        }
    });

    // 去掉无坐标值的数据
    // photoInfo.data = photoInfo.data.filter(item => item);

    // popupTemplate to work with attributes specific to this dataset
    var popupTemplate = new PopupTemplate({
        "title": "聚类图",
        "fieldInfos": [
            // {
            //     "fieldName": "msg",
            //     "label": "提示信息", //标题
            //     visible: true
            // }
        ]
    });

    
    // // 计算坐标系（还没调通，先用另外的方法）
    // let clusterResolution = null;
    // if(map.spatialReference.isWebMercator()){
    //     clusterResolution = map.extent.getWidth() / map.width
    // }else{
    //     // WGS 84坐标，转换为web Mercator
    //     let latlng_right_top = new esri.geometry.Point(map.extent.xmax, map.extent.ymax, map.spatialReference);// 右上角
    //     let latlng_left_bottom = new esri.geometry.Point(map.extent.xmin, map.extent.ymin, map.spatialReference);// 左下角
    //     let webMercator1 = webMercatorUtils.geographicToWebMercator(latlng_right_top);
    //     let webMercator2 = webMercatorUtils.geographicToWebMercator(latlng_left_bottom);
    //     clusterResolution = (webMercator1.x - webMercator2.x) / map.width;
    // }

    if (clusterLayer) {
        // 除了第一次后改变数据
        // 清空graphics
        clusterLayer.clear();
        // 重设数据
        clusterLayer._clusterData = photoInfo.data;
    } else {
        // 第一次初始化layer
        clusterLayer = new ClusterLayer({
            "data": photoInfo.data,
            "distance": 100,
            "id": "clusters" + Math.floor((Math.random() * 10) + 1),
            "labelColor": "#fff",
            "labelOffset": 10,
            "resolution": map.extent.getWidth() / map.width,
            "singleSymbol": new SimpleMarkerSymbol("circle", 6, null, new Color("#888")),
            "singleTemplate": popupTemplate,
            "webmap": false,
            "maxSingles": 100,
            "clickCallBack": e => {
                cluster_callBack(e, map)
            },
        });
    }

    var defaultSym = new SimpleMarkerSymbol().setSize(4);
    var renderer = new ClassBreaksRenderer(defaultSym, "clusterCount");
    // var green = new PictureMarkerSymbol(require('../../assets/images/map-view/pointCluster/3GreenPin1LargeB.png'), 32, 32).setOffset(0, 15);
    // var blue = new PictureMarkerSymbol(require('../../assets/images/map-view/pointCluster/2BluePin1LargeB.png'), 48, 48).setOffset(0, 15);
    // var yellow = new PictureMarkerSymbol(require('../../assets/images/map-view/pointCluster/4YellowPin1LargeB.png')", 56, 56).setOffset(0, 15);
    // var orange = new PictureMarkerSymbol(require('../../assets/images/map-view/pointCluster/5OrangePin1LargeB.png'), 60, 60).setOffset(0, 15);
    // var red = new PictureMarkerSymbol(require('../../assets/images/map-view/pointCluster/6RedPin1LargeB.png'), 72, 72).setOffset(0, 15);
    // var purple = new PictureMarkerSymbol(require('../../assets/images/map-view/pointCluster/1PurplePin1LargeB.png'), 84, 84).setOffset(0, 15);
    // renderer.addBreak(0, 10, green);
    // renderer.addBreak(11, 50, blue);
    // renderer.addBreak(20, 100, orange);
    // renderer.addBreak(51, 100, orange);
    // renderer.addBreak(101, 1000, red);
    // renderer.addBreak(1001, 200000, purple);

    clusterLayer.setRenderer(renderer);
    map.addLayer(clusterLayer);
    if (map.getZoom() > mapConstant.zoomLevel_between && map.getZoom() <= mapConstant.zoomLevel_max) {
        clusterLayer.hide();
    }
    clusterLayer.on("click", e => {
        // map.infoWindow.hide();
    });
    // close the info window when the map is clicked
    // map.on("click", e => {
    //     cleanUp(clusterLayer)
    // });
    // close the info window when esc is pressed
    map.on("key-down", function (e) {
        if (e.keyCode === 27) {
            mapUtil.cleanUp(clusterLayer);
        }
    });


    if (!isFirstGetData) {
        // 第一次加载散点图
        isFirstGetData = true;
    } else {
        // 更新图层数据点
        clusterLayer.updateData(map);
    }

    return clusterLayer;




}
// 清空聚类图
mapUtil.cleanUp = (clusterLayer) => {
    let map = Store.state.map.gisInst.map;
    map.infoWindow.hide();
    clusterLayer.clear();
}
// 处理空数据
const handleNull = (data) => {
    return data ? data : "-"
}
/**
 * 框查、圈查
 * @param {Object} map 地图对象
 * @param {Number} num 划线类型
 * @param {Object} dataCallback 数据处理回调
 */
mapUtil.drawSearchCheck = (map, num, dataCallback) => {
    return mapUtil.drawSearch(map, num, drawSearchEndCallback, dataCallback);
}
// 清除标绘搜索
mapUtil.clearDrawSearch = (map) => {
    if (map) {
        let drawLayer = map.getLayer("drawLayer")
        navDraw && navDraw.deactivate(); // 清除画笔
        drawLayer && drawLayer.clear(); // 清除绘画图层
        mapUtil.clearSearchResultLayer(map)
    }
}
// 清除绘画搜索结果
mapUtil.clearSearchResultLayer = map => {
    let layerIds = map.graphicsLayerIds.filter(layerId => /zhszSearch-*/.test(layerId))
    layerIds.forEach(layerId => {
        map.removeLayer(map.getLayer(layerId));
    });
}
/**
 * 画图
 * @param {Object} map 地图对象
 * @param {Number} num 划线类型
 * @param {Function} callback 画图结束的回调
 * @param {Object} dataCallback 数据处理回调
 */
mapUtil.drawSearch = (map, num, callback, dataCallback) => {
    let _thisLayer = createMapLayer(map, "drawLayer");
    // 先结束上一次标绘画笔
    navDraw && navDraw.deactivate();
    if (dojo) {
        dojo.require("esri.symbols.SimpleFillSymbol");
    } else {
        console.log("dojo is underfined");
    }

    navDraw = new esri.toolbars.Draw(map);
    navDraw.on("draw-end", evt => {
        callback(map, evt, _thisLayer, dataCallback)
    });
    // _thisLayer.clear();

    if (num == 1) {
        // 圆
        crptype = "1";
        navDraw.activate(esri.toolbars.Draw.CIRCLE);
        Vue.prototype.$Message.info("开始画圆")
    } else if (num == 2) {
        // 方形
        crptype = "2";
        navDraw.activate(esri.toolbars.Draw.EXTENT);
        Vue.prototype.$Message.info("开始画矩形")
    } else if (num == 3) {
        // 面（多边形）
        crptype = "3";
        navDraw.activate(esri.toolbars.Draw.POLYGON);
        console.log(navDraw);
        
        Vue.prototype.$Message.info("开始画多边形")
    } else if (num == 4) {
        // 线  回调函数内的evt.geometry.type = polyline
        crptype = "4";
        navDraw.activate(esri.toolbars.Draw.POLYLINE);
        Vue.prototype.$Message.info("开始画图")
    } else if (num == 5) {
        // 点  回调函数内的evt.geometry.type = point
        crptype = "5";
        navDraw.activate(esri.toolbars.Draw.POINT);
        Vue.prototype.$Message.info("开始画图")
    } else if (num == 6) {
        // 方形(跟2的不一样，存5个点的坐标，起点 + 途径的点（2） + 终点 + 起点)
        crptype = "6";
        navDraw.activate(esri.toolbars.Draw.RECTANGLE);
        Vue.prototype.$Message.info("开始画图")
    } else if (num == 7) {
        navDraw.deactivate();
    }
    return navDraw
}

/**
 * 画图后回调（框查）
 * @param {Object} map 地图对象
 * @param {Object} evt 点击对象
 * @param {Object} layer 展示的图层
 * @param {Object} dataCallback 数据处理回调
 */
const drawSearchEndCallback = (map, evt, layer, dataCallback) => {
    navDraw.deactivate();
    var jd;
    var wd;
    var bj;
    let params = null;
    switch (evt.geometry.type) {
        case "point":
            break;
        case "multipoint":
            break;
        case "polygon": //多边形，圆也是多边形 后台说圆查的不是很准确，就用多边形来查
            var rs = evt.geometry.rings[0]; //
            // 多边形
            if (crptype == "3") {
                var Xs = [];
                var Ys = [];
                for (var i = 0; i < rs.length; i++) {
                    var ring = rs[i];
                    Xs.push(ring[0]);
                    Ys.push(ring[1]);
                }
                params = {
                    handlerType: "poi",
                    locations: rs
                }
                dataCallback('polygon', params);
                // var symbol = new esri.symbols.SimpleFillSymbol(esri.symbols.SimpleFillSymbol.STYLE_SOLID,
                //     // 边线样式
                //     new esri.symbols.SimpleLineSymbol({
                //         width: 2,
                //         style: "solid",
                //         color: new esri.Color([255, 0, 0, 0.25])
                //     }),
                //     // 填充颜色
                //     new esri.Color([255, 255, 0, 0.25]));
                // let gg = new esri.Graphic(evt.geometry, symbol);
                // layer.add(gg);
            }
            //圆
            else {
                let geodesicUtils = Store.state.map.esriModules['esri_geometry_geodesicUtils'];
                let units = Store.state.map.esriModules['esri_units'];
                var rslen = rs.length - 1;
                var lonlat0 = rs[0];
                var lonlat1 = rs[rslen / 2];
                jd = (lonlat0[0] + lonlat1[0]) / 2;
                wd = (lonlat0[1] + lonlat1[1]) / 2;
                let area = geodesicUtils.geodesicAreas([evt.geometry], units.SQUARE_METERS)[0];
                bj = Math.sqrt(area / Math.PI);
                // bj = (lonlat0[0] - jd) * (lonlat0[0] - jd) + (lonlat0[1] - wd) * (lonlat0[1] - wd);
                // bj = Math.sqrt(bj);
                // console.log("圆心经度:" + jd + " 圆心纬度：" + wd + "半径：" + bj + "米");
                // params = {
                //     handlerType: "poi",
                //     centerX: jd,
                //     centerY: wd,
                //     radius: bj,
                // };
                // dataCallback('circle', params);
                params = {
                    handlerType: "poi",
                    locations: rs
                }
                dataCallback('polygon', params);
            }
            //画图
            dojo.require("esri.symbols.SimpleFillSymbol");
            dojo.require("esri.symbols.SimpleLineSymbol");
            var symbol = new esri.symbols.SimpleFillSymbol(esri.symbols.SimpleFillSymbol.STYLE_SOLID,
                new esri.symbols.SimpleLineSymbol(esri.symbols.SimpleLineSymbol.STYLE_SOLID, new esri.Color([255, 0, 0, 0.25]), 2),
                new esri.Color([255, 255, 0, 0.25]));
            var graphic = new esri.Graphic(evt.geometry, symbol);
            layer.add(graphic);
            layer.show();
            break;
            //方形、框查
        case "extent":
            dojo.require("esri.symbols.SimpleFillSymbol");
            dojo.require("esri.symbols.SimpleLineSymbol");
            params = {
                minX: evt.geometry.xmin,
                maxX: evt.geometry.xmax,
                minY: evt.geometry.ymin,
                maxY: evt.geometry.ymax
            }
            var symbol = new esri.symbols.SimpleFillSymbol(esri.symbols.SimpleFillSymbol.STYLE_SOLID,
                new esri.symbols.SimpleLineSymbol(esri.symbols.SimpleLineSymbol.STYLE_SOLID, new esri.Color([255, 0, 0, 1]), 2),
                new esri.Color([0, 0, 0, 0.15]));
            var graphic = new esri.Graphic(evt.geometry, symbol, {});
            layer.add(graphic);
            layer.show();
            // 查询
            dataCallback('rect', params)
            break;
        default:
    }

    map.setMapCursor("default");
    // 数据处理
}

/**
 * 测距
 * @param {Object} map 地图对象
 * @param {Number} num 测量的类型 4线长度，3多边形面积
 */
mapUtil.measureThis = (map, num) => {
    mapUtil.drawSearch(map, num, measuringCallback);
}
/**
 * 测距回调
 * @param {Object} map 地图对象
 * @param {Object} evt 点击对象
 * @param {Object} layer 展示的图层
 */
const measuringCallback = (map, evt, layer) => {
    navDraw.deactivate();
    let SimpleLineSymbol = Store.state.map.esriModules['esri_symbols_SimpleLineSymbol'];
    let SimpleFillSymbol = Store.state.map.esriModules['esri_symbols_SimpleFillSymbol'];
    let geodesicUtils = Store.state.map.esriModules['esri_geometry_geodesicUtils'];
    let units = Store.state.map.esriModules['esri_units'];
    let TextSymbol = Store.state.map.esriModules['esri_symbols_TextSymbol'];
    let Font = Store.state.map.esriModules['esri_symbols_Font'];
    if (evt.geometry.type == 'point' || evt.geometry.type == 'mutipoint') {} else if (evt.geometry.type == 'line' || evt.geometry.type == 'polyline') {
        // 上图
        var lineSymbol = new SimpleLineSymbol({
            width: 3,
            style: "solid",
            color: new esri.Color([2, 104, 48, 0.9])
        });
        let geodesicUtils = Store.state.map.esriModules['esri_geometry_geodesicUtils'];
        let gg = new esri.Graphic(evt.geometry, lineSymbol);
        layer.add(gg);

        // 计算长度
        let length = geodesicUtils.geodesicLengths([evt.geometry], units.METERS)[0];
        var myAttributes = {};
        var measureSymbol = new TextSymbol().setColor(new esri.Color("#000", 1)).setAlign(TextSymbol.ALIGN_START).setFont(new Font("14px").setWeight(TextSymbol.WEIGHT_BOLD));
        if (length < 3000) {
            measureSymbol.setText("长度为：" + length.toFixed(3) + "米");
        } else {
            measureSymbol.setText("长度为：" + parseFloat(length / 1000).toFixed(3) + "千米");
        }
    } else {
        // 上图
        var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
            // 边线样式
            new SimpleLineSymbol({
                width: 3,
                style: "solid",
                color: new esri.Color([2, 104, 48, 0.9])
            }),
            // 填充颜色
            new esri.Color([255, 255, 0, 0.25]));
        let gg = new esri.Graphic(evt.geometry, symbol);
        layer.add(gg);
        // 计算
        let area = geodesicUtils.geodesicAreas([evt.geometry], units.SQUARE_KILOMETERS)[0];
        var measureSymbol = new TextSymbol().setColor(new esri.Color("#000", 1)).setAlign(TextSymbol.ALIGN_START).setFont(new Font("14px").setWeight(TextSymbol.WEIGHT_BOLD));
        measureSymbol.setText("面积为：" + area.toFixed(3) + "平方公里");
    }

    // 获取中心点
    let centerPoint = evt.geometry.getExtent().getCenter();
    var ggg = new esri.Graphic(centerPoint, measureSymbol, myAttributes);
    layer.add(ggg);
}
/**
 * 清除坐标绘画
 */
mapUtil.clearScopeDarw = map => {
    let layer = map.getLayer('scopeDarwLayer')
    layer && layer.clear()
}
/**
 * @param scope 通过坐标绘画
 */
mapUtil.scopeDarw = (map, scope=[], attributes={}) => {
    /**
     * attributes: color：[数组]区域颜色；borderStyle：[对象]边框样式；zoomTo: [数组]居中
     */
    let SimpleFillSymbol = Store.state.map.esriModules['esri_symbols_SimpleFillSymbol'];
    let SimpleLineSymbol = Store.state.map.esriModules['esri_symbols_SimpleLineSymbol'];
    let layer = createMapLayer(map, "scopeDarwLayer")
    layer && layer.clear();
    // 上图
    let symbol =  new SimpleFillSymbol(
        SimpleFillSymbol.STYLE_SOLID,
        // 边线样式
        new SimpleLineSymbol({
            width: 3,
            style: "solid",
            color: new esri.Color([1, 170, 12, 0.2]),
            ...attributes.borderStyle
        }),
        // 填充颜色
        new esri.Color(attributes.color ? attributes.color : [1, 170, 12, 0.2]),
    )
    // 居中
    if(attributes.zoomTo){
        let point = new esri.geometry.Point(
            parseFloat(attributes.zoomTo[0]),
            parseFloat(attributes.zoomTo[1])
        );
        map.centerAt(point);
    }

    // 包含单面、多面处理
    scope.forEach(rings => {
        mapUtil.createPolygon(layer, rings, symbol, attributes);
        // 查数据上图
        let params = {
            handlerType: "poi",
            locations: rings[0]
        };
    })
    // } else {
    // // 单面
    // let rings = JSON.parse(this.currentUnitBorder.plotLocation);
    // mapUtil.createPolygon(layer, rings, symbol, attributes);
    // // 查数据上图
    // let params = {
    //     handlerType: "poi",
    //     locations: rings[0]
    // };
    // _this.goSearch("polygon", params);
    // }
}
// 清除标绘
mapUtil.clearDrawGraphic_bh = (map, layerName) => {
    let bhLayer = map.getLayer(layerName)
    bhLayer && bhLayer.clear(); // 清除标绘图层
    DrawBh && DrawBh.deactivate() // 清除标绘画笔
}
/**
 * 标绘
 * @param {Object} map 地图对象
 * @param {String} type 划线类型
 * @param {String} itemData 标绘属性, 相当于attribute
 * @param {String} page 哪个页面标绘， 对应标绘样式
 */
mapUtil.drawGraphic_bh = (map, type, itemData, callback, layerName, page) => {
    let _thisLayer = createMapLayer(map, layerName);
    if (dojo) {
        dojo.require("esri.symbols.SimpleFillSymbol");
    } else {
        console.log("dojo is underfined");
    }
    // 先结束上一次标绘画笔
    DrawBh && DrawBh.deactivate()

    DrawBh = new esri.toolbars.Draw(map);
    DrawBh.on("draw-end", evt => {
        // console.log(evt);
        console.log(evt.geometry.x +","+ evt.geometry.y);
        drawGraphic_bh_callback(map, evt, _thisLayer, type, itemData, callback, page)
    });

    if (type == "dot") {
        // 点
        DrawBh.activate(esri.toolbars.Draw.POINT);
        Vue.prototype.$Message.info({
            duration: 1.5,
            content: "开始画点"
        })
    } else if (type == "line") {
        // 线
        DrawBh.activate(esri.toolbars.Draw.POLYLINE);
        Vue.prototype.$Message.info({
            duration: 1.5,
            content: "开始画线"
        })
    } else if (type == "rect") {
        // 矩形
        DrawBh.activate(esri.toolbars.Draw.RECTANGLE);
        Vue.prototype.$Message.info({
            duration: 1.5,
            content: "开始画矩形"
        })
    } else if (type == "circle") {
        // 圆
        DrawBh.activate(esri.toolbars.Draw.CIRCLE);
        Vue.prototype.$Message.info({
            duration: 1.5,
            content: "开始画圆"
        })
    } else if (type == "arrow") {
        // 点  回调函数内的evt.geometry.type = point
        DrawBh.activate(esri.toolbars.Draw.ARROW);
        Vue.prototype.$Message.info({
            duration: 1.5,
            content: "开始画图"
        })
    } else if (type == "polygon") {
        // 点  回调函数内的evt.geometry.type = point
        DrawBh.activate(esri.toolbars.Draw.POLYGON);
        Vue.prototype.$Message.info({
            duration: 1.5,
            content: "开始画图"
        })
    } else {
        // 点位图标
        DrawBh.activate(esri.toolbars.Draw.POINT);
        Vue.prototype.$Message.info({
            duration: 1.5,
            content: "开始画图"
        })
    }
    return DrawBh;
}

/**
 * 标绘上图
 * @param {Object} map 地图对象
 * @param {Object} evt 点击对象
 * @param {Object} layer 展示的图层
 */
const drawGraphic_bh_callback = (map, evt, layer, type, itemData, callback, page) => {
    let SimpleFillSymbol = Store.state.map.esriModules['esri_symbols_SimpleFillSymbol'];
    let SimpleLineSymbol = Store.state.map.esriModules['esri_symbols_SimpleLineSymbol'];
    if (callback) callback(evt);
    if (evt.geometry.type == 'point' || evt.geometry.type == 'mutipoint') {
        if (type == "dot") {
            // 点位上图
            let pointImg = require("@/assets/images/map/marker_red_sprite.png")
            let symbol = new esri.symbol.PictureMarkerSymbol(pointImg, 39, 25);
            let pointGraphic = new esri.Graphic(evt.geometry, symbol, itemData);
            layer.add(pointGraphic);
        } else {
            // 图标上图
            debugger
            let pointImg = itemData.mapImgUrl;
            let json = itemData.json || {}
            // let symbol = new esri.symbol.PictureMarkerSymbol(pointImg, itemData.size[0], itemData.size[1]);
            let symbol = new esri.symbol.PictureMarkerSymbol({
                "url":pointImg,
                "width":itemData.size[0],
                "height":itemData.size[1],
                ...json
            });
            let pointGraphic = new esri.Graphic(evt.geometry, symbol, itemData);
            layer.add(pointGraphic);
        }
    } else if (evt.geometry.type == 'polyline') {
        // 线
        var lineSymbol = page ? getLineSymbol(page) : new esri.symbol.SimpleLineSymbol({
            width: 3,
            style: "solid",
            color: new esri.Color([2, 104, 48, 0.9])
        });
        let gg = new esri.Graphic(evt.geometry, lineSymbol, itemData);
        layer.add(gg);
    } else if (evt.geometry.type == 'polygon') {
        if (type === "rect" || type === "circle" || type === "arrow" || type === 'polygon') {
            if (type === 'polygon') {
                // 多边形判断是否自交
                let isIntersecting = mapUtil.isIntersecting(evt.geometry)
                if (isIntersecting) {
                    Vue.prototype.$Message.warning({
                        duration: 1.5,
                        content: "不能画自交图形"
                    })
                    DrawBh.deactivate();
                    return
                }
            }
            var symbol = page ? getPolygonSymbol(page) : new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                // 边线样式
                new SimpleLineSymbol({
                    width: 3,
                    style: "solid",
                    color: new esri.Color([2, 104, 48, 0.9])
                }),
                // 填充颜色
                new esri.Color([255, 255, 0, 0.25]));
            let gg = new esri.Graphic(evt.geometry, symbol, itemData);
            layer.add(gg);
        } else {

        }
    }
    DrawBh.deactivate();
}

// 判断图形是否自交
mapUtil.isIntersecting = geometry => {
    let singleRingPolygon = new esri.geometry.Polygon(geometry)
    return singleRingPolygon.isSelfIntersecting(singleRingPolygon);
}
// 添加标绘文本   
mapUtil.drawText_bh = (map, textSymbol, myAttributes, layer = 'bhLayer', callback) => {
    let _thisLayer = map.getLayer(layer);
    var toolbar = new esri.toolbars.Draw(map, {
        showTooltips: true
    });
    toolbar.activate(esri.toolbars.Draw.POINT);
    map.setMapCursor("crosshair");
    toolbar.on("draw-complete", function (evt) {
        var point = evt.geometry;
        let attributes = myAttributes
        let textSymbol = {
            text: "请双击编辑文字",
            color: {
                a: 1,
                r: 0,
                g: 0,
                b: 0
            }
        }
        textSymbol = new esri.symbol.TextSymbol({
            'text': textSymbol.text || 'Missing text',
            'color': textSymbol.color || '', //{a:1,r:255,g:255,b:255}
            // 'angle': textSymbol.angle || 0,
            // 'xoffset': textSymbol.xoffset || 0,
            // 'yoffset': textSymbol.yoffset || 0,
            // 'font': new esri.Font(
            //     textSymbol.fontSize || "12",
            //     esri.Font.STYLE_ITALIC,
            //     esri.Font.VARIANT_NORMAL,
            //     esri.Font.WEIGHT_BOLD,
            //     textSymbol.fontFamily || "Courier"
            // )
        });
        var graphic = esri.Graphic(point, textSymbol, attributes);
        _thisLayer.add(graphic);
        map.setMapCursor("default");
        toolbar.deactivate();
    });
}
// 初始化编辑工具
mapUtil.addEditToolbar = (map, layer = "bhLayer", callback, type) => {
    // 创建一个编辑工具
    let editToolbar = new esri.toolbars.Edit(map);
    //地图点击事件
    let mapClick = map.on("click", function (evt) {
        editToolbar.deactivate();
    });
    editToolbar.on("graphic-move-stop", evt => {
        //  移动停止回调
        editToolbar.deactivate();
        callback(evt, "graphic-move-stop")
    });
    editToolbar.on("rotate-stop", evt => {
        //  旋转停止回调
        callback(evt, "rotate-stop")
    })
    editToolbar.on("scale-stop", evt => {
        //  （旋转功能里）调整宽高停止回调
        callback(evt, "scale-stop")
    })
    editToolbar.on("vertex-move-stop", evt => {
        //  编辑停止回调
        callback(evt, "vertex-move-stop")
    })
    let _thisLayer = map.getLayer(layer);

    if (type == "wangGe") {
        createGraphicsMenu_WG(map, _thisLayer, editToolbar);
    } else if (type == "editZDDW") {
        createGraphicsMenu_ZDDW(map, _thisLayer, editToolbar);
    } else {
        createGraphicsMenu(map, _thisLayer, editToolbar);
    }
}

//编辑等右键菜单栏函数封装
const createGraphicsMenu = (map, _thisLayer, editToolbar) => {
    // Creates right-click context menu for GRAPHICS
    let selected = null;
    let ctxMenuForGraphics = new dijit.Menu({});
    ctxMenuForGraphics.addChild(new dijit.MenuItem({
        label: "编辑",
        onClick: function () {
            if (selected.geometry.type !== "point") {
                editToolbar.activate(esri.toolbars.Edit.EDIT_VERTICES, selected);
            } else {
                Vue.prototype.$Message.warning({
                    duration: 1.5,
                    content: "该图标不能编辑！"
                })
            }
        }
    }));

    ctxMenuForGraphics.addChild(new dijit.MenuItem({
        label: "移动",
        onClick: function () {
            editToolbar.activate(esri.toolbars.Edit.MOVE, selected);
        }
    }));

    ctxMenuForGraphics.addChild(new dijit.MenuItem({
        label: "旋转",
        onClick: function () {
            if (selected.geometry.type !== "point") {
                editToolbar.activate(esri.toolbars.Edit.ROTATE | esri.toolbars.Edit.SCALE, selected);
            } else {
                Vue.prototype.$Message.warning({
                    duration: 1.5,
                    content: "该图标不能旋转！"
                })
            }
        }
    }));

    // ctxMenuForGraphics.addChild(new dijit.MenuItem({
    //     label: "样式",
    //     onClick: function () {
    //         alert("Not implemented");
    //     }
    // }));

    ctxMenuForGraphics.addChild(new dijit.MenuSeparator());
    ctxMenuForGraphics.addChild(new dijit.MenuItem({
        label: "删除",
        onClick: function () {
            if (_thisLayer.id == "JW_ZDDW") {
                Vue.prototype.$Message.warning({
                    duration: 1.5,
                    content: "该图标不能删除！"
                })
            } else {
                _thisLayer.remove(selected);
            }
        }
    }));

    ctxMenuForGraphics.startup();
    //给每个graphics添加鼠标移入事件
    _thisLayer.on("mouse-over", function (evt) {
        //获取当前鼠标悬浮的graphic
        selected = evt.graphic;

        // Let's bind to the graphic underneath the mouse cursor
        ctxMenuForGraphics.bindDomNode(evt.graphic.getDojoShape().getNode());
    });
    //给每个graphics添加鼠标移出事件
    _thisLayer.on("mouse-out", function (evt) {
        ctxMenuForGraphics.unBindDomNode(evt.graphic.getDojoShape().getNode());
    });
}

//网格右键菜单
const createGraphicsMenu_WG = (map, _thisLayer, editToolbar) => {
    // Creates right-click context menu for GRAPHICS
    let selected = null;
    let ctxMenuForGraphics = new dijit.Menu({});
    ctxMenuForGraphics.addChild(new dijit.MenuItem({
        label: "边界修正",
        onClick: function () {
            if (selected.geometry.type !== "point") {
                Vue.prototype.$Message.info({
                    duration: 10,
                    content: "请拖拽进行边界修正，点击图形外确认或取消修改！"
                })
                editToolbar.activate(esri.toolbars.Edit.EDIT_VERTICES, selected);
            } else {
                Vue.prototype.$Message.warning({
                    duration: 1.5,
                    content: "不能编辑！"
                })
            }
        }
    }));


    ctxMenuForGraphics.startup();
    //给每个graphics添加鼠标移入事件
    _thisLayer.on("mouse-over", function (evt) {
        //获取当前鼠标悬浮的graphic
        selected = evt.graphic;

        // Let's bind to the graphic underneath the mouse cursor
        ctxMenuForGraphics.bindDomNode(evt.graphic.getDojoShape().getNode());
    });
    //给每个graphics添加鼠标移出事件
    _thisLayer.on("mouse-out", function (evt) {
        ctxMenuForGraphics.unBindDomNode(evt.graphic.getDojoShape().getNode());
    });
}

//重点单位右键菜单
const createGraphicsMenu_ZDDW = (map, _thisLayer, editToolbar) => {
    // Creates right-click context menu for GRAPHICS
    let selected = null;
    let ctxMenuForGraphics = new dijit.Menu({});
    ctxMenuForGraphics.addChild(new dijit.MenuItem({
        label: "位置修正",
        onClick: function () {
            Vue.prototype.$Message.info({
                duration: 1.5,
                content: "请移动图标进行位置修正"
            })
            editToolbar.activate(esri.toolbars.Edit.MOVE, selected);
        }
    }));


    ctxMenuForGraphics.startup();
    //给每个graphics添加鼠标移入事件
    _thisLayer.on("mouse-over", function (evt) {
        //获取当前鼠标悬浮的graphic
        selected = evt.graphic;

        // Let's bind to the graphic underneath the mouse cursor
        ctxMenuForGraphics.bindDomNode(evt.graphic.getDojoShape().getNode());
    });
    //给每个graphics添加鼠标移出事件
    _thisLayer.on("mouse-out", function (evt) {
        ctxMenuForGraphics.unBindDomNode(evt.graphic.getDojoShape().getNode());
    });
}

// 重大活动右键菜单
mapUtil.createGraphicsMenu_zdhd = (map, _thisLayer, callback) => {
    // Creates right-click context menu for GRAPHICS  
    let selected = null;
    let ctxMenuForGraphics = new dijit.Menu({})
    ctxMenuForGraphics.addChild(new dijit.MenuItem({
        label: "编辑属性",
        onClick: function () {
            callback(selected)
        }
    }))

    ctxMenuForGraphics.addChild(new dijit.MenuItem({
        label: "删除",
        onClick: function () {
            _thisLayer.remove(selected);
        }
    }));

    ctxMenuForGraphics.startup();

    //给每个graphics添加鼠标移入事件
    _thisLayer.on("mouse-over", function (evt) {
        //获取当前鼠标悬浮的graphic
        selected = evt.graphic;

        // Let's bind to the graphic underneath the mouse cursor
        ctxMenuForGraphics.bindDomNode(evt.graphic.getDojoShape().getNode());
    });
    //给每个graphics添加鼠标移出事件
    _thisLayer.on("mouse-out", function (evt) {
        ctxMenuForGraphics.unBindDomNode(evt.graphic.getDojoShape().getNode());
    });
}

mapUtil.createTextEdit = (map, _thisLayer) => {
    let editToolbar = new esri.toolbars.Edit(map, {
        textSymbolEditorHolder: document.getElementById("myEditor")
    });

    //给每个graphics添加鼠标移入事件
    _thisLayer.on("mouse-over", function (evt) {
        evt.stopPropagation();
        let attributes = evt.graphic.attributes
        if (attributes.type !== 'text') {
            return
        }
        editToolbar.activate(esri.toolbars.Edit.EDIT_TEXT, evt.graphic, {

        });
    });

    _thisLayer.on("mouse-out", function (e) {
        editToolbar.deactivate()
    });
    map.on("click", (e) => {
        editToolbar.deactivate()
    })
}

// 生成面
mapUtil.createPolygon = (layer, rings, symbol, attributes) => {
    if (dojo) {
        dojo.require("esri/geometry/Polygon")
    }
    let pg = new esri.geometry.Polygon(rings);
    let graphic = new esri.Graphic(pg, symbol, attributes);

    layer.add(graphic);
}

// 生成线
mapUtil.creatPolyLine = (layer, rings, symbol, attributes) => {
    var _line = new esri.geometry.Polyline(rings);
    var drawGraphic = new esri.Graphic(_line, symbol, attributes);
    layer.add(drawGraphic);
    return drawGraphic
}

// 添加文本-在自选图层中
mapUtil.drawText_inMyLayer = (map, textSymbol = {
    text: "Missing text",
    color: {
        a: 1,
        r: 0,
        g: 0,
        b: 0
    }
}, myAttributes, layer) => {
    let pointArr = JSON.parse(myAttributes.plotCentralPoint);
    let x = pointArr.x ? pointArr.x : pointArr[0];
    let y = pointArr.y ? pointArr.y : pointArr[1];
    let point = new esri.geometry.Point(x, y);
    let attributes = myAttributes
    textSymbol = new esri.symbol.TextSymbol({
        'text': textSymbol.text || 'Missing text',
        'color': textSymbol.color || {
            a: 1,
            r: 0,
            g: 0,
            b: 0
        }, //{a:1,r:255,g:255,b:255}
        // 'angle': textSymbol.angle || 0,
        // 'xoffset': textSymbol.xoffset || 0,
        // 'yoffset': textSymbol.yoffset || 0,
        // 'font': new esri.Font(
        //     textSymbol.fontSize || "12",
        //     esri.Font.STYLE_ITALIC,
        //     esri.Font.VARIANT_NORMAL,
        //     esri.Font.WEIGHT_BOLD,
        //     textSymbol.fontFamily || "Courier"
        // )
    });
    var graphic = esri.Graphic(point, textSymbol, attributes);
    layer.add(graphic);
}

// 生成缓冲区buffer(kilometers|meters)
mapUtil.doBuffer = (geometry, distance, unit, callback) => {
    var bufferedGeometries = Store.state.map.esriModules.esri_geometry_geometryEngine.geodesicBuffer(geometry, [distance], unit, true)
    callback && callback(bufferedGeometries)
    return bufferedGeometries
}

/**
 * 生成聚类图(置于指定图层)
 * @param {Object} map 地图对象
 * @param {Array} data 数据
 * @param {Array} layer 图层
 * @param {Array} imgArr 图标组
 */
mapUtil.addPointCluster_Layer = (map, data, layer,imgArr) => {
    let SpatialReference = dojo.require("esri.SpatialReference");
    let PopupTemplate = dojo.require("esri.dijit.PopupTemplate");
    let ClassBreaksRenderer = dojo.require("esri.renderers.ClassBreaksRenderer");
    let webMercatorUtils = dojo.require("esri.geometry.webMercatorUtils");
    // let ClusterLayer = dojo.require("extras.ClusterLayer");

    let PictureMarkerSymbol = Store.state.map.esriModules["esri_symbols_PictureMarkerSymbol"];
    let SimpleMarkerSymbol = Store.state.map.esriModules["esri_symbols_SimpleMarkerSymbol"];
    let Color = Store.state.map.esriModules["esri_Color"];
    let ClusterLayer = Store.state.map.esriModules["ClusterLayer"];



    let jqClusterslayer = layer || null;
    // 函数实现
    var photoInfo = {};
    var wgs = new SpatialReference({
        "wkid": 4326
    });

    // 处理空坐标
    let effectiveData = data.filter(res => {
        return res.X && res.Y
    })
    photoInfo.data = effectiveData.map(function (p) {
        if (p.X && p.Y) {
            var latlng = new esri.geometry.Point(Number(parseFloat(p.X)), Number(parseFloat(p.Y)), wgs);
            var webMercator = webMercatorUtils.geographicToWebMercator(latlng);
            // 经纬度（例："113.264780, 23.123900"）
            var attributes = {
                msg: "点位信息示例",
                data: p
            };
            // 处理attributes中的空数据为:"-",避免后续使用数据时遇到空数据报错
            // for (const key in attributes) {
            //     if (attributes.hasOwnProperty(key)) {
            //         const element = attributes[key];
            //         attributes[key] = handleNull(element);
            //     }
            // }
            return {
                "x": latlng.x,
                "y": latlng.y,
                "attributes": attributes
            };
        }
    });

    // 去掉无坐标值的数据
    // photoInfo.data = photoInfo.data.filter(item => item);

    // popupTemplate to work with attributes specific to this dataset
    var popupTemplate = new PopupTemplate({
        "title": "聚类图",
        "fieldInfos": [
            // {
            //     "fieldName": "msg",
            //     "label": "提示信息", //标题
            //     visible: true
            // }
        ]
    });

    let clusterResolution = null;

    // // 计算坐标系（还没调通，先用另外的方法）
    // if(map.spatialReference.isWebMercator()){
    //     clusterResolution = map.extent.getWidth() / map.width
    // }else{
    //     // WGS 84坐标，转换为web Mercator
    //     let latlng_right_top = new esri.geometry.Point(map.extent.xmax, map.extent.ymax, map.spatialReference);// 右上角
    //     let latlng_left_bottom = new esri.geometry.Point(map.extent.xmin, map.extent.ymin, map.spatialReference);// 左下角
    //     let webMercator1 = webMercatorUtils.geographicToWebMercator(latlng_right_top);
    //     let webMercator2 = webMercatorUtils.geographicToWebMercator(latlng_left_bottom);
    //     clusterResolution = (webMercator1.x - webMercator2.x) / map.width;
    // }
    let clusterId = data.length > 0 ? data[0].DATA_TYPE : "";
    if (jqClusterslayer) {
        // 除了第一次后改变数据
        // 清空graphics
        jqClusterslayer.clear();
        // 重设数据
        jqClusterslayer._clusterData = photoInfo.data;
    } else {
        // 第一次初始化layer
        jqClusterslayer = new ClusterLayer({
            "data": photoInfo.data,
            "distance": 100,
            "id": "clusters-" + clusterId,
            "labelColor": "#fff",
            "labelOffset": 8,
            "labelSize": 16,
            "labelFontFamily":"DIN-Medium",
            "clickCallBack": e => {
                cluster_callBack(e, map)
            },
            "resolution": map.extent.getWidth() / map.width,
            "singleSymbol": new SimpleMarkerSymbol("circle", 6, null, new Color("#888")),
            "singleTemplate": popupTemplate,
            "webmap": false,
            "maxSingles": 100,
        });
    }
    var defaultSym = new SimpleMarkerSymbol().setSize(4);
    var renderer = new ClassBreaksRenderer(defaultSym, "clusterCount");
    // var green = new PictureMarkerSymbol(require('../../assets/images/map-view/pointCluster/3GreenPin1LargeB.png'), 32, 32).setOffset(0, 15);
    // var blue = new PictureMarkerSymbol(require('../../assets/images/map-view/pointCluster/2BluePin1LargeB.png'), 48, 48).setOffset(0, 15);
    // var yellow = new PictureMarkerSymbol(require('../../assets/images/map-view/pointCluster/4YellowPin1LargeB.png')", 56, 56).setOffset(0, 15);
    // var orange = new PictureMarkerSymbol(require('../../assets/images/map-view/pointCluster/5OrangePin1LargeB.png'), 60, 60).setOffset(0, 15);
    // var red = new PictureMarkerSymbol(require('../../assets/images/map-view/pointCluster/6RedPin1LargeB.png'), 72, 72).setOffset(0, 15);
    // var purple = new PictureMarkerSymbol(require('../../assets/images/map-view/pointCluster/1PurplePin1LargeB.png'), 84, 84).setOffset(0, 15);
    // 设置单个上图图标
    if (data.length > 0) {
        if(imgArr.length == 1){
            // 不同数量范围 都用同一类图标时，按数字位数调整大小
            let imgData = imgArr[0];
            for(let i = 0; i < 6; i++){
                var icon_dataType = new PictureMarkerSymbol(imgData.imgUrl, imgData.size[0]*(1 + i * 0.3), imgData.size[1]*(1 + i * 0.3)).setOffset(0, 15);
                renderer.addBreak(i == 0 ? 0 : Math.pow(10, i), Math.pow(10, i + 1) - 1, icon_dataType);
            }
        }else{
            // 不同数量范围 不是用同一类图标时，图标推荐不同大小去适应数字的位数
            imgArr.forEach(i=>{
                var icon_dataType = new PictureMarkerSymbol(i.imgUrl, i.size[0], i.size[1]).setOffset(0, 15);
                renderer.addBreak(i.range[0], i.range[1], icon_dataType);
            })
        }
    }

    // renderer.addBreak(2, 50, blue);
    // renderer.addBreak(20, 100, orange);
    // renderer.addBreak(51, 100, orange);
    // renderer.addBreak(101, 1000, red);
    // renderer.addBreak(1001, 200000, purple);

    jqClusterslayer.setRenderer(renderer);
    map.addLayer(jqClusterslayer);
    if (map.getZoom() > mapConstant.zoomLevel_between && map.getZoom() <= mapConstant.zoomLevel_max) {
        jqClusterslayer.hide();
    } else {
        jqClusterslayer.show();
    }
    jqClusterslayer.on("click", e => {
        // map.infoWindow.hide();
    });
    // close the info window when the map is clicked
    // map.on("click", e => {
    //     cleanUp(clusterLayer)
    // });
    // close the info window when esc is pressed
    map.on("key-down", function (e) {
        if (e.keyCode === 27) {
            mapUtil.cleanUp(jqClusterslayer);
        }
    });
    if (!isFirstSetJqCluster) {
        // 第一次加载散点图
        isFirstSetJqCluster = true;
    } else {
        // 更新图层数据点
        jqClusterslayer.updateData(map);
    }
    return jqClusterslayer;
}
const cluster_callBack = (e, map) => {
    map.centerAndZoom(e.graphic.geometry, 17)
}

/**
 * 计算路线
 * @param {Object} map 地图对象
 * @param {Array} layer 图层
 * @param {Array} startdata 数据
 * @param {Array} endData 终点数据
 */
mapUtil.calRoute = (layer, startdata, endData) => {
    let startX = Number(startdata.X);
    let startY = Number(startdata.Y);
    let endX = Number(endData.X);
    let endY = Number(endData.Y);
    /* 改为参数传进来 */
    // let startIconPath = require('../../assets/images/map-view/start.png');
    // let endIconPath = require('../../assets/images/map-view/end.png');
    let startGraphic = new esri.Graphic(new esri.geometry.Point(startX, startY), new esri.symbol.PictureMarkerSymbol(startIconPath, 30, 30), {});
    let endGraphic = new esri.Graphic(new esri.geometry.Point(endX, endY), new esri.symbol.PictureMarkerSymbol(endIconPath, 30, 30), {});
    // Point the URL to a valid route service that uses an
    // ArcGIS Online hosted service proxy
    /* 改为参数传进来 */
    // let routeTask = new esri.tasks.RouteTask(serviceUrl.routeUrl);

    // Setup the route parameters
    let routeParams = new esri.tasks.RouteParameters();
    routeParams.stops =  new esri.tasks.FeatureSet();
    // Define the symbology used to display the route
    dojo.require("esri.symbols.SimpleLineSymbol");
    let routeSymbol = new esri.symbols.SimpleLineSymbol({
        width: 3,
        style: "solid",
        color: new esri.Color([0, 0, 255, 0.5])
    });
    let polylineObj = null;
    routeParams.stops.features.push(startGraphic);
    routeParams.stops.features.push(endGraphic);
    routeTask.solve(routeParams).then(data => {
        try {
            let routeResult = data.routeResults[0].route.geometry.paths[0];
            polylineObj = mapUtil.creatPolyLine(layer, routeResult, routeSymbol, {});
        } catch (error) {
            Vue.prototype.$Message.error("加载路径失败!")
        }
    });
    return polylineObj;
}

// 通用右键菜单
mapUtil.createGraphicsMenu_customs = (map, _thisLayer, callback) => {
    // Creates right-click context menu for GRAPHICS  
    let selected = null;
    let ctxMenuForGraphics = new dijit.Menu({})
    ctxMenuForGraphics.addChild(new dijit.MenuItem({
        label: "编辑属性",
        onClick: function () {
            callback(selected)
        }
    }))

    ctxMenuForGraphics.addChild(new dijit.MenuItem({
        label: "删除",
        onClick: function () {
            _thisLayer.remove(selected);
        }
    }));

    ctxMenuForGraphics.startup();

    //给每个graphics添加鼠标移入事件
    _thisLayer.on("mouse-over", function (evt) {
        //获取当前鼠标悬浮的graphic
        selected = evt.graphic;

        // Let's bind to the graphic underneath the mouse cursor
        ctxMenuForGraphics.bindDomNode(evt.graphic.getDojoShape().getNode());
    });
    //给每个graphics添加鼠标移出事件
    _thisLayer.on("mouse-out", function (evt) {
        ctxMenuForGraphics.unBindDomNode(evt.graphic.getDojoShape().getNode());
    });
}

export default mapUtil;