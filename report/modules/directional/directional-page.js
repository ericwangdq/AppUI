/**
 * Created by Eric on 12/22/2014.
 */

define(['jquery','underscore', 'backbone',
        'utilities/session',
        'draw',
        'config/config',
        'utils',
        'pageUtils/pageUtils',
        'directional/directional-page/data-info-view',
        'directional/directional-page/directional-model',
        'text!directional/directional-page/directional-page.html',
        'text!toolbar',
        'iscrollProbe',
        'css!directional/common/css/directional-page.css'],

    function($, _, Backbone,
             Session,
             Draw,
             Config,
             Utils,
             PageUtils,
             DataInfoView,
             DirectionalModel,
             DirectionalPageTemplate,
             ToolbarHTML) {

        'use strict';

        var DirectionalPage = Backbone.View.extend({

            model: null,

            pageTitle: null,

            template: _.template(DirectionalPageTemplate + ToolbarHTML),

            dataInfoView: null,

            companyCode: null,

            company: null,

            categoryCode: null,

            category: null,

            reportDate: null,

            directionalModel: null,

            //用于创建el下的属性
            attributes: function() {
                return{
                    'data-role': 'page',
                    'class': 'layout no-footer',
                    'id': 'directional-page',
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
                me.isRefresh = true;
            },

            render: function(){
                var me = this;
                me.el.innerHTML = me.template();
            },

            fillData: function() {
                var me = this;

                console.log("Basic directional fillData: " + me.companyCode + " " + me.categoryCode + " " + me.reportDate);
                me.directionalModel = new DirectionalModel();
                me.listenTo(me.directionalModel, 'renderContent', me.renderContent);
                me.listenTo(me.directionalModel, 'error', me.error);
                me.listenTo(me.directionalModel, 'emptyData', me.emptyData);
                me.directionalModel.directionalData(me.companyCode, me.categoryCode, me.reportDate);
            },

            renderCompleted: function(){
                var me = this;
                if(me.company != null && me.company != ""){
                    $("header.page-header .ui-title").text(me.company + me.category +'定向报表');
                }

                Draw.start('blue',[]);
                $("#data-info").empty();
                PageUtils.cleanAllMessage();
            },

            renderContent: function() {
                var me = this;
                console.log("Basic sub category: " + me.companyCode + " " + me.category + " "
                    + me.reportDate + JSON.stringify(me.directionalModel));

                me.AddDataInfo();
            },

            refresh:function(){
                var me = this;
                me.directionalModel.directionalData(me.companyCode, me.reportDate);
            },

            error: function(message){
                var me = this;
                PageUtils.refresh(me.$el.find("div.generic-wrapper.ui-content"), me, "数据加载失败，" + message);
            },

            emptyData: function(){
                var me = this;
                PageUtils.message(me.$el.find("div.generic-wrapper.ui-content"), Config.emptyData);
            },

            AddDataInfo: function(){
                var me = this;
                me.dataInfoView = new DataInfoView();
                me.dataInfoView.fillData(me.$el, me.directionalModel);
                me.dataInfoView.renderCompleted();
            }

        });

        return DirectionalPage;

    });
