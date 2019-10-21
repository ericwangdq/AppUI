/**
 * Created by Eric on 9/23/2014.
 */


define(['jquery','underscore', 'backbone',
        'utilities/session',
        'services/agent',
        'config/serverConfig',
        'config/config',
        'utils',
        'maincategory/maincategory-page/maincategory-model',
        'maincategory/maincategory-page/category-model',
        'maincategory/maincategory-page/category-collection',
        'json'],

    function($, _, Backbone,
             Session,
             Agent,
             ServerConfig,
             Config,
             Utils,
             MainCategoryModel,
             CategoryModel,
             CategoryCollection){

        'use strict';

        /**
         * Collection
         * @constructor
         * @private
         */
        var MainCategoryCollection = Backbone.Collection.extend({

            model: MainCategoryModel,

            isStorage: true,

            companyCode: null,

            reportDate: null,

            initialize: function(){

                var me = this;

            },

            ajaxOption: function(){

                var me = this;

                return {
                    success: function(result){
                        if(result != null && result.status != null && result.status == "1") {
                            if(result.data != null && typeof (result.data.status) != "undefined"
                                && result.data.status != 1) {
                                console.log(result.data.msg);
                                me.trigger('error', Config.networkError );
                            }
                            else{
                                var reports = result.data.categoryShowBeanList;
                                if (reports != null && reports.length > 0) {
                                    $.each(reports, function(index, mainCategory){

                                        var categories = new CategoryCollection();
                                        $.each(mainCategory.categoryBeanList, function(index, category){
                                            var categoryItem = new CategoryModel({
                                                categoryCode: category.categoryCode,
                                                categoryName: category.categoryName,
                                                totalNumber: Math.round(category.totalNumber) // keep int
                                            });
                                            categories.add(categoryItem);
                                        });
                                        var mainCategoryModel = new me.model({
                                            mainCategoryCode: mainCategory.categoryShowCode,
                                            mainCategoryName: mainCategory.categoryShowName,
                                            categories: categories
                                        });

                                        me.add(mainCategoryModel);
                                    });

                                    Session.set("mainCategoryData" + me.companyCode + me.reportDate, JSON.stringify(me));
                                    me.trigger('renderContent');

                                }
                                else {
                                    me.trigger('emptyData');
                                }
                            }
                        }
                        else{
                            console.log(result.msg);
                            me.trigger('error', Config.networkError);
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                        console.log(JSON.stringify(jqXHR));
                        me.trigger('error', Config.networkError);
                    }
                }
            },

            mainCategoryData: function(companyCode, reportDate){
                var me = this;
                me.companyCode = companyCode;
                me.reportDate = reportDate;
                var mainCategoryData = Session.get("mainCategoryData" + me.companyCode  + me.reportDate);

                if(me.isStorage && mainCategoryData != null){
                    var reports = JSON.parse(mainCategoryData);
                    $.each(reports, function(index, mainCategory){

                        var categories = new CategoryCollection();
                        $.each(mainCategory.categories, function(index, category){
                            var categoryItem = new CategoryModel({
                                categoryName: category.categoryName,
                                categoryCode: category.categoryCode,
                                totalNumber: category.totalNumber
                            });
                            categories.add(categoryItem);
                        });
                        var mainCategoryModel = new me.model({
                            mainCategoryCode: mainCategory.mainCategoryCode,
                            mainCategoryName: mainCategory.mainCategoryName,
                            categories: categories
                        });

                        me.add(mainCategoryModel);
                    });
                    me.trigger('renderContent');

                }else {
                    var postData = Utils.clone(ServerConfig.servicePostData.basicMainCategoryReport);
                    postData.attr.serviceName = ServerConfig.servicePostData.basicMainCategoryReport.attr.serviceName +
                        '/' + me.companyCode + '/' + me.reportDate;
                    Agent.callServlet(
                        ServerConfig.agentServiceUrl,
                        postData,
                        me.ajaxOption()
                    );
                }
            }

        });

        return MainCategoryCollection;

    });