/**
 * Created by Eric on 1/13/2015.
 */


define(['jquery','underscore', 'backbone',
        'draw',
        'utilities/session',
        'config/config',
        'utils',
        'pageUtils/pageUtils',
        'agingcategory/agingcategory-page/agingcategory-model',
        'agingcategory/agingcategory-page/agingcategory-collection',
        'text!agingcategory/agingcategory-page/agingcategory-page.html',
        'text!toolbar',
        'highcharts/highcharts',
        'css!agingcategory/common/css/agingcategory-page.css'],

    function($, _, Backbone,
             Draw,
             Session,
             Config,
             Utils,
             PageUtils,
             AgingCategoryModel,
             AgingCategoryCollection,
             AgingCategoryPageTemplate,
             ToolbarHTML) {

        'use strict';

        var AgingCategoryPage = Backbone.View.extend({

            model: null,

            template: _.template(AgingCategoryPageTemplate + ToolbarHTML),

            companyCode: null,

            company: null,

            categoryCode: null,

            category: null,

            agingCategoryCollection: null,

            //用于创建el下的属性
            attributes: function() {
                return{
                    'data-role': 'page',
                    'class': 'layout no-footer',
                    'id': 'agingcategory-page',
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
                me.category = Config.getCategoryName(me.categoryCode);
                me.reportDate = params[2];
            },

            render: function(){
                var me = this;
                me.el.innerHTML = me.template();

            },

            fillData: function() {
                var me = this;

                $("#aging-main-chart").empty();
                console.log("Aging category fillData: " + me.companyCode + " " + me.categoryCode + " " + me.reportDate);
                me.agingCategoryCollection = new AgingCategoryCollection();
                me.listenTo(me.agingCategoryCollection, 'renderContent', me.renderContent);
                me.listenTo(me.agingCategoryCollection, 'error', me.error);
                me.listenTo(me.agingCategoryCollection, 'emptyData', me.emptyData);
                me.agingCategoryCollection.agingCategoryData(me.companyCode, me.categoryCode, me.reportDate);
            },

            renderCompleted: function() {
                var me = this;

                $("header.page-header .ui-title").text(me.company + me.category + "主类报表");
                Draw.start('blue',[]);
                PageUtils.cleanAllMessage();
            },

            renderContent: function() {
                var me = this;
                me.renderChart();

            },

            renderChart: function(){
                var me = this;

                var barOptions = {
                    colors: [Config.highchartsColor.agingReport.range1, Config.highchartsColor.agingReport.range2,
                        Config.highchartsColor.agingReport.range3, Config.highchartsColor.agingReport.range4,
                        Config.highchartsColor.agingReport.range5, Config.highchartsColor.agingReport.range6],
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
                        marginTop: 110
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
                            style: {
                                color: '#000',
                                fontFamily: '微软雅黑',
                                fontSize: '16px',
                                whiteSpace: 'nowrap',
                                width: "100%",
                                fontStyle: 'normal',
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
                        align: 'center',
                        backgroundColor: '#FFFFFF',
                        // floating: true,
                        verticalAlign: 'top',
                        reversed: true,
                        itemStyle: {
                            fontFamily: '微软雅黑',
                            fontSize: '14px',
                            fontWeight: 'normal'
                        },
                        itemHoverStyle: {
                            color: '#039'
                        },
                        itemHiddenStyle: {
                            color: 'gray'
                        },
                        itemWidth: 94,
                        symbolWidth: 18,
                        symbolHeight: 18,
                        itemDistance: 3,
                        itemMarginBottom: 5
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

                var categories = [];
                var range1Name = "", range2Name = "", range3Name = "", range4Name = "", range5Name = "", range6Name = "";
                var range1Data = [], range2Data = [], range3Data = [], range4Data = [], range5Data = [], range6Data = [];
                //console.log("Aging category collection: " + JSON.stringify(me.agingCategoryCollection));
                $.each(me.agingCategoryCollection.toJSON(), function(index, category){
                    categories.push(category.categoryName);
                    $.each(category.ranges, function (index, range) {
                        switch (range.rangeCode) {
                            case Config.code.agingRange.Days30:
                                range1Name = range.rangeName;
                                range1Data.push(range.totalNumber);
                                break;
                            case Config.code.agingRange.Days60:
                                range2Name = range.rangeName;
                                range2Data.push(range.totalNumber);
                                break;
                            case Config.code.agingRange.Days90:
                                range3Name = range.rangeName;
                                range3Data.push(range.totalNumber);
                                break;
                            case Config.code.agingRange.Days180:
                                range4Name = range.rangeName;
                                range4Data.push(range.totalNumber);
                                break;
                            case Config.code.agingRange.Days365:
                                range5Name = range.rangeName;
                                range5Data.push(range.totalNumber);
                                break;
                            case Config.code.agingRange.Days365GT:
                                range6Name = range.rangeName;
                                range6Data.push(range.totalNumber);
                                break;
                        };
                    });
                });

                $("#aging-main-chart").width($(window).width() - 10).height(100 + (70 * categories.length));

                var agingMainOptions = barOptions;
                agingMainOptions.xAxis.categories = categories;
                agingMainOptions.series = [
                    {
                        name: range1Name,
                        data: range1Data,
                        stack: 'inventoryData',
                        index: 5
                    },
                    {
                        name: range2Name,
                        data: range2Data,
                        stack: 'inventoryData',
                        index: 4
                    },
                    {
                        name: range3Name,
                        data: range3Data,
                        stack: 'inventoryData',
                        index: 3
                    },
                    {
                        name: range4Name,
                        data: range4Data,
                        stack: 'inventoryData',
                        index: 2
                    },
                    {
                        name: range5Name,
                        data: range5Data,
                        stack: 'inventoryData',
                        index: 1
                    },
                    {
                        name: range6Name,
                        data: range6Data,
                        stack: 'inventoryData',
                        index: 0
                    },
                    {
                        name: '',
                        data: [],
                        stack: 'placeholder',
                        showInLegend: false
                    }
                ];
                agingMainOptions.chart.renderTo = "aging-main-chart";
                var agingMainChart = new Highcharts.Chart(agingMainOptions);
            },

            refresh:function(){
                var me = this;
                me.agingCategoryCollection.agingCategoryData(me.companyCode, me.categoryCode, me.reportDate);
            },

            error: function(message){
                var me = this;
                PageUtils.refresh(me.$el.find("div.generic-wrapper.ui-content"), me, "数据加载失败，" + message);
            },

            emptyData: function(){
                var me = this;
                PageUtils.message(me.$el.find("div.generic-wrapper.ui-content"), Config.emptyData);
            }
        });

        return AgingCategoryPage;

    });

