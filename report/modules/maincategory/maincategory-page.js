/**
 * Created by Eric on 12/22/2014.
 */

define(['jquery','underscore', 'backbone',
        'utilities/session',
        'draw',
        'config/config',
        'utils',
        'pageUtils/pageUtils',
        'maincategory/maincategory-page/maincategory-model',
        'maincategory/maincategory-page/maincategory-collection',
        'text!maincategory/maincategory-page/maincategory-page.html',
        'text!toolbar',
        'highcharts/highcharts',
        'css!maincategory/common/css/maincategory-page.css'],

    function($, _, Backbone,
             Session,
             Draw,
             Config,
             Utils,
             PageUtils,
             MainCategoryModel,
             MainCategoryCollection,
             MainCategoryPageTemplate,
             ToolbarHTML) {

        'use strict';

        var MainCategoryPage = Backbone.View.extend({

            model: null,

            template: _.template(MainCategoryPageTemplate + ToolbarHTML),

            companyCode: null,

            company: null,

            categoryCode: null,

            category: null,

            reportDate: null,

            mainCategoryCollection: null,

            mitData: [],

            rmData: [],

            fpData: [],

            sitData: [],

            wipData: [],

            mitCategories : [],

            rmCategories : [],

            fpCategories : [],

            sitCategories : [],

            wipCategories : [],

            //用于创建el下的属性
            attributes: function() {
                return{
                    'data-role': 'page',
                    'class': 'layout no-footer',
                    'id': 'maincategory-page',
                    'data-theme': 'metal'
                }
            },

            initialize: function() {
                var me = this;

            },

            urlParams: function(params) {
                var me = this;
                me.companyCode = params[0];
                me.company = Config.getCompanyName(me.companyCode);
                me.categoryCode = params[1];
                me.category = Config.getBasicCategoryName(me.categoryCode);
                me.reportDate = params[2];

            },

            render: function(){
                var me = this;
                me.el.innerHTML = me.template();

            },

            fillData: function() {
                var me = this;
                //console.log("Basic main category fillData: " + me.companyCode + " " + me.categoryCode + " " + me.reportDate);
                me.mainCategoryCollection = new MainCategoryCollection();
                me.listenTo(me.mainCategoryCollection, 'renderContent', me.renderContent);
                me.listenTo(me.mainCategoryCollection, 'error', me.error);
                me.listenTo(me.mainCategoryCollection, 'emptyData', me.emptyData);
                me.mainCategoryCollection.mainCategoryData(me.companyCode, me.reportDate);
            },

            renderCompleted: function(){
                var me = this;

                if(me.company != null && me.company != ""){
                    $("header.page-header .ui-title").text(me.company +'主类报表');
                }
                $("div.main-chart-container").height($(window).height()-108);

                Draw.start('blue',[]);

                PageUtils.cleanAllMessage();

                me.activeCategory();
            },

            activeCategory: function(){
                var me = this;
                if(me.companyCode == Config.code.company.SHBGXG){
                    $("#main-tabs ul.ui-tabs-nav").removeClass("ui-grid-c").addClass("ui-grid-d");
                    $("#main-tabs").addClass("has-wip");
                    $("#wip-main-tab").parent().show();
                }else {
                    $("#main-tabs ul.ui-tabs-nav").removeClass("ui-grid-d").addClass("ui-grid-c");
                    $("#main-tabs").removeClass("has-wip");
                    $("#wip-main-tab").parent().hide();
                }
                $("#main-tabs div.ui-navbar li > a").removeClass("ui-btn-active");
                switch (me.categoryCode){
                    case Config.code.basicCategory.MIT:
                        $("#mit-main-tab").click().addClass("ui-btn-active");
                        break;
                    case Config.code.basicCategory.RM:
                        $("#rm-main-tab").click().addClass("ui-btn-active");
                        break;
                    case Config.code.basicCategory.FP:
                        $("#fp-main-tab").click().addClass("ui-btn-active");
                        break;
                    case Config.code.basicCategory.SIT:
                        $("#sit-main-tab").click().addClass("ui-btn-active");
                        break;
                    case Config.code.basicCategory.WIP:
                        $("#wip-main-tab").click().addClass("ui-btn-active");
                        break;
                    default:
                        $("#mit-main-tab").click().addClass("ui-btn-active");
                }
            },

            renderContent: function() {
                var me = this;

                console.log("Basic main category: " + me.companyCode + " " + me.category + " " + me.reportDate + JSON.stringify(me.mainCategoryCollection));

                var barOptions = {
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
                    chart: {
                        type: 'bar',
                        marginTop: 50
                    },
                    credits: {
                        enabled: false
                    },
                    tooltip: {
                        enabled: true,
                        valueSuffix: '吨'
                    },
                    xAxis: {
                        lineWidth: 0,
                        tickWidth: 0,
                        gridLineWidth: 1,
                        labels: {
//                            overflow: "justify",
//                            step: 1,
                            //useHTML: true,
                            style: {
                                color: '#000',
                                fontFamily: '微软雅黑',
                                fontSize: '16px',
                                fontStyle: 'normal',
                                whiteSpace: 'nowrap',
                                width: "100%",
                                fontWeight: 'regular'
                            },
                            x: 5,
                            y: -6,
                            align:'left'
                        }
                    },
                    yAxis: {
                        title: {
                            text: null
                        },
                        labels:{
                            enabled: true,
                            formatter: function () {
                                return this.value/1000 + "千吨";
                            },
                            x: 0,
                            y: -15,
                            align:'left'
                        },
                        min: 0,
                        offset: 6,
                        opposite: true,
                        lineWidth: 0,
                        gridLineWidth: 0
                        //gridLineDashStyle:'Dot'
                    },
                    legend: {
                        enable: false
                    },
                    plotOptions: {
                        series: {
                            stacking: 'normal',
                            pointWidth: 12, // comment this out to see the effect
                            pointPadding: 0,
                            //pointPlacement:5,
                            groupPadding: 0,
                            borderWidth: 0,
                            cursor: 'pointer'
                        }
                    },
                    labels: {
                        style: {
                            color: '#99b'
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

                var mitName = "", rmName = "", fpName = "", sitName = "", wipName = "";
                var mitCategories = [], rmCategories = [], fpCategories = [], sitCategories = [], wipCategories = [];
                me.mitData = [];
                me.rmData = [];
                me.fpData = [];
                me.sitData = [];
                me.wipData = [];

                $.each(me.mainCategoryCollection.toJSON(), function(index, mainCategory){
                        switch (mainCategory.mainCategoryCode) {
                            case Config.code.basicCategory.MIT:
                                mitName = mainCategory.mainCategoryName;
                                $.each(mainCategory.categories.toJSON(), function (index, category) {
                                    mitCategories.push(category.categoryName);
                                    me.mitData.push(category.totalNumber);
                                });
                                break;
                            case Config.code.basicCategory.RM:
                                rmName = mainCategory.mainCategoryName;
                                $.each(mainCategory.categories.toJSON(), function (index, category) {
                                    rmCategories.push(category.categoryName);
                                    me.rmData.push(category.totalNumber);
                                });
                                break;
                            case Config.code.basicCategory.FP:
                                fpName = mainCategory.mainCategoryName;
                                $.each(mainCategory.categories.toJSON(), function (index, category) {
                                    fpCategories.push(category.categoryName);
                                    me.fpData.push(category.totalNumber);
                                });
                                break;
                            case Config.code.basicCategory.SIT:
                                sitName = mainCategory.mainCategoryName;
                                $.each(mainCategory.categories.toJSON(), function (index, category) {
                                    sitCategories.push(category.categoryName);
                                    me.sitData.push(category.totalNumber);
                                });
                                break;
                            case Config.code.basicCategory.WIP:
                                wipName = mainCategory.mainCategoryName;
                                $.each(mainCategory.categories.toJSON(), function (index, category) {
                                    wipCategories.push(category.categoryName);
                                    me.wipData.push(category.totalNumber);
                                });
                                break;
                        }
                });

                var formatter = function () {
                    return this.value/1000 + "千吨";
                }
                $("#mit-main-chart, #rm-main-chart, #fp-main-chart, #sit-main-chart, #wip-main-chart").empty();
                if(me.mitData.length > 0) {
                    $("#mit-main-chart").width($(document).width()-10).height(50 + (70 * mitCategories.length));
                    var mitMainOptions = Utils.clone(barOptions);
                    var mitColor = Config.highchartsColor.basicCategoryReport.mit;
                    mitMainOptions.colors = [
                        { linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                            stops: [
                                [0, mitColor],
                                [1, Highcharts.Color(mitColor).setOpacity(0.5).get('rgba')]
                            ]
                        }
                    ];
                    mitMainOptions.xAxis.categories = mitCategories;
                    mitMainOptions.series = [
                        {
                            name: mitName,
                            data: me.mitData,
                            stack: 'inventoryData',
                            index: 0,
                            showInLegend: false
                        },
                        {
                            name: '',
                            data: [],
                            stack: 'placeholder',
                            showInLegend: false
                        }
                    ];
                    mitMainOptions.yAxis.labels.formatter = formatter;
                    mitMainOptions.chart.renderTo = "mit-main-chart";
                    var mitMainChart = new Highcharts.Chart(mitMainOptions);
                }else{
                    me.emptyCategoryData("mit-main");
                }

                if(me.rmData.length > 0) {
                    $("#rm-main-chart").width($(document).width()-10).height(50 + (70 * rmCategories.length));
                    var rmMainOptions = Utils.clone(barOptions)
                    var rmColor = Config.highchartsColor.basicCategoryReport.rm;
                    rmMainOptions.colors = [
                        { linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                            stops: [
                                [0, rmColor],
                                [1, Highcharts.Color(rmColor).setOpacity(0.5).get('rgba')]
                            ]
                        }
                    ];
                    rmMainOptions.xAxis.categories = rmCategories;
                    rmMainOptions.series = [
                        {
                            name: rmName,
                            data: me.rmData,
                            stack: 'inventoryData',
                            index: 0,
                            showInLegend: false
                        },
                        {
                            name: '',
                            data: [],
                            stack: 'placeholder',
                            showInLegend: false
                        }
                    ];
                    rmMainOptions.yAxis.labels.formatter = formatter;
                    rmMainOptions.chart.renderTo = "rm-main-chart";
                    var rmMainChart = new Highcharts.Chart(rmMainOptions);
                }else{
                    me.emptyCategoryData("rm-main");
                }

                if(me.fpData.length > 0) {
                    $("#fp-main-chart").width($(document).width()-10).height(50 + (70 * fpCategories.length));
                    var fpMainOptions = Utils.clone(barOptions)
                    var fpColor = Config.highchartsColor.basicCategoryReport.fp;
                    fpMainOptions.colors = [
                        { linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                            stops: [
                                [0, fpColor],
                                [1, Highcharts.Color(fpColor).setOpacity(0.5).get('rgba')]
                            ]
                        }
                    ];
                    fpMainOptions.xAxis.categories = fpCategories;
                    fpMainOptions.series = [
                        {
                            name: fpName,
                            data: me.fpData,
                            stack: 'inventoryData',
                            index: 0,
                            showInLegend: false
                        },
                        {
                            name: '',
                            data: [],
                            stack: 'placeholder',
                            showInLegend: false
                        }
                    ];
                    fpMainOptions.yAxis.labels.formatter = formatter;
                    fpMainOptions.chart.renderTo = "fp-main-chart";
                    var fpMainChart = new Highcharts.Chart(fpMainOptions);
                }else{
                    me.emptyCategoryData("fp-main");
                }

                if(me.sitData.length > 0) {
                    $("#sit-main-chart").width($(document).width()-10).height(50 + (70 * sitCategories.length));
                    var sitMainOptions = Utils.clone(barOptions)
                    var sitColor = Config.highchartsColor.basicCategoryReport.sit;
                    sitMainOptions.colors = [
                        { linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                            stops: [
                                [0, sitColor],
                                [1, Highcharts.Color(sitColor).setOpacity(0.5).get('rgba')]
                            ]
                        }
                    ];
                    sitMainOptions.xAxis.categories = sitCategories;
                    sitMainOptions.series = [
                        {
                            name: sitName,
                            data: me.sitData,
                            stack: 'inventoryData',
                            index: 0,
                            showInLegend: false
                        },
                        {
                            name: '',
                            data: [],
                            stack: 'placeholder',
                            showInLegend: false
                        }
                    ];
                    sitMainOptions.yAxis.labels.formatter = formatter;
                    sitMainOptions.chart.renderTo = "sit-main-chart";
                    var sitMainChart = new Highcharts.Chart(sitMainOptions);
                }else{
                    me.emptyCategoryData("sit-main");
                }

                if(me.wipData.length > 0) {
                    $("#wip-main-chart").width($(document).width()-10).height(50 + (70 * wipCategories.length));
                    var wipMainOptions = Utils.clone(barOptions)
                    var wipColor = Config.highchartsColor.basicCategoryReport.wip;
                    wipMainOptions.colors = [
                        { linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                            stops: [
                                [0, wipColor],
                                [1, Highcharts.Color(wipColor).setOpacity(0.5).get('rgba')]
                            ]
                        }
                    ];
                    wipMainOptions.xAxis.categories = wipCategories;
                    wipMainOptions.series = [
                        {
                            name: wipName,
                            data: me.wipData,
                            stack: 'inventoryData',
                            index: 0,
                            showInLegend: false
                        },
                        {
                            name: '',
                            data: [],
                            stack: 'placeholder',
                            showInLegend: false
                        }
                    ];
                    wipMainOptions.yAxis.labels.formatter = formatter;
                    wipMainOptions.chart.renderTo = "wip-main-chart";
                    var wipMainChart = new Highcharts.Chart(wipMainOptions);
                }else{
                    me.emptyCategoryData("wip-main");
                }
            },

            refresh:function(){
                var me = this;

                me.mainCategoryCollection.mainCategoryData(me.companyCode, me.reportDate);
            },

            error: function(message){
                var me = this;
                PageUtils.refresh(me.$el.find("div.generic-wrapper.ui-content"), me, "数据加载失败，" + message);
            },

            emptyData: function(){
                var me = this;
                PageUtils.message(me.$el.find("div.generic-wrapper.ui-content"), Config.emptyData);
            },

            emptyCategoryData: function(category){
                var me = this;
                PageUtils.message(me.$el.find("#" + category), Config.emptyData);
            }

        });

        return MainCategoryPage;

    });
