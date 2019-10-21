/**
 * Created by Eric on 9/23/2014.
 */


define(['jquery','underscore', 'backbone',
        'utilities/session',
        'services/agent',
        'config/serverConfig',
        'config/config',
        'utils',
        'home/home-page/home-model',
        'home/home-page/group-model',
        'home/home-page/category-collection',
        'home/home-page/category-model'],

    function($, _, Backbone,
             Session,
             Agent,
             ServerConfig,
             Config,
             Utils,
             HomeModel,
             GroupModel,
             CategoryCollection,
             CategoryModel){

        'use strict';

        /**
         * Collection
         * @constructor
         * @private
         */
        var HomeCollection = Backbone.Collection.extend({

            model: HomeModel,

            groupData: null,

            isStorage: true,

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
                                var reports = result.data.basicReport;
                                if(reports != null && reports.length > 0){
                                    if(reports.length == 11){
                                        Session.set("isLeader", true);
                                    }else{
                                        Session.set("isLeader", false);
                                    }
                                    me.groupData = new GroupModel({
                                        groups: result.data.companyGroupListBean.companyGroupBeanList,
                                        categoryTotal: result.data.companyGroupListBean.categoryShowBeanList
                                    });
                                    $.each(reports, function(index, company){
                                        var categories = new CategoryCollection();
                                        $.each(company.categoryShowBeanList, function(index, category){
                                            var categoryItem = new CategoryModel({
                                                categoryCode: category.categoryShowCode,
                                                categoryName: category.categoryShowName,
                                                totalNumber: Math.round(category.totalNumber) // keep int
                                            });
                                            categories.add(categoryItem);
                                        });
                                        var homeModel = new me.model({
                                            companyCode: company.companyCode,
                                            companyName: company.companyName,
                                            categories: categories
                                        });
                                        //homeModel.set({categories : categories});
                                        me.add(homeModel);
                                    });

                                    Session.set("groupData" + me.reportDate, JSON.stringify(me.groupData));
                                    Session.set("homeData" + me.reportDate, JSON.stringify(me));
                                    me.trigger('renderContent');
                                }
                                else {
                                    me.trigger('emptyData');
                                }
                            }
                        }
                        else{
                            console.log(result.msg);
                            me.trigger('error', Config.networkError );
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                        console.log(JSON.stringify(jqXHR));
                        me.trigger('error', Config.networkError);
                    }
                }
            },

            homeData: function(reportDate){
                var me = this;
                me.reportDate = reportDate;
                var homeData = Session.get("homeData" + me.reportDate);
                var groupData = Session.get("groupData" + me.reportDate);
                if(me.isStorage && homeData != null && groupData != null){
                    var reports = JSON.parse(homeData);
                    var groupReports = JSON.parse(groupData);
                    $.each(reports, function(index, company){
                        var categories = new CategoryCollection();
                        $.each(company.categories, function(index, category){
                            var categoryItem = new CategoryModel({
                                categoryCode: category.categoryCode,
                                categoryName: category.categoryName,
                                totalNumber: category.totalNumber
                            });
                            categories.add(categoryItem);
                        });
                        var homeModel = new me.model({
                            companyCode: company.companyCode,
                            companyName: company.companyName,
                            categories: categories
                        });
                        me.add(homeModel);
                    });
                    me.groupData = new GroupModel({
                        groups: groupReports.groups,
                        categoryTotal: groupReports.categoryTotal
                    });
                    me.trigger('renderContent');

                }else {
                    var postData = Utils.clone(ServerConfig.servicePostData.basicReport);
                    postData.attr.serviceName = ServerConfig.servicePostData.basicReport.attr.serviceName + '/' + me.reportDate;
                    Agent.callServlet(
                        ServerConfig.agentServiceUrl,
                        postData,
                        me.ajaxOption()
                    );
                }
            }

        });

        return HomeCollection;

    });