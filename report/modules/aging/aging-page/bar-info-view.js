/**
 * Created by Eric
 */

define(['jquery','underscore', 'backbone',
        'utilities/session',
        'config/config',
        'pageUtils/pageUtils',
        'text!aging/aging-page/bar-info-view.html'],

    function($, _, Backbone,
             Session,
             Config,
             PageUtils,
             BarInfoViewTemplate) {

        'use strict';

        var BarInfoView = Backbone.View.extend({

            template: _.template(BarInfoViewTemplate),

            barChart: null,

            companyCollection: null,

            reportDate: null,

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
                    $.each(company.ranges.toJSON(),function(index, range){
                        switch (range.rangeCode){
                            case Config.code.agingRange.Days30:
                                range1Name = range.rangeName;
                                range1Data.push(range.totalNumber);
                                break;
                            case Config.code.agingRange.Days60:
                                range2Name = range.rangeName,
                                range2Data.push(range.totalNumber);
                                break;
                            case Config.code.agingRange.Days90:
                                range3Name = range.rangeName,
                                range3Data.push(range.totalNumber);
                                break;
                            case Config.code.agingRange.Days180:
                                range4Name = range.rangeName,
                                range4Data.push(range.totalNumber);
                                break;
                            case Config.code.agingRange.Days365:
                                range5Name = range.rangeName
                                range5Data.push(range.totalNumber);
                                break;
                            case Config.code.agingRange.Days365GT:
                                range6Name = range.rangeName,
                                range6Data.push(range.totalNumber);
                                break;
                        }
                    });
                });
                //console.log(companies.length);

                $('#summary-chart').height(80 + (70 * companies.length));
                $("#chart-wrapper").height($(window).height() - 150);

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
                        renderTo: 'summary-chart',
                        type: 'bar',
                        marginTop: 100
                    },
                    credits: {
                        enabled: false
                    },
                    tooltip: {
                        enabled: true,
                        valueSuffix: '吨'
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
                        labels:{
                            enabled: true,
                            formatter: function () {
                                return this.value/1000 + "千吨";
                            },
                            x: 0,
                            y: -10,
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
//                            point: {
//                                events: {
//                                    click: function () {
//                                        //alert('类别: ' + this.category + ', 值: ' + this.y);
//                                        var code = Config.getCompanyCode(this.category);
//                                        window.location.href = "#page/subaging/" + code + "/" + me.reportDate;
//                                        //Router.navigate("page/subreport/" + this.category + "/" + this.y, {trigger: true});
//                                        return false;
//                                    }
//                                }
//                            },
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

                $(document).off("change", "#date-value");
                $(document).on("change", "#date-value", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    //$("header.page-header .ui-title").text($(this).find("option:selected").text() + "库存报表");
                    me.barChart = new Highcharts.Chart(barOptions);
                });


            },

            emptyData: function(){
                var me = this;
                $('#summary-chart').height($(window).height() - 175);
                PageUtils.message($(document).find("#bar-info"), Config.emptyData);
            }
        });

        return BarInfoView;

    });

