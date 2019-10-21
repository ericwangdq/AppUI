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
        'text!turnover/turnover-page/turnover-page.html',
        'text!settingPanel',
        'text!toolbar',
        'iscrollProbe',
        'highcharts/highcharts',
        'css!turnover/common/css/turnover-page.css'],

    function($, _, Backbone,
             Draw,
             Config,
             Utils,
             PageUtils,
             TurnoverModel,
             TurnoverCollection,
             TurnoverPageTemplate,
             SettingPanelHTML,
             ToolbarHTML) {

        'use strict';

        var TurnoverPage = Backbone.View.extend({

            model: null,

            template: _.template(TurnoverPageTemplate + SettingPanelHTML + ToolbarHTML),

            turnoverCollection: null,

            originalTurnoverCollection: null,

            companyCollection: null,

            originalCompanyCollection: null,

            reportDate: null,

            categoryCode: null,

            pageLoaded: false,

            //用于创建el下的属性
            attributes: function() {
                return{
                    'data-role': 'page',
                    'class': 'layout',
                    'id': 'turnover-page',
                    'data-theme': 'metal'
                }
            },

            initialize: function() {
                var me = this;
                me.categoryCode = Config.code.category.M1;
            },

            urlParams: function(params){
                var me = this;
                //params[0];
                //console.log(JSON.stringify(params) + params.length);
            },

            render: function(){
                var me = this;
                me.el.innerHTML = me.template();

                $(document).off("change", "#turnover-page #company-value");
                $(document).on("change", "#turnover-page #company-value", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var companyValue = $(event.target).val();
                    if(companyValue != "") {
                        if(companyValue == "refresh"){
                            me.fillCompany();
                        }else {
                            window.location.href = "#page/subturnover/" + companyValue + "/" + me.categoryCode;
                        }
                    }
                });

                $(document).off("change", "#turnover-page #category-value");
                $(document).on("change", "#turnover-page #category-value", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var categoryValue = $(event.target).val();
                    if(categoryValue != "") {
                        me.categoryCode = categoryValue;
                        console.log(me.categoryCode);
                        me.filterCategory();
                    }
                });
            },

            fillData: function(){
                var me = this;
                //report date is the end day of last month
                me.reportDate = Utils.getEndDayOfMonth();
                console.log("Turnover fillData " + me.reportDate);
                me.turnoverCollection = new TurnoverCollection();
                me.listenTo(me.turnoverCollection,'renderContent',me.renderContent);
                me.listenTo(me.turnoverCollection,'error',me.error);
                me.listenTo(me.turnoverCollection,'emptyData',me.emptyData);
                me.turnoverCollection.turnoverData(me.reportDate);
                me.originalTurnoverCollection = me.turnoverCollection.clone();

            },

            renderCompleted: function() {
                var me = this;

                if(!me.pageLoaded){

                    me.fillCompany();

                    $.each(Config.categories,function(index, category){
                        $("#category-value").append("<option value=\"" + category.code + "\">" + category.name + "</option>");
                    });
                    $("#category-value").selectmenu('refresh');

                    $("#line-charts").height($(window).height()- 140);
                    me.pageLoaded = true;
                }

                PageUtils.cleanMessage(me.$el.find("div.generic-wrapper.ui-content"));

                $("div.page-footer a.ui-btn").removeClass("ui-btn-active");
                $("div.page-footer a.turnover").addClass("ui-btn-active");

                Draw.start('blue',[]);
            },

            renderContent: function(){
                var me = this;
                me.filterCategory();
            },

            filterCategory: function(){
                var me = this;

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

            refreshView:function(){
                var me = this;
                me.renderCharts();
            },

            fillCompany: function(){
                var me = this;
                PageUtils.getCompanies();
                $("#company-value").empty().append("<option value=\"\">子公司</option>")

                if(PageUtils.companies != null && PageUtils.companies.length > 0) {
                    $.each(PageUtils.companies, function (index, company) {
                        $("#company-value").append("<option value=\"" + company.companyCode + "\">" + company.companyName + "</option>");
                    });
                }
                else {
                    $("#company-value").append("<option value=\"refresh\">请刷新</option>");
                }

                //refresh
                $("#company-value").selectmenu('refresh');
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
                                fontSize: '13px',
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
                                return this.value + "天";
                            }
                        },
                        lineWidth: 0,
                        gridLineWidth: 0
                    },
                    tooltip: {
                        valueSuffix: '天'
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
                        itemWidth: 130,
                        itemDistance: 3,
                        itemMarginBottom: 5
                    },
                    plotOptions:{
                        line:{
                            marker:{
                                enabled: false
                            }
                        }
                    }
                }

                /*Tablet*/
                var isTablet = $(window).width() >= 768;
                if(isTablet) {
                    lineOptions.legend.itemStyle.fontSize = '16px';
                }
                else{
                    lineOptions.legend.itemStyle.fontSize = '14px';
                }
                var categories = [];
                var company1Name = "", company2Name = "", company3Name = "", company4Name = "", company5Name = "", company6Name = "",
                    company7Name = "", company8Name = "", company9Name = "", company10Name = "", company11Name = "";
                var company1Data = [], company2Data = [], company3Data = [], company4Data = [], company5Data = [], company6Data = [],
                    company7Data = [], company8Data = [], company9Data = [], company10Data = [], company11Data = [];
                var lineChart1Series =[];
                var lineChart2Series =[];

                $.each(me.companyCollection.toJSON(), function(index, company){
                    switch (company.companyCode) {
                        case Config.code.company.MYB:
                            company1Name = company.companyName;
                            $.each(company.months, function (index, month) {
                                company1Data.push(month.totalNumber);
                                categories.push(month.monthName);
                            });
                            break;
                        case Config.code.company.BGJSMY:
                            company2Name = company.companyName;
                            $.each(company.months, function (index, month) {
                                company2Data.push(month.totalNumber);
                            });
                            break;
                        case Config.code.company.NJBRGS:
                            company3Name = company.companyName;
                            $.each(company.months, function (index, month) {
                                company3Data.push(month.totalNumber);
                            });
                            break;
                        case Config.code.company.JSBGJM:
                            company4Name = company.companyName;
                            $.each(company.months, function (index, month) {
                                company4Data.push(month.totalNumber);
                            });
                            break;
                        case Config.code.company.SHBGXG:
                            company5Name = company.companyName;
                            $.each(company.months, function (index, month) {
                                company5Data.push(month.totalNumber);
                            });
                            break;
                        case Config.code.company.NTBGZP:
                            company6Name = company.companyName;
                            $.each(company.months, function (index, month) {
                                company6Data.push(month.totalNumber);
                            });
                            break;
                        case Config.code.company.SHBYZG:
                            company7Name = company.companyName;
                            $.each(company.months, function (index, month) {
                                company7Data.push(month.totalNumber);
                            });
                            break;
                        case Config.code.company.SHBGYT:
                            company8Name = company.companyName;
                            $.each(company.months, function (index, month) {
                                company8Data.push(month.totalNumber);
                            });
                            break;
                        case Config.code.company.WHBGYT:
                            company9Name = company.companyName;
                            $.each(company.months, function (index, month) {
                                company9Data.push(month.totalNumber);
                            });
                            break;
                        case Config.code.company.FSBGYT:
                            company10Name = company.companyName;
                            $.each(company.months, function (index, month) {
                                company10Data.push(month.totalNumber);
                            });
                            break;
                        case Config.code.company.BJBGYT:
                            company11Name = company.companyName;
                            $.each(company.months, function (index, month) {
                                company11Data.push(month.totalNumber);
                            });
                            break;
                    }
                });
                if(company1Name !="" && company1Data.length > 0){
                    lineChart1Series.push({
                        name: company1Name,
                        data: company1Data
                    });
                }
                if(company2Name !="" && company2Data.length > 0){
                    lineChart1Series.push({
                        name: company2Name,
                        data: company2Data
                    });
                }
                if(company3Name !="" && company3Data.length > 0){
                    lineChart1Series.push({
                        name: company3Name,
                        data: company3Data
                    });
                }
                if(company4Name !="" && company4Data.length > 0){
                    lineChart1Series.push({
                        name: company4Name,
                        data: company4Data
                    });
                }
                if(company5Name !="" && company5Data.length > 0){
                    lineChart1Series.push({
                        name: company5Name,
                        data: company5Data
                    });
                }
                if(company6Name != "" && company6Data.length > 0){
                    lineChart1Series.push({
                        name: company6Name,
                        data: company6Data
                    });
                }
                if(company7Name != "" && company7Data.length > 0){
                    lineChart2Series.push({
                        name: company7Name,
                        data: company7Data
                    });
                }
                if(company8Name != "" && company8Data.length > 0){
                    lineChart2Series.push({
                        name: company8Name,
                        data: company8Data
                    });
                }
                if(company9Name != "" && company9Data.length > 0){
                    lineChart2Series.push({
                        name: company9Name,
                        data: company9Data
                    });
                }
                if(company10Name != "" && company10Data.length > 0){
                    lineChart2Series.push({
                        name: company10Name,
                        data: company10Data
                    });
                }
                if(company11Name != "" && company11Data.length > 0){
                    lineChart2Series.push({
                        name: company11Name,
                        data: company11Data
                    });
                }

                if(company1Name != "" || company2Name != "" || company3Name != "" || company4Name != "" || company5Name != "" || company6Name != ""){
                    $("#turnover-line-chart1").show();
                    var lineChart1Options = lineOptions;
                    lineChart1Options.colors = [Config.highchartsColor.agingReport.range1, Config.highchartsColor.agingReport.range2,
                        Config.highchartsColor.agingReport.range3, Config.highchartsColor.agingReport.range4,
                        Config.highchartsColor.agingReport.range5, Config.highchartsColor.agingReport.range6],
                        lineChart1Options.chart.renderTo = "turnover-line-chart1";
                    lineChart1Options.xAxis.categories = categories;
                    lineChart1Options.series = lineChart1Series;
                    var lineChart1 = new Highcharts.Chart(lineChart1Options);
                }
                else{
                    $("#turnover-line-chart1").hide();
                }

                if(company7Name != "" || company8Name != "" || company9Name != "" || company10Name != "" || company11Name != ""){
                    $("#turnover-line-chart2").show();
                    var lineChart2Options = lineOptions;
                    lineChart2Options.colors = [Config.highchartsColor.agingReport.range1, Config.highchartsColor.agingReport.range2,
                        Config.highchartsColor.agingReport.range3, Config.highchartsColor.agingReport.range4,
                        Config.highchartsColor.agingReport.range5, Config.highchartsColor.agingReport.range6],
                        lineChart2Options.chart.renderTo = "turnover-line-chart2";
                    lineChart2Options.xAxis.categories = categories;
                    lineChart2Options.series = lineChart2Series;
                    var lineChart2 = new Highcharts.Chart(lineChart2Options);
                }
                else{
                    $("#turnover-line-chart2").hide();
                }
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

