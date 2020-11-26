import Store from '../../store'
export const getPlotLocation = (type, data) => {
    if (data.type == 'point') {
        return [data.x, data.y]
    } else if (data.type == 'polyline') {
        return data.paths
    } else if (data.type == 'polygon') {
        return data.rings
    } else {
        return [data.x, data.y]
    }
}

export const getGeometry = (type, plotLocation) => {
    if (typeof (plotLocation) == 'string') {
        plotLocation = JSON.parse(plotLocation)
    }
    if (type == 'dot') {
        return new esri.geometry.Point(plotLocation);
    } else if (type == 'line') {
        return new esri.geometry.Polyline(plotLocation)
    } else if (type == 'rect' || type == 'circle' || type == 'arrow' || type == 'polygon') {
        return new esri.geometry.Polygon(plotLocation)
    } else {
        return new esri.geometry.Point(plotLocation);
    }
}

// type 为 geometry.type
export const getSymbol = (type, itemData, page) => {
    let SimpleFillSymbol = Store.state.map.esriModules['esri_symbols_SimpleFillSymbol'];
    let SimpleLineSymbol = Store.state.map.esriModules['esri_symbols_SimpleLineSymbol'];
    let mySymbol = {}
    // dot， 文字 ， 点位都是point， 传个symbol
    if (type == 'point') {
        if (itemData.type == 'text') {
            mySymbol = new esri.symbol.TextSymbol({
                'text': itemData.text || '请双击编辑文字',
                'color': itemData.color || {
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
        } else {
            let pointImg = itemData.mapImgUrl
            mySymbol = new esri.symbol.PictureMarkerSymbol(pointImg, itemData.size[0], itemData.size[1]);
        }

    } else if (type == 'polyline') {
        // mySymbol = new esri.symbol.SimpleLineSymbol({
        //     width: 3,
        //     style: "solid",
        //     color: new esri.Color([2, 104, 48, 0.9])
        // });
        mySymbol = page ? getLineSymbol(page) : new esri.symbol.SimpleLineSymbol({
            width: 3,
            style: "solid",
            color: new esri.Color([2, 104, 48, 0.9])
        });
    } else if (type == 'polygon') {
        // mySymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
        //     // 边线样式
        //     new SimpleLineSymbol({
        //         width: 3,
        //         style: "solid",
        //         color: new esri.Color([2, 104, 48, 0.9])
        //     }),
        //     // 填充颜色
        //     new esri.Color([255, 255, 0, 0.25]));
        mySymbol = page ? getPolygonSymbol(page) : new esri.symbol.SimpleLineSymbol({
            width: 3,
            style: "solid",
            color: new esri.Color([2, 104, 48, 0.9])
        });
    } else {}
    return mySymbol
}

export const getFirstPoint = (data) => {
    if (data.type == 'point') {
        return [data.x, data.y]
    } else if (data.type == 'polyline') {
        return data.paths[0][0]
    } else if (data.type == 'polygon') {
        return data.rings[0][0]
    } else {
        return [data.x, data.y]
    }
}

// 获取buffer通用symbol
export const getBufferSymbol = () => {
    let SimpleFillSymbol = Store.state.map.esriModules['esri_symbols_SimpleFillSymbol'];
    let SimpleLineSymbol = Store.state.map.esriModules['esri_symbols_SimpleLineSymbol'];
    var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
        // 边线样式
        new SimpleLineSymbol({
            width: 3,
            style: "solid",
            color: new esri.Color([255, 0, 0, 0.65])
        }),
        // 填充颜色
        new esri.Color([255, 0, 0, 0.25]));
    return symbol
}

export const getLineSymbol = (page) => {
    if (page == 'zdhdDeploy') {
        return new esri.symbol.SimpleLineSymbol({
            width: 3,
            style: "solid",
            color: new esri.Color([2, 104, 48, 0.9])
        });
    } else if (page == 'zhdhSubtask') {
        return new esri.symbol.SimpleLineSymbol({
            width: 3,
            style: "solid",
            color: new esri.Color([255, 0, 0, 0.65])
        });
    } else {
        return new esri.symbol.SimpleLineSymbol({
            width: 3,
            style: "solid",
            color: new esri.Color([2, 104, 48, 0.9])
        });
    }
}

export const getPolygonSymbol = page => {
    let SimpleFillSymbol = Store.state.map.esriModules['esri_symbols_SimpleFillSymbol'];
    let SimpleLineSymbol = Store.state.map.esriModules['esri_symbols_SimpleLineSymbol'];
    if (page == 'zdhdDeploy') {
        return new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
            // 边线样式
            new SimpleLineSymbol({
                width: 3,
                style: "solid",
                color: new esri.Color([2, 104, 48, 0.9])
            }),
            // 填充颜色
            new esri.Color([255, 255, 0, 0.25]));
    } else if (page == 'zhdhSubtask') {
        return new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
            // 边线样式
            new SimpleLineSymbol({
                width: 3,
                style: "solid",
                color: new esri.Color([255, 0, 0, 0.65])
            }),
            // 填充颜色
            new esri.Color([255, 0, 0, 0.2]));
    } else {
        return new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
            // 边线样式
            new SimpleLineSymbol({
                width: 3,
                style: "solid",
                color: new esri.Color([2, 104, 48, 0.9])
            }),
            // 填充颜色
            new esri.Color([255, 255, 0, 0.25]));
    }
}