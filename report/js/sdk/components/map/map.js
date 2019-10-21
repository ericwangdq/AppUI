/**
 * Created by Eric on 9/29/2014.
 */
var Longitude = 113.642578,
    Latitude = 34.759666;

function en_map() {
    mapObj.setLang("en");
}

function zh_en_map() {
    mapObj.setLang("zh_en");
}

function zh_map() {
    mapObj.setLang("zh_en");
}

//添加点标记覆盖物，点的位置在地图上分布不均
function addOverlays() {
    mapObj.clearMap();
    //地图上添加三个点标记，作为参照
    //B01 2102BS01 上海 本公司仓库 上海市宝山区月罗路1888号 121.364872,31.41536
    var marker1 = new AMap.Marker({
        icon: "http://webapi.amap.com/images/1.png",
        position: new AMap.LngLat(121.364872, 31.41536),
        offset: new AMap.Pixel(-12, -36)
    });

    //W04 2013NJ01 江苏  南京捷顺达仓库 南京市浦口区浦泗路17号 118.675947,32.164388
    var marker2 = new AMap.Marker({
        icon: "http://webapi.amap.com/images/2.png",
        position: new AMap.LngLat(118.675947, 32.164388),
        offset: new AMap.Pixel(-12, -36)
    });

    //C04 2115EH02 湖北 武汉宝钢制罐 武汉市汉阳经济技术开发区江城大道545号 114.191937,30.480162
    var marker3 = new AMap.Marker({
        icon: "http://webapi.amap.com/images/3.png",
        position: new AMap.LngLat(114.191937, 30.480162),
        offset: new AMap.Pixel(-12, -36)
    });

    //W07 2123JN01 山东 青岛仓库 山东青岛市崂山区九水东路636号 120.52444,36.150992
    var marker4 = new AMap.Marker({
        icon: "http://webapi.amap.com/images/4.png",
        position: new AMap.LngLat(120.52444, 36.150992),
        offset: new AMap.Pixel(-12, -36)
    });

    //C03 2107FS02 广东 佛山宝钢制罐 佛山市顺德高新区（容桂）建业中路18号  113.338169,22.773145
    var marker5 = new AMap.Marker({
        icon: "http://webapi.amap.com/images/5.png",
        position: new AMap.LngLat(113.338169, 22.773145),
        offset: new AMap.Pixel(-12, -36)
    });
    marker1.setMap(mapObj);
    marker2.setMap(mapObj);
    marker3.setMap(mapObj);
    marker4.setMap(mapObj);
    marker5.setMap(mapObj);
}

//地图自适应显示函数
function setMapFitView() {
    var newCenter = mapObj.setFitView();//使地图自适应显示到合适的范围
}


//初始化地图对象，加载地图
function mapInit() {
    if(typeof (AMap) === "undefined") {
        LoadMapScript();
    }
    else
    {
        mapObj = new AMap.Map("map", {
            rotateEnable: true,
            dragEnable: true,
            zoomEnable: true,
            //二维地图显示视口
            view: new AMap.View2D({
                center: new AMap.LngLat(Longitude, Latitude),//地图中心点
                zoom: 3 //地图显示的缩放级别
            })
        });
        $.mobile.loading('hide');
        zh_en_map();
        addOverlays();
        setMapFitView();
    }
}

function LoadMapScript() {
    if(typeof (AMap) === "undefined"){
        $.mobile.loading('show');
        var mapScript = document.createElement("script");
        mapScript.type = "text/javascript";
        mapScript.async = true;
        mapScript.src = "js/sdk/components/map/map.js";
        document.getElementsByTagName('body')[0].appendChild(mapScript);

        var amapScript = document.createElement("script");
        amapScript.type = "text/javascript";
        amapScript.async = true;
        amapScript.src = "http://webapi.amap.com/maps?v=1.3&key=74407c1eb2eeb673ee97d3b1b0af5416&callback=mapInit";
        document.getElementsByTagName('body')[0].appendChild(amapScript);
    }
}