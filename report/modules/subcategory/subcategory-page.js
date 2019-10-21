/**
 * Created by Eric on 12/22/2014.
 */

define(['jquery','underscore', 'backbone',
        'utilities/session',
        'draw',
        'config/config',
        'utils',
        'pageUtils/pageUtils',
        'subcategory/subcategory-page/data-info-view',
        'subcategory/subcategory-page/subcategory-model',
        'subcategory/subcategory-page/subcategory-collection',
        'subcategory/subcategory-page/category-collection',
        'text!subcategory/subcategory-page/subcategory-page.html',
        'text!toolbar',
        'css!subcategory/common/css/subcategory-page.css'],

    function($, _, Backbone,
             Session,
             Draw,
             Config,
             Utils,
             PageUtils,
             DataInfoView,
             SubCategoryModel,
             SubCategoryCollection,
             CategoryCollection,
             SubCategoryPageTemplate,
             ToolbarHTML) {

        'use strict';

        var SubCategoryPage = Backbone.View.extend({

            model: null,

            template: _.template(SubCategoryPageTemplate + ToolbarHTML),

            companyCode: null,

            company: null,

            categoryCode: null,

            category: null,

            reportDate: null,

            mitDataInfoView: null,

            rmDataInfoView: null,

            fpDataInfoView: null,

            sitDataInfoView: null,

            wipDataInfoView: null,

            subCategoryCollection: null,

            mitCategoryModel: null,

            rmCategoryModel: null,

            fpCategoryModel: null,

            sitCategoryModel: null,

            wipCategoryModel: null,

            events: {
                'click #mit-sub-tab': 'addMITData',
                'click #rm-sub-tab': 'addRMData',
                'click #fp-sub-tab': 'addFPData',
                'click #sit-sub-tab': 'addSITData',
                'click #wip-sub-tab': 'addWIPData'
            },

            //用于创建el下的属性
            attributes: function() {
                return{
                    'data-role': 'page',
                    'class': 'layout no-footer',
                    'id': 'subcategory-page',
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
            },

            render: function(){
                var me = this;
                me.el.innerHTML = me.template();

            },

            fillData: function() {
                var me = this;
                //console.log("Basic sub category fillData: " + me.companyCode + " " + me.categoryCode + " " + me.reportDate);
                me.subCategoryCollection = new SubCategoryCollection();
                me.listenTo(me.subCategoryCollection, 'renderContent', me.renderContent);
                me.listenTo(me.subCategoryCollection, 'error', me.error);
                me.listenTo(me.subCategoryCollection, 'emptyData', me.emptyData);
                me.subCategoryCollection.subCategoryData(me.companyCode, me.reportDate);

            },

            renderCompleted: function(){
                var me = this;

                if(me.company != null && me.company != ""){
                    $("header.page-header .ui-title").text(me.company +'次类报表');
                }
                $("div.sub-data-container").width($(window).width()-5).height($(window).height()-108);
                PageUtils.cleanAllMessage();
                if(me.companyCode == Config.code.company.SHBGXG){
                    $("#sub-tabs ul.ui-tabs-nav").removeClass("ui-grid-c").addClass("ui-grid-d");
                    $("#sub-tabs").addClass("has-wip");
                    $("#wip-sub-tab").parent().show();
                }else {
                    $("#sub-tabs ul.ui-tabs-nav").removeClass("ui-grid-d").addClass("ui-grid-c");
                    $("#main-tabs").removeClass("has-wip");
                    $("#wip-sub-tab").parent().hide();
                }
                Draw.start('blue',[]);
            },

            activeCategory: function(){
                var me = this;
                $("#sub-tabs div.ui-navbar li > a").removeClass("ui-btn-active");
                switch (me.categoryCode){
                    case Config.code.basicCategory.MIT:
                        $("#mit-sub-tab").click().addClass("ui-btn-active");
                        break;
                    case Config.code.basicCategory.RM:
                        $("#rm-sub-tab").click().addClass("ui-btn-active");
                        break;
                    case Config.code.basicCategory.FP:
                        $("#fp-sub-tab").click().addClass("ui-btn-active");
                        break;
                    case Config.code.basicCategory.SIT:
                        $("#sit-sub-tab").click().addClass("ui-btn-active");
                        break;
                    case Config.code.basicCategory.WIP:
                        $("#wip-sub-tab").click().addClass("ui-btn-active");
                        break;
                    default:
                        $("#mit-sub-tab").click().addClass("ui-btn-active");
                }
            },

            renderContent: function() {
                var me = this;
                console.log("Basic sub category: " + me.companyCode + " " + me.category + " " + me.reportDate + JSON.stringify(me.subCategoryCollection));

                me.mitCategoryModel = new SubCategoryModel();
                me.rmCategoryModel = new SubCategoryModel();
                me.fpCategoryModel = new SubCategoryModel();
                me.sitCategoryModel = new SubCategoryModel();
                me.wipCategoryModel = new SubCategoryModel();

                $.each(me.subCategoryCollection.toJSON(), function(index, subCategory){
                    switch (subCategory.subCategoryCode) {
                        case Config.code.basicCategory.MIT:
                            me.mitCategoryModel = subCategory;
                            break;
                        case Config.code.basicCategory.RM:
                            me.rmCategoryModel = subCategory;
                            break;
                        case Config.code.basicCategory.FP:
                            me.fpCategoryModel = subCategory;
                            break;
                        case Config.code.basicCategory.SIT:
                            me.sitCategoryModel = subCategory;
                            break;
                        case Config.code.basicCategory.WIP:
                            me.wipCategoryModel = subCategory;
                            break;
                    }
                });

                if(me.mitCategoryModel.length == 0) {
                    me.emptyCategoryData("mit-sub");
                }

                if(me.rmCategoryModel.length == 0) {
                    me.emptyCategoryData("rm-sub");
                }

                if(me.fpCategoryModel.length == 0) {
                    me.emptyCategoryData("fp-sub");
                }

                if(me.sitCategoryModel.length == 0) {
                    me.emptyCategoryData("sit-sub");
                }

                if(me.wipCategoryModel.length == 0) {
                    me.emptyCategoryData("wip-sub");
                }

                me.activeCategory();
            },

            refresh:function(){
                var me = this;
                me.subCategoryCollection.subCategoryData(me.companyCode, me.reportDate);
            },

            error: function(message){
                var me = this;
                PageUtils.refresh(me.$el.find("div.generic-wrapper.ui-content"), me, "数据加载失败，" + message);
            },

            emptyData: function(){
                var me = this;
                PageUtils.message(me.$el.find("div.generic-wrapper.ui-content"), Config.emptyData);
            },

            emptyCategoryData: function(category){
                var me = this;
                PageUtils.message(me.$el.find("#" + category), Config.emptyData);
            },

            addMITData: function(){
                var me = this;
                me.mitDataInfoView = new DataInfoView();
                me.mitDataInfoView.fillData(me.$el, "#mit-sub", "mit-wrapper", me.mitCategoryModel);
                me.mitDataInfoView.renderCompleted();
            },

            addRMData: function(){
                var me = this;
                me.rmDataInfoView = new DataInfoView();
                me.rmDataInfoView.fillData(me.$el, "#rm-sub", "rm-wrapper", me.rmCategoryModel);
                me.rmDataInfoView.renderCompleted();
            },

            addFPData: function(){
                var me = this;
                me.fpDataInfoView = new DataInfoView();
                me.fpDataInfoView.fillData(me.$el, "#fp-sub", "fp-wrapper", me.fpCategoryModel);
                me.fpDataInfoView.renderCompleted();
            },

            addSITData: function(){
                var me = this;
                me.sitDataInfoView = new DataInfoView();
                me.sitDataInfoView.fillData(me.$el, "#sit-sub", "sit-wrapper", me.sitCategoryModel);
                me.sitDataInfoView.renderCompleted();
            },

            addWIPData: function(){
                var me = this;
                me.wipDataInfoView = new DataInfoView();
                me.wipDataInfoView.fillData(me.$el, "#wip-sub", "wip-wrapper", me.wipCategoryModel);
                me.wipDataInfoView.renderCompleted();
            }

        });

        return SubCategoryPage;

    });
