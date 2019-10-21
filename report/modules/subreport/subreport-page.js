/**
 * Created by Eric on 12/8/2014.
 */

define(['jquery','underscore', 'backbone',
        'utilities/session',
        'draw',
        'config/config',
        'utils',
        'pageUtils/pageUtils',
        'subreport/subreport-page/subreport-model',
        'subreport/subreport-page/subreport-collection',
        'text!subreport/subreport-page/subreport-page.html',
        'text!toolbar',
        'highcharts/highcharts',
        'css!subreport/common/css/subreport-page.css'],

    function($, _, Backbone,
             Session,
             Draw,
             Config,
             Utils,
             PageUtils,
             SubReportModel,
             SubReportCollection,
             SubReportPageTemplate,
             ToolbarHTML) {

        'use strict';

        var SubReportPage = Backbone.View.extend({

            model: null,
            template: _.template(SubReportPageTemplate + ToolbarHTML),
            company: null,
            companyCode: null,
            reportDate: null,
            mitOptions: null,
            mitAreaChart: null,
            rmOptions: null,
            rmAreaChart: null,
            fpOptions: null,
            fpAreaChart: null,
            sitOptions: null,
            sitAreaChart: null,
            wipOptions: null,
            wipAreaChart: null,
            isRefresh: false,
            subReportCollection: null,
            months: [],
            yearMonths: [],
            mitData: [],
            rmData: [],
            fpData: [],
            sitData: [],
            wipData: [],

            events: {
                'change #month-start': 'monthCompare',
                'change #month-end': 'monthCompare'
            },

            //用于创建el下的属性
            attributes: function() {
                return{
                    'data-role': 'page',
                    'class': 'layout no-footer',
                    'id': 'subreport-page',
                    'data-theme': 'metal'
                }
            },

            initialize: function() {
                var me = this;

            },

            urlParams: function(params){
                var me = this;
                if(me.companyCode == params[0] && me.reportDate == params[1])
                {
                    me.isRefresh = false;
                }else {
                    me.companyCode = params[0];
                    me.company = Config.getCompanyName(me.companyCode);
                    me.reportDate = params[1];
                    me.isRefresh = true;
                }
            },

            render: function(){
                var me = this;
                me.el.innerHTML = me.template();

                $(document).off("vclick", "#fp-area a.unit-ton");
                $(document).on("vclick", "#fp-area a.unit-ton", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    me.fpTonChange();
                });

                $(document).off("vclick", "#fp-area a.unit-wan");
                $(document).on("vclick", "#fp-area a.unit-wan", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    me.fpWanChange();
                });

                $(document).off("vclick", "#sit-area a.unit-ton");
                $(document).on("vclick", "#sit-area a.unit-ton", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    me.sitTonChange();
                });

                $(document).off("vclick", "#sit-area a.unit-wan");
                $(document).on("vclick", "#sit-area a.unit-wan", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    me.sitWanChange();
                });

                $(document).off("vclick", "#mit-area div.right-panel a.main-category");
                $(document).on("vclick", "#mit-area  div.right-panel a.main-category", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    window.location.href = "#page/maincategory/" + me.companyCode + "/" + Config.code.basicCategory.MIT +"/" + me.reportDate;
                });

                $(document).off("vclick", "#mit-area div.right-panel a.sub-category");
                $(document).on("vclick", "#mit-area  div.right-panel a.sub-category", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    window.location.href = "#page/subcategory/" + me.companyCode + "/" + Config.code.basicCategory.MIT +"/" + me.reportDate;
                });

                $(document).off("vclick", "#rm-area div.right-panel a.main-category");
                $(document).on("vclick", "#rm-area  div.right-panel a.main-category", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    window.location.href = "#page/maincategory/" + me.companyCode + "/" + Config.code.basicCategory.RM +"/" + me.reportDate;
                });

                $(document).off("vclick", "#rm-area div.right-panel a.sub-category");
                $(document).on("vclick", "#rm-area  div.right-panel a.sub-category", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    window.location.href = "#page/subcategory/" + me.companyCode + "/" + Config.code.basicCategory.RM +"/" + me.reportDate;
                });

                $(document).off("vclick", "#fp-area div.right-panel a.main-category");
                $(document).on("vclick", "#fp-area  div.right-panel a.main-category", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    window.location.href = "#page/maincategory/" + me.companyCode + "/" + Config.code.basicCategory.FP +"/" + me.reportDate;
                });

                $(document).off("vclick", "#fp-area div.right-panel a.sub-category");
                $(document).on("vclick", "#fp-area  div.right-panel a.sub-category", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    window.location.href = "#page/subcategory/" + me.companyCode + "/" + Config.code.basicCategory.FP +"/" + me.reportDate;
                });

                $(document).off("vclick", "#fp-area div.right-panel a.directional");
                $(document).on("vclick", "#fp-area  div.right-panel a.directional", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    window.location.href = "#page/directional/" + me.companyCode + "/" + Config.code.basicCategory.FP +"/" + me.reportDate;
                });

                $(document).off("vclick", "#sit-area div.right-panel a.main-category");
                $(document).on("vclick", "#sit-area  div.right-panel a.main-category", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    window.location.href = "#page/maincategory/" + me.companyCode + "/" + Config.code.basicCategory.SIT +"/" + me.reportDate;
                });

                $(document).off("vclick", "#sit-area div.right-panel a.sub-category");
                $(document).on("vclick", "#sit-area  div.right-panel a.sub-category", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    window.location.href = "#page/subcategory/" + me.companyCode + "/" + Config.code.basicCategory.SIT +"/" + me.reportDate;
                });

                $(document).off("vclick", "#wip-area div.right-panel a.main-category");
                $(document).on("vclick", "#wip-area  div.right-panel a.main-category", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    window.location.href = "#page/maincategory/" + me.companyCode + "/" + Config.code.basicCategory.WIP +"/" + me.reportDate;
                });

                $(document).off("vclick", "#wip-area div.right-panel a.sub-category");
                $(document).on("vclick", "#wip-area  div.right-panel a.sub-category", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    window.location.href = "#page/subcategory/" + me.companyCode + "/" + Config.code.basicCategory.WIP +"/" + me.reportDate;
                });

            },

            fillData: function(){
                var me = this;
                //todo hard code report data
                //me.reportDate = '2015-01-29';
                //me.reportDate = '2015-02-03';
                if(me.isRefresh) {
                    console.log("Sub report fillData: " + me.company + " " + me.reportDate);
                    me.subReportCollection = new SubReportCollection();
                    me.listenTo(me.subReportCollection, 'renderContent', me.renderContent);
                    me.listenTo(me.subReportCollection, 'error', me.error);
                    me.listenTo(me.subReportCollection, 'emptyData', me.emptyData);
                    me.subReportCollection.subReportData(me.companyCode, me.reportDate);
                }
            },

            renderCompleted: function(){
                var me = this;

                PageUtils.cleanMessage(me.$el.find("div.generic-wrapper.ui-content"));

                if(me.companyCode != null && me.companyCode != "")
                {
                    $("header.page-header .ui-title").text(me.company +'库存报表');
                    $("#fp-area div.left-panel a").removeClass("ui-btn-active");
                    $("#fp-area div.left-panel a.unit-ton").addClass("ui-btn-active");
                    if(me.companyCode == Config.code.company.BJBGYT ||
                       me.companyCode == Config.code.company.FSBGYT ||
                       me.companyCode == Config.code.company.SHBGYT ||
                       me.companyCode == Config.code.company.WHBGYT){
                        $("#fp-area div.left-panel a.unit-wan").text("万张");
                        $("div.chart-parent .left-panel").show();
                        $("#wip-cont").hide();
                    }else if(me.companyCode == Config.code.company.SHBYZG){
                        $("#fp-area div.left-panel a.unit-wan").text("万罐");
                        $("div.chart-parent .left-panel").show();
                        $("#wip-cont").hide();
                    }else if(me.companyCode == Config.code.company.SHBGXG){
                        $("div.chart-parent .left-panel").hide();
                        $("#wip-cont").show();
                    }
                    else{
                        $("div.chart-parent .left-panel").hide();
                        $("#wip-cont").hide();
                    }
                }

                //put the slide start and end
                $("div.ui-slider-track > a").eq(0).attr({"aria-valuenow": "0",
                    "aria-valuetext": "0", "title": "0"}).css("left","0%");
                $("div.ui-slider-track > a").eq(1).attr({"aria-valuenow": "12",
                    "aria-valuetext": "12", "title": "12"}).css("left","100%");
                
                $("#area-charts-wrapper").height($(window).height() - 245);

//                $(window).on("orientationchange", function(event) {
//                    //alert("This device is in " + event.orientation + " mode!" );
//                    $("#area-charts-wrapper").height($(window).height() - 260);
//                });

                Draw.start('blue',[]);
            },

            renderContent: function(){
                var me = this;
                //console.log("Sub report " + JSON.stringify(me.subReportCollection));

                var mitName = "", rmName = "", fpName = "", sitName = "", wipName = "";
                me.mitData = [];
                me.rmData = [];
                me.fpData = [];
                me.sitData = [];
                me.wipData = [];
                me.months = [];
                me.yearMonths = [];
                $.each(me.subReportCollection.toJSON(), function(index, category){
                    switch (category.categoryCode) {
                        case Config.code.basicCategory.MIT:
                            mitName = category.categoryName;
                            $.each(category.units.toJSON(), function (index, unit) {
                                if(unit.unitCode == Config.code.unit.Ton) {
                                    $.each(unit.months, function (index, month) {
                                        me.mitData.push(month.totalNumber);
                                        me.months.push(month.monthName);
                                        var yearMonth = Utils.toDate(month.month).Format("yyyy年MM月");
                                        me.yearMonths.push(yearMonth);
                                    });
                                }
                            });
                            break;
                        case Config.code.basicCategory.RM:
                            rmName = category.categoryName;
                            $.each(category.units.toJSON(), function (index, unit) {
                                if(unit.unitCode == Config.code.unit.Ton) {
                                    $.each(unit.months, function (index, month) {
                                        me.rmData.push(month.totalNumber);
                                    });
                                }
                            });
                            break;
                        case Config.code.basicCategory.FP:
                            fpName = category.categoryName;
                            $.each(category.units.toJSON(), function (index, unit) {
                                if(unit.unitCode == Config.code.unit.Ton) {
                                    $.each(unit.months, function (index, month) {
                                        me.fpData.push(month.totalNumber);
                                    });
                                }
                            });
                            break;
                        case Config.code.basicCategory.SIT:
                            sitName = category.categoryName;
                            $.each(category.units.toJSON(), function (index, unit) {
                                if(unit.unitCode == Config.code.unit.Ton) {
                                    $.each(unit.months, function (index, month) {
                                        me.sitData.push(month.totalNumber);
                                    });
                                }
                            });
                            break;
                        case Config.code.basicCategory.WIP:
                            wipName = category.categoryName;
                            $.each(category.units.toJSON(), function (index, unit) {
                                if(unit.unitCode == Config.code.unit.Ton) {
                                    $.each(unit.months, function (index, month) {
                                        me.wipData.push(month.totalNumber);
                                    });
                                }
                            });
                            break;
                    }
                });

                me.populateCompareData();
                var areaOptions = {
                    chart: {
                        type: 'area'
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: null,
                        style: {
                            color: '#000'
                        }
                    },
                    subtitle: {
                        text: null,
                        style: {
                            color: '#666666',
                            fontFamily: '微软雅黑',
                            fontSize: '13px'
                        }
                    },
                    xAxis: {
                        categories: me.months,
                        labels: {
                            style: {
                                color: '#000',
                                fontFamily: '微软雅黑',
                                fontSize: '12px',
                                fontStyle: 'normal'
                            },
//                            formatter: function() {
//                                return this.value + "月"; // clean, unformatted number for year
//                            },
                            enabled: false
                        },
                        tickWidth: 0,
                        lineWidth: 0,
                        gridLineWidth: 0
                    },
                    yAxis: {
                        title: {
                            text: null
                        },
                        labels: {
                            enabled: true,
//                            format: '{value} 吨',
                            formatter: function () {
                                return this.value/1000 + "千吨";
                            }
                        },
                        min: 0,
                        offset: -6,
                        opposite: false,
                        lineWidth: 0,
                        gridLineWidth: 0

                    },
                    labels: {
                        style: {
                            color: '#99b'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        valueSuffix: '吨'
                    },
                    plotOptions: {
                        area: {
                            marker: {
                                enabled: false,
                                symbol: 'circle',
                                radius: 2,
                                states: {
                                    hover: {
                                        enabled: true
                                    }
                                }
                            },
                            lineWidth: 1
//                            lineColor: '#000'
                        }
                    },
                    navigation: {
                        buttonOptions: {
                            theme: {
                                stroke: '#CCCCCC'
                            }
                        }
                    }
                };

                var formatter = function () {
                    return this.value/1000 + "千吨";
                };
                me.mitOptions= Utils.clone(areaOptions);
                var mitColor = Config.highchartsColor.basicCompanyReport.mit;
                me.mitOptions.colors = [mitColor];
                me.mitOptions.plotOptions.area.lineColor = mitColor;
                me.mitOptions.plotOptions.area.fillColor = { linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                    stops: [ [0, mitColor],
                        [1, Highcharts.Color(mitColor).setOpacity(0.1).get('rgba')] ] };
                me.mitOptions.plotOptions.area.marker.states.hover.fillColor = mitColor;
                me.mitOptions.chart.renderTo = 'mit-area-chart';
                me.mitOptions.series = [{
                    name: mitName,
                    data: me.mitData
                }];
                me.mitOptions.yAxis.labels.formatter = formatter;
                me.mitAreaChart = new Highcharts.Chart(me.mitOptions);

                me.rmOptions = Utils.clone(areaOptions);
                var rmColor = Config.highchartsColor.basicCompanyReport.rm;
                me.rmOptions.colors = [rmColor];
                me.rmOptions.plotOptions.area.lineColor = rmColor;
                me.rmOptions.plotOptions.area.fillColor={ linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                    stops: [ [0, rmColor],
                    [1,Highcharts.Color(rmColor).setOpacity(0.1).get('rgba')] ] };
                me.rmOptions.plotOptions.area.marker.states.hover.fillColor = rmColor;
                me.rmOptions.chart.renderTo = 'rm-area-chart';
                me.rmOptions.series = [{
                    name: rmName,
                    data: me.rmData
                }];
                me.rmOptions.yAxis.labels.formatter = formatter;
                me.rmAreaChart = new Highcharts.Chart(me.rmOptions);

                me.fpOptions = Utils.clone(areaOptions);
                var fpColor = Config.highchartsColor.basicCompanyReport.fp;
                me.fpOptions.colors = [fpColor];
                me.fpOptions.plotOptions.area.lineColor = fpColor;
                me.fpOptions.plotOptions.area.fillColor={ linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                    stops: [ [0, fpColor],
                    [1, Highcharts.Color(fpColor).setOpacity(0.1).get('rgba')] ] };
                me.fpOptions.plotOptions.area.marker.states.hover.fillColor = fpColor;
                me.fpOptions.chart.renderTo = 'fp-area-chart';
                me.fpOptions.series = [{
                    name: fpName,
                    data: me.fpData
                }];
                me.fpOptions.yAxis.labels.formatter = formatter;
                me.fpAreaChart = new Highcharts.Chart(me.fpOptions);

                me.sitOptions = Utils.clone(areaOptions);
                var sitColor = Config.highchartsColor.basicCompanyReport.sit;
                me.sitOptions.colors = [sitColor];
                me.sitOptions.plotOptions.area.lineColor = sitColor;
                me.sitOptions.plotOptions.area.fillColor={ linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                    stops: [
                        [0, sitColor],
                        [1,Highcharts.Color(sitColor).setOpacity(0.1).get('rgba')]
                    ] };
                me.sitOptions.plotOptions.area.marker.states.hover.fillColor = sitColor;
                me.sitOptions.chart.renderTo = 'sit-area-chart';
                me.sitOptions.series = [{
                    name: sitName,
                    data: me.sitData
                }];
                me.sitOptions.yAxis.labels.formatter = formatter;
                me.sitAreaChart = new Highcharts.Chart(me.sitOptions);

                if(me.companyCode == Config.code.company.SHBGXG) {
                    //$("#wip-area-chart").width($(window).width());
                    me.wipOptions = Utils.clone(areaOptions);
                    var wipColor = Config.highchartsColor.basicCompanyReport.wip;
                    me.wipOptions.colors = [wipColor];
                    me.wipOptions.plotOptions.area.lineColor = wipColor;
                    me.wipOptions.plotOptions.area.fillColor = { linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                        stops: [
                            [0, wipColor],
                            [1, Highcharts.Color(wipColor).setOpacity(0.1).get('rgba')]
                        ] };
                    me.wipOptions.plotOptions.area.marker.states.hover.fillColor = wipColor;
                    me.wipOptions.xAxis = {
                        categories: me.months,
                        labels: {
                            style: {
                                color: '#666',
                                fontFamily: '微软雅黑',
                                fontSize: '12px',
                                fontStyle: 'normal'
                            },
                            useHTML: true,
                            formatter: function () {
                                var month = this.value.replace("月","");
                                return month + "<br/>月"; // month
                            },
                            enabled: true
                        },
                        tickWidth: 0,
                        lineWidth: 0,
                        gridLineWidth: 0
                    };
                    me.wipOptions.chart.renderTo = 'wip-area-chart';
                    me.wipOptions.series = [
                        {
                            name: wipName,
                            data: me.wipData
                        }
                    ];
                    me.wipOptions.yAxis.labels.formatter = formatter;
                    me.wipAreaChart = new Highcharts.Chart(me.wipOptions);
                }
            },

            refresh:function(){
                var me = this;
                me.subReportCollection.subReportData(me.companyCode, me.reportDate);
            },

            error: function(message){
                var me = this;
                PageUtils.refresh(me.$el.find("div.generic-wrapper.ui-content"), me, "数据加载失败，" + message);
            },

            emptyData: function(){
                var me = this;
                PageUtils.message(me.$el.find("div.generic-wrapper.ui-content"), Config.emptyData);
            },

            monthCompare: function(){
                var me = this;
                var start = $("#month-start").val();
                var end = $("#month-end").val();

                $("#picker-start").text(me.yearMonths[start]);
                $("#picker-end").text(me.yearMonths[end]);

                $("#inventory-mit").removeClass("up down");
                if(me.mitData[start] == 0)
                {
                    $("#inventory-mit").text(Config.NA);
                }
                else{
                    var percentage = (((me.mitData[end] - me.mitData[start])/me.mitData[start]) * 100);
                    percentage > 0 ? $("#inventory-mit").addClass("up"): $("#inventory-mit").addClass("down");
                    percentage = Math.abs(percentage);
                    percentage = Math.round(percentage * 10)/10 + "%";
                    $("#inventory-mit").text(percentage);
                }

                $("#inventory-rm").removeClass("up down");
                if(me.rmData[start] == 0)
                {
                    $("#inventory-rm").text(Config.NA);
                }
                else{
                    var percentage = (((me.rmData[end] - me.rmData[start])/me.rmData[start]) * 100);
                    percentage > 0 ? $("#inventory-rm").addClass("up"): $("#inventory-rm").addClass("down");
                    percentage = Math.abs(percentage);
                    percentage = Math.round(percentage * 10)/10 + "%";
                    $("#inventory-rm").text(percentage);
                }

                $("#inventory-fp").removeClass("up down");
                if(me.fpData[start] == 0)
                {
                    $("#inventory-fp").text(Config.NA);
                }
                else{
                    var percentage = (((me.fpData[end] - me.fpData[start])/me.fpData[start]) * 100);
                    percentage > 0 ? $("#inventory-fp").addClass("up"): $("#inventory-fp").addClass("down");
                    percentage = Math.abs(percentage);
                    percentage = Math.round(percentage * 10)/10 + "%";
                    $("#inventory-fp").text(percentage);
                }

                $("#inventory-sit").removeClass("up down");
                if(me.sitData[start] == 0)
                {
                    $("#inventory-sit").text(Config.NA);
                }
                else{
                    var percentage = (((me.sitData[end] - me.sitData[start])/me.sitData[start]) * 100);
                    percentage > 0 ? $("#inventory-sit").addClass("up"): $("#inventory-sit").addClass("down");
                    percentage = Math.abs(percentage);
                    percentage = Math.round(percentage * 10)/10 + "%";
                    $("#inventory-sit").text(percentage);
                }
            },

            fpTonChange: function(){
                var me = this;
                if(!$("#fp-area div.left-panel a.unit-ton").hasClass("ui-btn-active")) {
                    $("#fp-area div.left-panel a").removeClass("ui-btn-active");
                    $("#fp-area div.left-panel a.unit-ton").addClass("ui-btn-active");

                    var fpName ="", fpData=[];
                    $.each(me.subReportCollection.toJSON(), function(index, category){
                        switch (category.categoryCode) {
                            case Config.code.basicCategory.FP:
                                fpName = category.categoryName;
                                $.each(category.units.toJSON(), function (index, unit) {
                                    if(unit.unitCode == Config.code.unit.Ton) {
                                        $.each(unit.months, function (index, month) {
                                            fpData.push(month.totalNumber);
                                        });
                                    }
                                });
                                break;
                        }
                    });
                    me.fpOptions.series = [{
                        name: fpName,
                        data: fpData
                    }];
                    me.fpOptions.yAxis.labels.formatter = function () {
                        return this.value/1000 + "千吨";
                    };
                    me.fpOptions.tooltip.valueSuffix = "吨";
                    me.fpAreaChart = new Highcharts.Chart(me.fpOptions);
                }

            },

            fpWanChange: function(){
                var me = this;
                if(!$("#fp-area div.left-panel a.unit-wan").hasClass("ui-btn-active")) {
                    $("#fp-area div.left-panel a").removeClass("ui-btn-active");
                    $("#fp-area div.left-panel a.unit-wan").addClass("ui-btn-active");

                    var unitName = "";
                    var fpName ="", fpData=[];

                    if(me.companyCode == Config.code.company.SHBYZG){
                        unitName = Config.code.unit.A;
                        me.fpOptions.tooltip.valueSuffix = "万罐";
                        me.fpOptions.yAxis.labels.formatter = function () {
                            return this.value + "万罐";
                        };
                    }else {
                        unitName = Config.code.unit.Piece;
                        me.fpOptions.tooltip.valueSuffix = "万张";
                        me.fpOptions.yAxis.labels.formatter = function () {
                            return this.value + "万张";
                        };
                    }

                    $.each(me.subReportCollection.toJSON(), function(index, category){
                        switch (category.categoryCode) {
                            case Config.code.basicCategory.FP:
                                fpName = category.categoryName;
                                $.each(category.units.toJSON(), function (index, unit) {
                                    if(unit.unitCode == unitName) {
                                        $.each(unit.months, function (index, month) {
                                            fpData.push(Math.round(month.totalNumber/10000));
                                        });
                                    }
                                });
                                break;
                        }
                    });

                    me.fpOptions.series = [{
                        name: fpName,
                        data: fpData
                    }];

                    me.fpAreaChart = new Highcharts.Chart(me.fpOptions);
                }
            },

            sitTonChange: function(){
                var me = this;
                if(!$("#sit-area div.left-panel a.unit-ton").hasClass("ui-btn-active")) {
                    $("#sit-area div.left-panel a").removeClass("ui-btn-active");
                    $("#sit-area div.left-panel a.unit-ton").addClass("ui-btn-active");

                    var sitName ="", sitData=[];
                    $.each(me.subReportCollection.toJSON(), function(index, category){
                        switch (category.categoryCode) {
                            case Config.code.basicCategory.SIT:
                                sitName = category.categoryName;
                                $.each(category.units.toJSON(), function (index, unit) {
                                    if(unit.unitCode == Config.code.unit.Ton) {
                                        $.each(unit.months, function (index, month) {
                                            sitData.push(month.totalNumber);
                                        });
                                    }
                                });
                                break;
                        }
                    });
                    me.sitOptions.series = [{
                        name: sitName,
                        data: sitData
                    }];
                    me.sitAreaChart = new Highcharts.Chart(me.sitOptions);
                }

            },

            sitWanChange: function(){
                var me = this;
                if(!$("#sit-area div.left-panel a.unit-wan").hasClass("ui-btn-active")) {
                    $("#sit-area div.left-panel a").removeClass("ui-btn-active");
                    $("#sit-area div.left-panel a.unit-wan").addClass("ui-btn-active");

                    var sitName ="", sitData=[];
                    $.each(me.subReportCollection.toJSON(), function(index, category){
                        switch (category.categoryCode) {
                            case Config.code.basicCategory.SIT:
                                sitName = category.categoryName;
                                $.each(category.units.toJSON(), function (index, unit) {
                                    if(unit.unitCode == Config.code.unit.A) {
                                        $.each(unit.months, function (index, month) {
                                            sitData.push(month.totalNumber/10000);
                                        });
                                    }
                                });
                                break;
                        }
                    });
                    me.sitOptions.series = [{
                        name: sitName,
                        data: sitData
                    }];
                    me.sitAreaChart = new Highcharts.Chart(me.sitOptions);
                }

            },

            populateCompareData: function(){
                var me = this;
                $("#months > ul").empty();
                $.each(me.months, function(index, month){
                    var monthNum = month.replace('月','');
                    var targetId = index + 1;
                    $("#months > ul").append("<li><span id=\"target" + targetId + "\">"
                        + monthNum + "</span>月</li>");
                });

                $("#picker-start").text(me.yearMonths[0]);
                $("#picker-end").text(me.yearMonths[12]);


                $("#inventory-mit").removeClass("up down");
                if(me.mitData[0] == 0)
                {
                    $("#inventory-mit").text(Config.NA);
                }
                else{
                    var percentage = (((me.mitData[12] - me.mitData[0])/me.mitData[0]) * 100);
                    percentage > 0 ? $("#inventory-mit").addClass("up"): $("#inventory-mit").addClass("down");
                    percentage = Math.abs(percentage);
                    percentage = Math.round(percentage * 10)/10 + "%";
                    $("#inventory-mit").text(percentage);
                }

                $("#inventory-rm").removeClass("up down");
                if(me.rmData[0] == 0)
                {
                    $("#inventory-rm").text(Config.NA);
                }
                else{
                    var percentage = (((me.rmData[12] - me.rmData[0])/me.rmData[0]) * 100);
                    percentage > 0 ? $("#inventory-rm").addClass("up"): $("#inventory-rm").addClass("down");
                    percentage = Math.abs(percentage);
                    percentage = Math.round(percentage * 10)/10 + "%";
                    $("#inventory-rm").text(percentage);
                }

                $("#inventory-fp").removeClass("up down");
                if(me.fpData[0] == 0)
                {
                    $("#inventory-fp").text(Config.NA);
                }
                else{
                    var percentage = (((me.fpData[12] - me.fpData[0])/me.fpData[0]) * 100);
                    percentage > 0 ? $("#inventory-fp").addClass("up"): $("#inventory-fp").addClass("down");
                    percentage = Math.abs(percentage);
                    percentage = Math.round(percentage * 10)/10 + "%";
                    $("#inventory-fp").text(percentage);
                }

                $("#inventory-sit").removeClass("up down");
                if(me.sitData[0] == 0)
                {
                    $("#inventory-sit").text(Config.NA);
                }
                else{
                    var percentage = (((me.sitData[12] - me.sitData[0])/me.sitData[0]) * 100);
                    percentage > 0 ? $("#inventory-sit").addClass("up"): $("#inventory-sit").addClass("down");
                    percentage = Math.abs(percentage);
                    percentage = Math.round(percentage * 10)/10 + "%";
                    $("#inventory-sit").text(percentage);
                }

            }
        });

        return SubReportPage;
    });

