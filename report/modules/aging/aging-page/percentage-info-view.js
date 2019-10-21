/**
 * Created by Eric
 */

define(['jquery','underscore', 'backbone',
        'utilities/session',
        'config/config',
        'pageUtils/pageUtils',
        'text!aging/aging-page/percentage-info-view.html'],

    function($, _, Backbone,
             Session,
             Config,
             PageUtils,
             PercentageInfoViewTemplate) {

        'use strict';

        var PercentageInfoView = Backbone.View.extend({

            template: _.template(PercentageInfoViewTemplate),

            barChart: null,

            companyCollection: null,

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

            fillData: function(subViewEl, companyCollection){
                var me = this;
                me.subViewEl = subViewEl;
                me.companyCollection = companyCollection;
            },

            renderCompleted: function(){

                var me = this;
                if(me.companyCollection.toJSON().length > 0) {
                    me.renderChart();
                }else{
                    me.emptyData();
                }
            },

            renderChart: function(){

                var me = this;

                var companies = [];
                var range1Name = "", range2Name = "", range3Name = "", range4Name = "", range5Name = "", range6Name = "";
                var range1Data = [], range2Data = [], range3Data = [], range4Data = [], range5Data = [], range6Data = [];

                $.each(me.companyCollection.toJSON(), function(index, company){
                    companies.push(company.companyName);
                    var companyTotal = 0;
                    $.each(company.ranges.toJSON(), function(index, range){
                        companyTotal = companyTotal + Math.round(range.totalNumber);
                    });
                    $.each(company.ranges.toJSON(), function(index, range){
                        switch (range.rangeCode){
                            case Config.code.agingRange.Days30:
                                range1Name = range.rangeName;
                                if(companyTotal != 0) {
                                    var percentage = (range.totalNumber / companyTotal) * 100;
                                    range1Data.push(Math.round(percentage * 10) / 10);
                                }else{
                                    range1Data.push(0);
                                }
                                break;
                            case Config.code.agingRange.Days60:
                                range2Name = range.rangeName;
                                if(companyTotal != 0) {
                                    var percentage = (range.totalNumber / companyTotal) * 100;
                                    range2Data.push(Math.round(percentage * 10) / 10);
                                }else{
                                    range2Data.push(0);
                                }
                                break;
                            case Config.code.agingRange.Days90:
                                range3Name = range.rangeName;
                                if(companyTotal != 0) {
                                    var percentage = (range.totalNumber / companyTotal) * 100;
                                    range3Data.push(Math.round(percentage * 10) / 10);
                                }else{
                                    range3Data.push(0);
                                }
                                break;
                            case Config.code.agingRange.Days180:
                                range4Name = range.rangeName;
                                if(companyTotal != 0) {
                                    var percentage = (range.totalNumber / companyTotal) * 100;
                                    range4Data.push(Math.round(percentage * 10) / 10);
                                }else{
                                    range4Data.push(0);
                                }
                                break;
                            case Config.code.agingRange.Days365:
                                range5Name = range.rangeName;
                                if(companyTotal != 0) {
                                    var percentage = (range.totalNumber / companyTotal) * 100;
                                    range5Data.push(Math.round(percentage * 10) / 10);
                                }else{
                                    range5Data.push(0);
                                }
                                break;
                            case Config.code.agingRange.Days365GT:
                                range6Name = range.rangeName;
                                if(companyTotal != 0) {
                                    var percentage = (range.totalNumber / companyTotal) * 100;
                                    range6Data.push(Math.round(percentage * 10) / 10);
                                }else{
                                    range6Data.push(0);
                                }
                                break;
                        }
                    });
                });
                //console.log(companies.length);

                $('#percentage-chart').height(70+(70 * companies.length));
                $("#percentage-wrapper").height($(window).height() - 150);

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
                        renderTo: 'percentage-chart',
                        type: 'bar',
                        marginTop: 100
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
                                var url = "#page/subaging/" + code + "/" + me.reportDate;
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
                            name:range1Name,
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

