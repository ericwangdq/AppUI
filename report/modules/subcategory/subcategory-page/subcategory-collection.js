/**
 * Created by Eric on 9/23/2014.
 */


define(['jquery','underscore', 'backbone',
        'utilities/session',
        'services/agent',
        'config/serverConfig',
        'config/config',
        'utils',
        'subcategory/subcategory-page/subcategory-model',
        'subcategory/subcategory-page/category-model',
        'subcategory/subcategory-page/category-collection',
        'json'],

    function($, _, Backbone,
             Session,
             Agent,
             ServerConfig,
             Config,
             Utils,
             SubCategoryModel,
             CategoryModel,
             CategoryCollection){

        'use strict';

        /**
         * Collection
         * @constructor
         * @private
         */
        var SubCategoryCollection = Backbone.Collection.extend({

            model: SubCategoryModel,

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
                                    $.each(reports, function(index, subCategory){

                                        var subCategories = new CategoryCollection();
                                        $.each(subCategory.categoryBeanList, function(index, category){
                                            var categories = [];
                                            $.each(category.subCategoryBeanList, function(index, item){
                                                categories.push({
                                                    thirdCategoryCode: item.thirdCategoryCode,
                                                    thirdCategoryName: item.subCategoryName,
                                                    totalNumber: Math.round(item.totalNumber) // keep int
                                                });
                                            });
                                            var categoryItem = new CategoryModel({
                                                categoryCode: category.categoryCode,
                                                categoryName: category.categoryName,
                                                totalNumber:  Math.round(category.totalNumber), // keep int
                                                categories: categories
                                            });
                                            subCategories.add(categoryItem);
                                        });
                                        var subCategoryModel = new me.model({
                                            subCategoryCode: subCategory.categoryShowCode,
                                            subCategoryName: subCategory.categoryShowName,
                                            totalNumber: Math.round(subCategory.totalNumber), // keep int
                                            subCategories: subCategories
                                        });

                                        me.add(subCategoryModel);
                                    });

                                    Session.set("subCategoryData" + me.companyCode + me.reportDate, JSON.stringify(me));
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

            subCategoryData: function(companyCode, reportDate){
                var me = this;
                me.companyCode = companyCode;
                me.reportDate = reportDate;
                var subCategoryData = Session.get("subCategoryData" + me.companyCode  + me.reportDate);
                if(me.isStorage && subCategoryData != null){
                    var reports = JSON.parse(subCategoryData);
                    $.each(reports, function(index, subCategory){

                        var subCategories = new CategoryCollection();
                        $.each(subCategory.subCategories, function(index, category){

                            var categoryItem = new CategoryModel({
                                categoryCode: category.categoryCode,
                                categoryName: category.categoryName,
                                totalNumber:  category.totalNumber,
                                categories: category.categories
                            });
                            subCategories.add(categoryItem);
                        });
                        var subCategoryModel = new me.model({
                            subCategoryCode: subCategory.subCategoryCode,
                            subCategoryName: subCategory.subCategoryName,
                            totalNumber: subCategory.totalNumber,
                            subCategories: subCategories
                        });

                        me.add(subCategoryModel);
                    });
                    me.trigger('renderContent');

                }else {
                    var postData = Utils.clone(ServerConfig.servicePostData.basicSubCategoryReport);
                    postData.attr.serviceName = ServerConfig.servicePostData.basicSubCategoryReport.attr.serviceName +
                        '/' + me.companyCode + '/' + me.reportDate;
                    Agent.callServlet(
                        ServerConfig.agentServiceUrl,
                        postData,
                        me.ajaxOption()
                    );
                }
            }

        });

        return SubCategoryCollection;

    });