import Store from '../../store'
import router from "../../router";
import {
    config_mapSourceData,
    map_constant
} from '@/config/config-mapResource';
let mapConstant = map_constant;
let theme = Store.state.user.theme;
/**
 * 创建并添加图层
 * @param {Object} layerObj 图层
 * @param {String} layerId 图层id
 * @param {Number} reorderLayerCount 图层层级
 * @param {Number} layerOpacity 图层透明度
 * @param {Number} index 图层序列
 */
export const createMapLayer = (map, layerId, reorderLayerCount = 200, layerOpacity, index) => {
    let MyMap = map;
    // 没该图层就加，有就跳过
    let thisLayer = MyMap.getLayer(layerId);
    if(thisLayer){
        return thisLayer;
    }
    let layerObj1 = new esri.layers.GraphicsLayer({
        id: layerId,
        opacity: layerOpacity ? layerOpacity : 1
    });
    if (MyMap) {
        MyMap.addLayer(layerObj1, index);
    } else {
        console.log("MyMap 不存在 -- Function Name -- createMapLayer");
    }
    if(reorderLayerCount){
        MyMap.reorderLayer(layerId, reorderLayerCount);
    }
    return layerObj1;
}

/**
 * 创建一个graphics对象（点），并添加到图层上
 * @param {Array} coordinate 坐标
 * @param {Object} attributes 属性（包含点位数据）
 * @param {Object} layer 图层
 * @param {Object} icon 图标
 */
export const creatPointGraphics = (map, coordinate, attributes = {}, layer, icon, isCheckZoom = false,checkIsOffline) => {
    // 设置离线图标
    let newPointImg = icon.imgUrl;
    let size = icon.size;
    if(checkIsOffline){
        newPointImg = checkIsOffline(attributes, icon)
    }

    let point = new esri.geometry.Point(coordinate[0], coordinate[1]);
    let pmSybol = new esri.symbol.PictureMarkerSymbol(newPointImg, size[0], size[1]);
    let newPoint = new esri.Graphic(point, pmSybol, attributes);
    layer.add(newPoint);
    if (isCheckZoom) {
        if (map.getZoom() > mapConstant.zoomLevel_min && map.getZoom() <= mapConstant.zoomLevel_between) {
            layer.hide();
        }
    }
    return newPoint;
}

/**
 * 清空或清除图层对象
 * @param {Object} map 地图对象
 * @param {Object} layer 图层对象
 * @param {String} clearType 清除类型  remove从地图上清除图层，clear从图层上清除图形
 */
export const removeOrClearLayer = (map, layer, clearType = "remove") =>{
    if(clearType == "remove"){
        try {
            map.removeLayer(layer);
            return true;
        } catch (error) {
            return false;
        }
    }else{
        try {
            layer.clear();
            return true;
        } catch (error) {
            return false;
        }
    }
}

/**
 * 创建一个graphics对象（圆），并添加到图层上
 * @param {Array} coordinate 坐标
 * @param {Number} radius 半径（默认单位：米）
 * @param {Object} attributes 属性（包含点位数据）
 * @param {Object} layer 图层
 * @param {Object} lineStyle 圆样式
 */
export const creatCircleGraphics = (coordinate, radius, attributes = {}, layer, lineStyle = {
    width: 3,
    style: esri.symbol.SimpleLineSymbol.STYLE_DASH,
    color: new esri.Color([0, 0, 255, 1])
}) => {
    if (coordinate) coordinate = [parseFloat(coordinate[0]), parseFloat(coordinate[1])];
    // 圆样式
    var lineSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
        // 边线样式
        new esri.symbol.SimpleLineSymbol({
            "width": lineStyle.width,
            "style": lineStyle.style,
            "color": lineStyle.color
        }),
        // 填充颜色
        lineStyle.fillColor || new esri.Color([255, 255, 0, 0]));
    // var lineSymbol = new esri.symbol.SimpleLineSymbol(lineStyle.style,lineStyle.color,lineStyle.width);
    // 圆对象
    let circle = new esri.geometry.Circle(coordinate, {
        "radius": radius
    });
    /* 创建圆 */
    let newCircle = new esri.Graphic(circle, lineSymbol, attributes);
    layer.add(newCircle);
    return newCircle;
}

