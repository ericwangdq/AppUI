/**
 * Created by Eric
 */

define(['jquery','underscore', 'backbone',
        'utilities/session',
        'config/config',
        'pageUtils/pageUtils',
        'text!home/home-page/percentage-info-view.html'],

    function($, _, Backbone,
             Session,
             Config,
             PageUtils,
             PercentageInfoViewTemplate) {

        'use strict';

        var PercentageInfoView = Backbone.View.extend({

            template: _.template(PercentageInfoViewTemplate),

            barChart: null,

            homeCollection: null,

            reportDate: null,

            //用于创建el下的属性
            attributes: function() {
                return{
                    'id': 'percentage-wrapper',
                    'class': 'scroller-touch'
                }
            },

            initialize: function() {

                var me = this;
                _.bindAll(me, 'render');
                me.render();
                console.log("Percentage BarInfoView initialize" );

            },

            render: function(){

                var me = this;

                me.el.innerHTML = me.template();

                return me;

            },

            fillData: function(subViewEl, homeCollection){
                var me = this;
                me.subViewEl = subViewEl;
                me.homeCollection = homeCollection;
            },

            renderCompleted: function(){

                var me = this;
                if(me.homeCollection.toJSON().length > 0) {
                    me.renderChart();
                }else{
                    me.emptyData();
                }
            },

            renderChart: function(){

                var me = this;

                var companies = [];
                var mitName = "", rmName = "", fpName = "", sitName = "";
                var mitData = [], rmData = [], fpData = [], sitData = [];

                $.each(me.homeCollection.toJSON(), function(index, item){
                    companies.push(item.companyName);
                    var companyTotal = 0;
                    $.each(item.categories.toJSON(), function(index, category){
                        if(category.categoryCode != Config.code.basicCategory.WIP) {
                            companyTotal = companyTotal + Math.round(category.totalNumber);
                        }
                    });
                    //console.log(item.companyName + " companyTotal: " + companyTotal);
                    $.each(item.categories.toJSON(), function(index, category){
                        switch (category.categoryCode){
                            case Config.code.basicCategory.MIT:
                                mitName = category.categoryName;
                                if(companyTotal != 0) {
                                    var percentage = (category.totalNumber / companyTotal) * 100;
                                    mitData.push(Math.round(percentage * 10) / 10);
                                }else{
                                    mitData.push(0);
                                }
                                break;
                            case Config.code.basicCategory.RM:
                                rmName = category.categoryName;
                                if(companyTotal != 0) {
                                    var percentage = (category.totalNumber / companyTotal) * 100;
                                    rmData.push(Math.round(percentage * 10) / 10);
                                }else{
                                    rmData.push(0);
                                }
                                break;
                            case Config.code.basicCategory.FP:
                                fpName = category.categoryName;
                                if(companyTotal != 0) {
                                    var percentage = (category.totalNumber / companyTotal) * 100;
                                    fpData.push(Math.round(percentage * 10) / 10);
                                }else{
                                    fpData.push(0);
                                }
                                break;
                            case Config.code.basicCategory.SIT:
                                sitName = category.categoryName;
                                if(companyTotal != 0) {
                                    var percentage = (category.totalNumber / companyTotal) * 100;
                                    sitData.push(Math.round(percentage * 10) / 10);
                                }else{
                                    sitData.push(0);
                                }
                                break;
                        }
                    });
                });
                //console.log(companies.length);

                $('#percentage-chart').height(70+(70 * companies.length));
                $("#percentage-wrapper").height($(window).height() - 140);

                var barOptions = {
                    colors: [Config.highchartsColor.basicReport.mit, Config.highchartsColor.basicReport.rm, Config.highchartsColor.basicReport.fp, Config.highchartsColor.basicReport.sit],

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
                        renderTo: 'percentage-chart',
                        type: 'bar',
                        marginTop: 75
                    },
                    credits: {
                        enabled: false
                    },
                    tooltip: {
                        enabled: true,
                        valueSuffix: '%'
                    },
                    xAxis: {
                        categories: companies,
                        lineWidth: 0,
                        tickWidth: 0,
                        gridLineWidth: 1,
                        labels: {
                            style: {
                                color: '#000',
                                fontFamily: '微软雅黑',
                                fontSize: '16px',
                                fontStyle: 'normal',
                                fontWeight: 'regular'
                            },
                            useHTML: true,
                            formatter: function() {
                                var value = this.value;
                                var code = Config.getCompanyCode(value);
                                var url = "#page/subreport/" + code + "/" + me.reportDate;
                                return "<a class=\"chart-label-link\" href=\"" + url + "\" title=\""+ value + "\">" + value + "</a>";
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
                        max: 100,
                        min: 0,
                        labels:{
                            enabled: true,
                            formatter: function () {
                                return this.value + "%";
                            },
                            x: 0,
                            y: -15,
                            align:'left'
                        },
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
                            fontSize: '13px',
                            fontWeight: 'normal',
                            color: '#808080'
                        },
                        itemHoverStyle: {
                            color: '#039'
                        },
                        itemHiddenStyle: {
                            color: 'gray'
                        },
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
                            events: {
                                //disable legend click
                                legendItemClick: function (event) {
                                    return false; //return true enable
                                }
                            },
                            cursor: 'pointer'
                        }
                    },
                    series: [
                        {
                            name: mitName,
                            data: mitData,
                            stack: 'inventoryData',
                            index: 3
                        },
                        {
                            name: rmName,
                            data: rmData,
                            stack: 'inventoryData',
                            index: 2
                        },
                        {
                            name: fpName,
                            data: fpData,
                            stack: 'inventoryData',
                            index: 1
                        },
                        {
                            name: sitName,
                            data: sitData,
                            stack: 'inventoryData',
                            index: 0
                        },
                        {
                            name: '',
                            data: [],
                            stack: 'placeholder',
                            showInLegend: false
                        }
                    ],
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
                me.barChart = new Highcharts.Chart(barOptions);


            },

            emptyData: function(){
                var me = this;
                $('#percentage-chart').height($(window).height() - 175);
                PageUtils.message($(document).find("#percentage-info"), Config.emptyData);
            }
        });

        return PercentageInfoView;

    });

