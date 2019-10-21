/**
 * Created by Eric on 9/23/2014.
 */


define(['jquery',
        'underscore',
        'backbone',
        'utilities/session',
        'services/agent',
        'config/serverConfig',
        'config/config',
        'utils',
        'agingcategory/agingcategory-page/agingcategory-model'],

    function($,
             _,
             Backbone,
             Session ,
             Agent,
             ServerConfig,
             Config,
             Utils,
             AgingCategoryModel){

        'use strict';

        /**
         * Collection
         * @constructor
         * @private
         */
        var AgingCategoryCollection = Backbone.Collection.extend({

            model: AgingCategoryModel,

            isStorage: false,

            reportDate: null,

            companyCode: null,

            categoryCode: null,

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
                                var reports = result.data.categoryBeanList;;
                                if(reports != null && reports.length > 0){
                                    $.each(reports, function(index, category){
                                        var ranges = [];
                                        $.each(category.intervalBeanList, function(index, range){
                                            ranges.push({
                                                rangeCode: range.intervalCode,
                                                rangeName: range.intervalName,
                                                totalNumber: Math.round(range.totalNumber) // keep int
                                            });
                                        });
                                        var agingCategoryModel = new me.model({
                                            categoryCode: category.categoryCode,
                                            categoryName: category.categoryName,
                                            ranges: ranges
                                        });
                                        me.add(agingCategoryModel);
                                    });

                                    Session.set("agingCategoryData" + me.companyCode + me.categoryCode + me.reportDate, JSON.stringify(me));
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

            agingCategoryData: function(companyCode, category, reportDate) {
                var me = this;
                me.companyCode = companyCode;
                me.categoryCode = category;
                me.reportDate = reportDate;

                var agingCategoryData = Session.get("agingCategoryData" + me.companyCode + me.categoryCode + me.reportDate);
                if(me.isStorage && agingCategoryData != null) {
                    var reports = JSON.parse(agingCategoryData);
                    $.each(reports, function(index, category){
                        var agingCategoryModel = new me.model({
                            categoryCode: category.categoryCode,
                            categoryName: category.categoryName,
                            ranges: category.ranges
                        });
                        me.add(agingCategoryModel);
                    });
                }else {
                    var postData = Utils.clone(ServerConfig.servicePostData.agingCategoryReport);
                    postData.attr.serviceName = ServerConfig.servicePostData.agingCategoryReport.attr.serviceName + '/' + me.companyCode + '/' + me.categoryCode + '/' + me.reportDate;
                    Agent.callServlet(
                        ServerConfig.agentServiceUrl,
                        postData,
                        me.ajaxOption()
                    );
                }
            }

        });

        return AgingCategoryCollection;

    });