// 创建地图上的弹窗内容
export const createInfoWindowContent = (arrInfo, funcInfo) => {
    let popupContent = `width: 100%;height: 100%;position: relative;`;
    let popupContentInfo = `display:flex;`;
    let popupContentInfoLeft = `word-break:break-all;word-wrap:break-word;`
    let popupContentInfoItem = `display: flex;font-size:16px;`;
    let popupContentFunc = `display: flex;font-size: 16px;position: absolute;bottom: 0;flex-wrap:wrap;`;
    let popupContentFuncItem = `border: 1px solid #fff; text-align: center; cursor: pointer; border-radius: 13px; padding: 0 7px; min-width: 48px;margin-bottom:5px; margin-right: 5px;`;
    let popupContentFuncItemLastChild = `margin-right:0;`;
    let imageContentInfo = `height:200px;width:200px;`
    var htmlText = `
    <div style="${popupContent}">
        <div class="hy-windowInfo-info" style="${popupContentInfo}">
        <div class="windowInfo-left" style="${popupContentInfoLeft}">
    `.trim();
    // 文字
    let textInfo = arrInfo.filter(res => res.infoType == "text");
    for (var i = 0; i < textInfo.length; i++) {
        let aInfo = textInfo[i];
        htmlText += `<div style="${popupContentInfoItem}">${aInfo.label}：${aInfo.value}</div>`;
    }
    htmlText += `</div>`;
    // 图片
    let imageInfo = arrInfo.filter(res => res.infoType == "image");
    if (imageInfo.length > 0) {
        htmlText += `<div class="windowInfo-right">`;
        for (var k = 0; k < imageInfo.length; k++) {
            let bInfo = imageInfo[k];
            htmlText += `<img style="${imageContentInfo}" src="${bInfo.value}">`;
        }
        htmlText += `</div>`;
    }
    htmlText += `</div>`;
    // 按钮添加到弹窗
    if (funcInfo.length != 0) {
        htmlText += `<div class="hy-windowInfo-function" style="${popupContentFunc}">`;
        for (var j = 0; j < funcInfo.length - 1; j++) {
            let fInfo = funcInfo[j];
            htmlText += `<div id="func${j}" data-funcKey="${fInfo.key}" style="${popupContentFuncItem}">${fInfo.label}</div>`;
        }
        let lastIndex = funcInfo.length - 1;
        htmlText += `<div id="func${lastIndex}" style="${popupContentFuncItem}${popupContentFuncItemLastChild}">${funcInfo[lastIndex].label}</div>`;
    }
    htmlText += `</div></div>`;

    return htmlText;
}

/**
 * 创建一个弹窗对象
 * @param {Object} map 地图对象
 * @param {Object} msg 弹窗信息（标题，内容）
 * @param {Object} evt 图层
 * @param {Array} size 图标
 */
export const creatInfoWindow = (map, msg, graphic, evt, size = [297, 331], ) => {
    map.infoWindow.resize(size[0], size[1]);
    map.infoWindow.setTitle(msg.title);
    map.infoWindow.setContent(msg.info);
    if (graphic.geometry.type == 'point') {
        map.infoWindow.anchor = 'lower';
        map.infoWindow.show(graphic.geometry);
    } else {
        map.infoWindow.show(evt.screenPoint);
    }
    document.getElementsByClassName("esriPopupWrapper")[0].classList.add("mypop-content-animation");
    setTimeout(() => {
        document.getElementsByClassName("esriPopupWrapper")[0].classList.remove("mypop-content-animation");
    }, 600);
}

