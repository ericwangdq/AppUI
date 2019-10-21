/**
 * Created by Eric
 */

define(['jquery','underscore', 'backbone',
        'config/config',
        'pageUtils/pageUtils',
        'text!subaging/subaging-page/bar-info-view.html'],

    function($, _, Backbone,
             Config,
             PageUtils,
             BarInfoViewTemplate) {

        'use strict';

        var BarInfoView = Backbone.View.extend({

            template: _.template(BarInfoViewTemplate),

            lineChart: null,

            rangeCollection: null,

            //用于创建el下的属性
            attributes: function() {
                return{
                    'id': 'chart-wrapper',
                    'class': 'scroller-touch'
                }
            },

            initialize: function() {

                var me = this;

                _.bindAll(me, 'render');

                me.render();
                console.log("BarInfoView initialize" );

            },

            render: function(){

                var me = this;

                me.el.innerHTML = me.template();

                return me;

            },

            fillData: function(subViewEl, rangeCollection){
                var me = this;
                me.subViewEl = subViewEl;
                me.rangeCollection = rangeCollection;

            },

            renderCompleted: function(){

                var me = this;
                if(me.rangeCollection.length > 0) {
                    me.renderChart();
                }else{
                    me.emptyData();
                }
            },

            renderChart: function(){

                var me = this;

                var months = [];
                var range1Name = "", range2Name = "", range3Name = "", range4Name = "", range5Name = "", range6Name = "";
                var range1Data = [], range2Data = [], range3Data = [], range4Data = [], range5Data = [], range6Data = [];

                $.each(me.rangeCollection, function(index, range){
                    switch (range.rangeCode) {
                        case Config.code.agingRange.Days30:
                            range1Name = range.rangeName;
                            $.each(range.months, function (index, month) {
                                range1Data.push(month.totalNumber);
                                months.push(month.monthNumber);
                            });
                            break;
                        case Config.code.agingRange.Days60:
                            range2Name = range.rangeName,
                                $.each(range.months, function (index, month) {
                                    range2Data.push(month.totalNumber);
                                });
                            break;
                        case Config.code.agingRange.Days90:
                            range3Name = range.rangeName,
                                $.each(range.months, function (index, month) {
                                    range3Data.push(month.totalNumber);
                                });
                            break;
                        case Config.code.agingRange.Days180:
                            range4Name = range.rangeName,
                                $.each(range.months, function (index, month) {
                                    range4Data.push(month.totalNumber);
                                });
                            break;
                        case Config.code.agingRange.Days365:
                            range5Name = range.rangeName
                            $.each(range.months, function (index, month) {
                                range5Data.push(month.totalNumber);
                            });
                            break;
                        case Config.code.agingRange.Days365GT:
                            range6Name = range.rangeName,
                                $.each(range.months, function (index, month) {
                                    range6Data.push(month.totalNumber);
                            });
                            break;
                    }
                });

                $("#chart-wrapper, #line-chart").width($(window).width()-10);
                $("#line-chart").height($(window).height()- 110);
                $("#chart-wrapper").height($(window).height() - 95);

                var lineOptions = {
                    colors: [Config.highchartsColor.agingReport.range1, Config.highchartsColor.agingReport.range2,
                        Config.highchartsColor.agingReport.range3, Config.highchartsColor.agingReport.range4,
                        Config.highchartsColor.agingReport.range5, Config.highchartsColor.agingReport.range6],
                    chart: {
                        renderTo: 'line-chart',
                        type: 'line',
                        marginTop: 40,
                        marginLeft: 60
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: null
                    },
                    subtitle: {
                        text: null
                    },
                    xAxis: {
                        categories: months,
                        labels: {
                            style: {
                                color: '#666',
                                fontFamily: '微软雅黑',
                                fontSize: '12px',
                                fontStyle: 'normal'
                            },
                            useHTML: true,
                            formatter: function() {
                                var month = this.value.replace("月","");
                                return month + "<br/>月"; // add month
                            },
                            enabled: true
                        },
                        tickWidth: 0,
                        lineWidth: 0,
                        gridLineWidth: 0
                    },
                    yAxis: {
                        title: {
                            text: null
                        },
                        plotLines: [{
                            value: 0,
                            width: 0,
                            color: '#808080'
                        }],
                        min: 0,
                        labels: {
                            enabled: true,
//                            format: '{value} 吨',
                            formatter: function () {
                                return this.value + "吨";
                            }
                        },
                        offset: -6,
                        opposite: false,
                        lineWidth: 0,
                        gridLineWidth: 0
                    },
                    tooltip: {
                        valueSuffix: '吨'
                    },
                    legend: {
                        align: 'center',
                        verticalAlign: 'bottom',
                        borderWidth: 0,
                        symbolWidth: 20,
                        itemStyle: {
                            fontFamily: '微软雅黑',
                            fontSize: '14px',
                            fontWeight: 'normal'
                        },
                        symbolHeight: 20,
                        itemWidth: 94,
                        itemDistance: 3,
                        itemMarginBottom: 5
                    },
                    plotOptions:{
                        line:{
                            marker:{
                                enabled: false
                            }
                        }
                    },
                    series: [
                        {
                            name: range1Name,
                            data: range1Data
                        },
                        {
                            name: range2Name,
                            data: range2Data
                        },
                        {
                            name: range3Name,
                            data: range3Data
                        },
                        {
                            name: range4Name,
                            data: range4Data
                        },
                        {
                            name: range5Name,
                            data: range5Data
                        },
                        {
                            name: range6Name,
                            data: range6Data
                        }
                    ]
                }

                me.lineChart = new Highcharts.Chart(lineOptions);

            },

            emptyData: function(){
                var me = this;
                $('#sammary-chart').height($(window).height() - 175);
                PageUtils.message($(document).find("#bar-info"), Config.emptyData);
            }
        });

        return BarInfoView;

    });

