/**
 * Created by Eric on 1/13/2015.
 */

define(['jquery','underscore', 'backbone',
        'draw',
        'utilities/session',
        'config/config',
        'utils',
        'pageUtils/pageUtils',
        'subaging/subaging-page/subaging-model',
        'subaging/subaging-page/subaging-collection',
        'text!subaging/subaging-page/subaging-page.html',
        'text!toolbar',
        'subaging/subaging-page/data-info-view',
        'subaging/subaging-page/bar-info-view',
        'iscrollProbe',
        'highcharts/highcharts',
        'css!subaging/common/css/subaging-page.css'],

    function($, _, Backbone,
             Draw,
             Session,
             Config,
             Utils,
             PageUtils,
             SubAgingModel,
             SubAgingCollection,
             SubAgingPageTemplate,
             ToolbarHTML,
             DataInfoView,
             BarInfoView) {

        'use strict';

        var SubAgingPage = Backbone.View.extend({

            model: null,

            template: _.template(SubAgingPageTemplate + ToolbarHTML),

            dataInfoView: null,

            barInfoView: null,

            subAgingCollection: null,

            originalSubAgingCollection: null,

            rangeCollection: null,

            originalRangeCollection: null,

            category: null,

            categoryCode: null,

            reportDate: null,

            company: null,

            companyCode: null,

            events: {
                'click #data-info-tab': 'addDataInfo',
                'click #bar-info-tab': 'addBarInfo'
            },

            //用于创建el下的属性
            attributes: function() {
                return{
                    'data-role': 'page',
                    'class': 'layout no-footer',
                    'id': 'subaging-page',
                    'data-theme': 'metal'
                }
            },

            initialize: function() {
                var me = this;

                me.categoryCode = Config.code.category.M1;
            },

            urlParams: function(params) {
                var me = this;
                me.companyCode = params[0];
                me.company = Config.getCompanyName(me.companyCode);
                me.reportDate = params[1];
            },

            render: function(){
                var me = this;
                me.el.innerHTML = me.template();

                $(document).off("vclick", "#subaging-page .mc-link a");
                $(document).on("vclick", "#subaging-page .mc-link a", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    window.location.href = "#page/agingcategory/" + me.companyCode + "/" + me.categoryCode + "/" + me.reportDate;
                });

                $(document).off("change", "#subaging-page #category-value");
                $(document).on("change", "#subaging-page #category-value", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    me.categoryCode = $(this).val();
                    me.category = Config.getCategoryName(me.categoryCode);
                    console.log(me.categoryCode + ": " + me.category);
                    me.filterCategory();
                    me.refreshView();
                });
            },

            fillData: function() {
                var me = this;
                //console.log("Sub Aging fillData: " + me.companyCode + " " + me.reportDate);
                me.subAgingCollection = new SubAgingCollection();
                me.listenTo(me.subAgingCollection, 'renderContent', me.renderContent);
                me.listenTo(me.subAgingCollection, 'error', me.error);
                me.listenTo(me.subAgingCollection, 'emptyData', me.emptyData);
                me.subAgingCollection.subAgingData(me.companyCode, me.reportDate);
            },

            renderContent: function(){
                var me = this;
                //console.log("SubAging RenderContent collection: " + JSON.stringify(me.subAgingCollection.toJSON()));
                me.originalSubAgingCollection = me.subAgingCollection.clone();
                me.filterCategory();
                me.refreshView();
            },

            refresh:function(){
                var me = this;
                me.subAgingCollection.subAgingData(me.companyCode, me.reportDate);
            },

            error: function(message){
                var me = this;
                PageUtils.refresh(me.$el.find("div.generic-wrapper.ui-content"), me, "数据加载失败，" + message);
            },

            emptyData: function(){
                var me = this;
                PageUtils.message(me.$el.find("div.generic-wrapper.ui-content"), Config.emptyData);
            },

            renderCompleted: function() {
                var me = this;

                $("div.page-footer a.ui-btn").removeClass("ui-btn-active");
                $("div.page-footer a.aging").addClass("ui-btn-active");

                if(me.companyCode != null && me.companyCode != "")
                {
                    $("#category-value").empty();
                    $("header.page-header .ui-title").text(me.company +'库龄分析报表');
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

                    if(me.categoryCode != null && me.categoryCode != ""){
                        if(me.categoryCode == "m3" && me.companyCode != Config.code.company.SHBGXG) {
                            me.categoryCode = Config.code.category.M1;
                        }
                        $("#category-value").val(me.categoryCode);
                    }
                }

                //refresh
                $("#date-value").selectmenu('refresh');
                $("#category-value").selectmenu('refresh');

                Draw.start('blue',[]);
            },

            filterCategory: function(){
                var me = this;

                console.log("Sub aging filter category: " + me.categoryCode);
                var category = me.subAgingCollection.filter(function(categories){
                    return categories.get('categoryCode') === me.categoryCode;
                });

                var categoryJSON = new Backbone.Collection(category).toJSON();
                if(categoryJSON != null && categoryJSON.length > 0){
                    me.rangeCollection  = categoryJSON[0].ranges;
                }else
                {
                    me.rangeCollection  = [];
                }
                //me.originalMonthCollection = me.monthCollection.clone();
                me.originalRangeCollection = me.rangeCollection;
                //console.log("SubAging RenderContent range collection: " + me.category + "   " + JSON.stringify(me.rangeCollection));
            },

            addDataInfo: function(){
                var me = this;
                $('#data-info-tab').addClass("tab-active");
                $('#bar-info-tab').removeClass('tab-active').removeClass('ui-btn-active');
                me.renderDataInfo();
                return false;
            },

            addBarInfo: function(){
                var me = this;
                $('#bar-info-tab').addClass("tab-active");
                $('#data-info-tab').removeClass('tab-active').removeClass('ui-btn-active');
                me.renderBarInfo();
                return false;
            },

            renderDataInfo: function(){
                var me = this;
                me.dataInfoView = new DataInfoView();
                me.dataInfoView.fillData(me.$el, me.rangeCollection.toJSON());
                //me.$el.find('#data-info').html(me.dataInfoView.el);
                //me.dataInfoView.renderContent();
                me.dataInfoView.renderCompleted();
            },

            renderBarInfo: function(){
                var me = this;
                me.barInfoView = new BarInfoView();
                me.barInfoView.fillData(me.$el, me.rangeCollection.toJSON());
                me.$el.find('#bar-info').html(me.barInfoView.el);
                //console.log("Sub aging renderBarInfo");
                me.barInfoView.renderCompleted();
            },

            refreshView:function(){
                var me = this;

                if($("#data-info").attr("aria-expanded") == "true"){
                    me.renderDataInfo();
                }
                else if($("#bar-info").attr("aria-expanded") == "true"){
                    me.renderBarInfo();
                }
                else
                {
                    me.renderBarInfo();
                    me.renderDataInfo();
                }
            }
        });

        return SubAgingPage;

    });