/**
 * 添加点击事件
 * @param {Object} x 点击事件对象（点击事件isEvt为true时） 或者 数据
 * @param {Object} map 地图
 * @param {Object} data 数据
 * @param {Function} callback 回调函数
 * @param {Function} callback_addClass 对样式操作的回调函数
 * @param {Function} graphicObj 图形对象
 */
export const addClickHandler = (evt, map, callback, callback_addClass, graphicObj) => {    let graphic = null;
    if(evt){
        graphic = evt.graphic;
    }else{
        graphic = graphicObj;
    }
    let pointData = graphic.attributes;
    let configInfo = config_mapSourceData.filter(res => res.params.DATA_TYPE == pointData.DATA_TYPE)[0];
    let information = [];
    let funcContent = [];
    if (callback_addClass) {
        callback_addClass("addStyle", pointData);
    }
    configInfo.infoList.forEach(res => {
        let value = pointData[res.dataBaseKey];
        if (res.dataBaseKey == "" || !value) value = "-"
        let temp = {
            label: res.title,
            value: value,
            infoType: res.infoType
        }
        information.push(temp);
    })
    configInfo.func.forEach(res => {
        let temp = {
            label: res.title,
            key: res.key
        }
        const others = res.key != 'tjzya' && res.key != 'cz' && res.key !="cjlx";
        const jq_cz = res.key == 'cz' && router.currentRoute.name == 'mapView';
        const sp_tjzya = res.key == 'tjzya' && router.currentRoute.name == 'zdhd';
        const jl_cjlx = res.key == 'cjlx' && router.currentRoute.name == 'yjzh';
        // 重大活动中显示添加至预案
        if (others || jq_cz || sp_tjzya || jl_cjlx) {
            funcContent.push(temp);
        }
    })
    let info = createInfoWindowContent(information, funcContent);
    let msg = {
        title: `<div>${pointData.DATA_TYPE_NAME}</div>`.trim(),
        info: info
    };
    // 更多按钮
    let arr = ["JW_RLSB"];
    if (arr.includes(configInfo.params.DATA_TYPE)) {
        let style = `margin-left: 5px;cursor: pointer;font-size:14px;text-decoration: underline;font-style: italic;color: #9ed9ff;position: absolute;right: 42px;`
        msg.title = `<div>${pointData.DATA_TYPE_NAME} <span id="more-btn" style="${style}" title="更多">更多</span></div>`.trim()
    }
    creatInfoWindow(map, msg, graphic, evt);
    if (parseFloat(graphic.geometry.x) && parseFloat(graphic.geometry.y)) {
        // 定位中心
        let point = new esri.geometry.Point(parseFloat(graphic.geometry.x), parseFloat(graphic.geometry.y));
        map.centerAt(point)
    }
    if (arr.includes(configInfo.params.DATA_TYPE)) {
        // 绑定标题右侧事件
        addSubtitleEvent(configInfo, graphic, callback);
    }
    // 绑定按钮事件
    for (let k = 0; k < funcContent.length; k++) {
        let e = funcContent[k];
        let btn = document.getElementById(`func${k}`);
        btn.addEventListener('click', () => {
            callback(e, graphic);
        })
    }
    // 点击关闭时解绑事件
    let closeBtn = document.getElementsByClassName(`titleButton close`)[0];
    closeBtn.addEventListener('click', () => {
        // 关闭
        for (let k = 0; k < funcContent.length; k++) {
            let e = funcContent[k];
            let btn = document.getElementById(`func${k}`);
            btn.removeEventListener('click', () => {
                console.log(e.label);
            })
        }
    })
    // 变换主题
    // changeTheme(Store.state.user.theme);
}

// 判断当前地图等级显示
export const currentDisplay = (map) => {

    if (map.getZoom() > mapConstant.zoomLevel_min && map.getZoom() <= mapConstant.zoomLevel_between) {
        // 10-15级
        return "cluster";
    } else if (map.getZoom() > mapConstant.zoomLevel_between && map.getZoom() <= mapConstant.zoomLevel_max) {
        // 15-20级
        return "source"
    }
}

