/**
 * Created by Eric on 12/24/2014.
 */

define(['jquery','underscore', 'backbone',
        'draw',
        'config/config',
        'utils',
        'pageUtils/pageUtils',
        'turnovercategory/turnovercategory-page/turnovercategory-model',
        'turnovercategory/turnovercategory-page/turnovercategory-collection',
        'text!turnovercategory/turnovercategory-page/turnovercategory-page.html',
        'text!toolbar',
        'highcharts/highcharts',
        'css!turnovercategory/common/css/turnovercategory-page.css'],

    function($, _, Backbone,
             Draw,
             Config,
             Utils,
             PageUtils,
             TurnoverCategoryModel,
             TurnoverCategoryCollection,
             TurnoverCategoryPageTemplate,
             ToolbarHTML) {

        'use strict';

        var TurnoverCategoryPage = Backbone.View.extend({

            model: null,

            template: _.template(TurnoverCategoryPageTemplate  + ToolbarHTML),

            companyCode: null,

            company: null,

            categoryCode: null,

            category: null,

            turnoverCategoryCollection: null,

            //用于创建el下的属性
            attributes: function() {
                return{
                    'data-role': 'page',
                    'class': 'layout no-footer',
                    'id': 'turnovercategory-page',
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
            },

            render: function(){
                var me = this;
                me.el.innerHTML = me.template();
            },

            fillData: function() {
                var me = this;
                me.reportDate = Utils.getEndDayOfMonth();
                //me.reportDate = "2014-12-31";
                $("#turnover-main-chart").empty();
                console.log("Turnover category fillData: " + me.companyCode + " " + me.categoryCode + " " + me.reportDate);
                me.turnoverCategoryCollection = new TurnoverCategoryCollection();
                me.listenTo(me.turnoverCategoryCollection, 'renderContent', me.renderContent);
                me.listenTo(me.turnoverCategoryCollection, 'error', me.error);
                me.listenTo(me.turnoverCategoryCollection, 'emptyData', me.emptyData);
                me.turnoverCategoryCollection.turnoverCategoryData(me.companyCode, me.categoryCode, me.reportDate);
            },

            renderCompleted: function() {
                var me = this;

                PageUtils.cleanMessage(me.$el.find("div.generic-wrapper.ui-content"));
                $("#turnover-main-chart").width($(window).width() - 10);
                $("header.page-header .ui-title").text(me.company + me.category + "库存周转主类报表");
                Draw.start('blue',[]);
            },

            renderContent: function() {
                var me = this;

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
                        valueSuffix: '天'
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
                                return this.value + "天";
                            },
                            x: 0,
                            y: -15,
                            align:'left'
                        },
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

                var categories = [];
                var range1Name = me.category;
                var range1Data = [];

                $.each(me.turnoverCategoryCollection.toJSON(), function(index, category){
                    categories.push(category.categoryName);
                    range1Data.push(category.totalNumber);
                });

                $("#turnover-main-chart").height(50 + (70 * categories.length));

                var turnoverMainOptions = barOptions;
                turnoverMainOptions.colors=[{ linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                    stops: [ [0, '#e7e931'], [1, Highcharts.Color('#e7e931').setOpacity(0.5).get('rgba')] ]
                }];
                turnoverMainOptions.xAxis.categories = categories;
                turnoverMainOptions.series = [
                    {
                        name: range1Name,
                        data: range1Data,
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
                turnoverMainOptions.chart.renderTo = "turnover-main-chart";
                var turnoverMainChart = new Highcharts.Chart(turnoverMainOptions);

            },

            refresh:function(){
                var me = this;
                me.turnoverCategoryCollection.turnoverCategoryData(me.companyCode, me.categoryCode, me.reportDate);
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

        return TurnoverCategoryPage;

    });

