/**
 * Created by Eric on 12/24/2014.
 */

define(['jquery','underscore', 'backbone',
        'draw',
        'config/config',
        'utils',
        'pageUtils/pageUtils',
        'turnover/turnover-page/turnover-model',
        'turnover/turnover-page/turnover-collection',
        'text!subturnover/subturnover-page/subturnover-page.html',
        'text!toolbar',
        'iscrollProbe',
        'highcharts/highcharts',
        'css!subturnover/common/css/subturnover-page.css'],

    function($, _, Backbone,
             Draw,
             Config,
             Utils,
             PageUtils,
             TurnoverModel,
             TurnoverCollection,
             SubTurnoverPageTemplate,
             ToolbarHTML) {

        'use strict';

        var TurnoverPage = Backbone.View.extend({

            model: null,

            template: _.template(SubTurnoverPageTemplate  + ToolbarHTML),

            turnoverCollection: null,

            originalTurnoverCollection: null,

            companyCollection: null,

            originalCompanyCollection: null,

            companyCode: null,

            company: null,

            categoryCode: null,

            category: null,

            pageLoaded: false,

            //用于创建el下的属性
            attributes: function() {
                return{
                    'data-role': 'page',
                    'class': 'layout no-footer',
                    'id': 'subturnover-page',
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

                $(document).off("change", "#subturnover-page #company-value");
                $(document).on("change", "#subturnover-page #company-value", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var companyValue = $(event.target).val();
                    if(companyValue != "") {
                        me.companyCode = companyValue;
                        me.company =  $(event.target).find("option:selected").text();
                        //window.location.href = "#page/subturnover/" + companyValue + "/" + me.category ;
                        $("header.page-header .ui-title").text(me.company +'库存周转报表');
                        me.refreshView();
                    }
                });

                $(document).off("change", "#subturnover-page #category-value");
                $(document).on("change", "#subturnover-page #category-value", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var categoryValue = $(event.target).val();
                    if(categoryValue != "") {
                        me.categoryCode = categoryValue;
                        me.category = Config.getCategoryName(me.categoryCode);
                        console.log(me.categoryCode);
                        me.filterCategory();
                    }
                });

                $(document).off("vclick", "#subturnover-page .mc-link a");
                $(document).on("vclick", "#subturnover-page .mc-link a", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    window.location.href = "#page/turnovercategory/" + me.companyCode + "/" + me.categoryCode;
                });
            },

            fillData: function() {
                var me = this;
                //report date is the end day of last month
                me.reportDate = Utils.getEndDayOfMonth();
                console.log("Turnover fillData " + me.reportDate);
                me.turnoverCollection = new TurnoverCollection();
                me.listenTo(me.turnoverCollection, 'renderContent', me.renderContent);
                me.listenTo(me.turnoverCollection, 'error', me.error);
                me.turnoverCollection.turnoverData(me.reportDate);
                me.originalTurnoverCollection = me.turnoverCollection.clone();
            },

            renderContent: function(){
                var me = this;
                me.filterCategory();
            },

            filterCategory: function(){
                var me = this;

                console.log("Sub turnover filter category: " + me.categoryCode);
                var category = me.turnoverCollection.filter(function(categories){
                    return categories.get('categoryCode') === me.categoryCode;
                });
                var categoryJSON = new Backbone.Collection(category).toJSON();
                if(categoryJSON != null && categoryJSON.length > 0){
                    me.companyCollection  = categoryJSON[0].companies;
                }
                else
                {
                    me.companyCollection  = new Backbone.Collection();
                }
                me.originalCompanyCollection = me.companyCollection.clone();

                console.log("Turnover RenderContent company collection: " + JSON.stringify(me.companyCollection.toJSON()));
                me.refreshView();
            },

            renderCompleted: function() {
                var me = this;

                if(!me.pageLoaded){

                    $.each(Config.companies,function(index, company){
                        $("#company-value").append("<option value=\"" + company.code + "\">" + company.name + "</option>");
                    });

                    $("#line-charts").height($(window).height()- 100);
                    $("#turnover-line-chart1").height($(window).height()- 110);
                    me.pageLoaded = true;
                }

                if(me.companyCode != null && me.companyCode != "")
                {
                    $("#category-value").empty();
                    $("header.page-header .ui-title").text(me.company +'库存周转报表');
                    if(me.companyCode == Config.code.company.SHBGXG){
                        $.each(Config.categories,function(index, category){
                            $("#category-value").append("<option value=\"" + category.code + "\">" + category.name + "</option>");
                        });
                    }
                    else{
                        $.each(Config.categories,function(index, category){
                            if(category.code != "m3") {
                                $("#category-value").append("<option value=\"" + category.code + "\">" + category.name + "</option>");
                            }
                        });
                    }
                }

                $("#company-value").val(me.companyCode);
                if(me.categoryCode != null && me.categoryCode != ""){
                    if(me.categoryCode == "m3" && me.companyCode != Config.code.company.SHBGXG) {
                        me.categoryCode = Config.code.category.M1;
                    }
                    $("#category-value").val(me.categoryCode);
                };

                //refresh
                $("#company-value").selectmenu('refresh');
                $("#category-value").selectmenu('refresh');

                Draw.start('blue',[]);

            },

            refreshView:function(){
                var me = this;
                me.renderCharts();
            },

            renderCharts: function(){
                var me = this;
                var lineOptions = {
                    chart: {
                        type: 'line',
                        marginTop: 40,
                        marginLeft: 70
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
                                return month + "<br/>月"; // clean, unformatted number for year
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
                                return this.value + "天";
                            }
                        },
                        lineWidth: 0,
                        gridLineWidth: 0
                    },
                    tooltip: {
                        enabled: true,
                        valueSuffix: '天'
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions:{
                        line:{
                            marker:{
                                enabled: false
                            }
                        }
                    }
                }

                var categories = [];
                var company1Name;
                var company1Data = [];
                var color;

                switch (me.companyCode) {
                    case Config.code.company.MYB:
                        color= Config.highchartsColor.agingReport.range1;
                        break;
                    case Config.code.company.BGJSMY:
                        color= Config.highchartsColor.agingReport.range2;
                        break;
                    case Config.code.company.NJBRGS:
                        color= Config.highchartsColor.agingReport.range3;
                        break;
                    case Config.code.company.JSBGJM:
                        color= Config.highchartsColor.agingReport.range4;
                        break;
                    case Config.code.company.SHBGXG:
                        color= Config.highchartsColor.agingReport.range5;
                        break;
                    case Config.code.company.NTBGZP:
                        color= Config.highchartsColor.agingReport.range6;
                        break;
                    case Config.code.company.SHBYZG:
                        color= Config.highchartsColor.agingReport.range1;
                        break;
                    case Config.code.company.SHBGYT:
                        color= Config.highchartsColor.agingReport.range2;
                        break;
                    case Config.code.company.WHBGYT:
                        color= Config.highchartsColor.agingReport.range3;
                        break;
                    case Config.code.company.FSBGYT:
                        color= Config.highchartsColor.agingReport.range4;
                        break;
                    case Config.code.company.BJBGYT:
                        color= Config.highchartsColor.agingReport.range5;
                        break;
                }
                $.each(me.companyCollection.toJSON(), function(index, company){
                    if(company.companyCode == me.companyCode){
                        company1Name = company.companyName;
                        $.each(company.months, function (index, month) {
                            company1Data.push(month.totalNumber);
                            categories.push(month.monthName);
                        });
                    }
                });

                var lineChart1Options = lineOptions;
                lineChart1Options.colors = [color],
                    lineChart1Options.chart.renderTo = "turnover-line-chart1";
                lineChart1Options.xAxis.categories = categories;
                lineChart1Options.series = [
                    {
                        name: company1Name,
                        data: company1Data
                    }
                ];
                var lineChart1 = new Highcharts.Chart(lineChart1Options);

            },

            refresh:function(){
                var me = this;
                //me.renderCharts();
                me.turnoverCollection.turnoverData(me.reportDate);
                me.originalTurnoverCollection = me.turnoverCollection.clone();
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

        return TurnoverPage;

    });