// 根据geometry画图
export const createGraphics = (layer, geometry, symbol, attributes = {}) => {
    let graphic = new esri.Graphic(geometry, symbol, attributes);

    layer.add(graphic);
}

// 弹窗换肤
export const changeTheme = (currentTheme) => {
    let jqDom = document.getElementsByClassName('JQCASE');
    if (jqDom.length > 0) {
        let currentWidth = '';
        let jq_level1 = document.getElementsByClassName('esriPopupWrapper');
        if (jq_level1.length > 0) {
            // 变换位置
            if (currentTheme == 'dark') {
                jq_level1[0].classList.add("dark");
                currentWidth = '328px';
            } else {
                jq_level1[0].classList.remove("dark");
                currentWidth = '297px';
            }
            // 变换宽度
            for (let i = 0; i < jq_level1[0].childNodes.length; i++) {
                let e = jq_level1[0].childNodes[i];
                if (e.className.includes('sizer')) {
                    e.style.width = currentWidth;
                }
            }
        }
        // 标题下边线
        let header = document.getElementsByClassName('titlePane');
        let style_header = {
            dark: 'border-bottom:none',
            common: 'border-bottom:1px solid'
        }
        changeDomStyle(currentTheme, header, style_header);
        // 下边距
        let content = document.getElementsByClassName('contentPane');
        let style_content = {
            dark: 'padding:5px 20px 10px!important;max-height:256px;',
            common: 'padding:5px 20px 40px!important'
        }
        changeDomStyle(currentTheme, content, style_content);
        // 关闭按钮
        let close = document.getElementsByClassName('titleButton close');
        // 等图片
        // let image_close = require('../../assets/images/map-view/popup/red-close.png')
        let style_close = {
            dark: `background: url(${image_close}) no-repeat;width:15px;`,
            common: ''
        }
        changeDomStyle(currentTheme, close, style_close);
        // 功能区右对齐
        let functionArea = document.getElementsByClassName('hy-windowInfo-function');
        let style_functionArea = {
            dark: `right:0;`,
            common: ''
        }
        let action = {
            action: 'addOrdel',
            style: 'right'
        }
        changeDomStyle(currentTheme, functionArea, style_functionArea, action);
    }

    // 换图标
    // changeIcon(currentTheme);
}
const changeDomStyle = (currentTheme, dom, themeStyle, actionObj) => {
    if (dom.length > 0) {
        let oldStyle = dom[0].style.cssText;
        let newStyle = oldStyle;
        if (actionObj && actionObj.action == 'addOrdel') {
            if (themeStyle[currentTheme]) {
                // 增加
                newStyle = oldStyle + themeStyle[currentTheme]
            } else {
                // 删除
                newStyle = oldStyle.split(';').filter(r => r).filter(res => !res.includes(actionObj.style)).join(';');
            }
        } else {
            newStyle = themeStyle[currentTheme]
        }
        dom[0].setAttribute('style', newStyle);
    }
}
export const changeIcon = (theme) => {
    let gisInst = Store.state.map.gisInst;
    let handlingLayerList = [];
    if (router.currentRoute.name == 'yzt') {
        handlingLayerList = gisInst.sourceLayer;
    } else if (router.currentRoute.name == 'yjzh' || router.currentRoute.name == 'zdhd') {
        handlingLayerList = gisInst.jqDetailLayerList;
    }
    for (let i = 0; i < handlingLayerList.length; i++) {
        let e = gisInst.sourceLayer[i];
        let config_e = config_mapSourceData.filter(c => e.id.includes(c.params.DATA_TYPE));
        e.graphics.forEach(g => {
            if (theme == 'dark') {
                g.setUrl(config_e.mapIconUrl_dark);
            } else {
                g.setUrl(config_e.mapIconUrl);
            }
        })
    }
}

const addSubtitleEvent = (config, graphic, callback) => {
    let editBtn = document.getElementById(`more-btn`);
    editBtn.addEventListener('click', () => {
        callback({ label: "更多", key: 'check-more' }, graphic);
    })
}