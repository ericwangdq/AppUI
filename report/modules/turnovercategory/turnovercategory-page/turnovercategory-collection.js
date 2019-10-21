/**
 * Created by Eric on 9/23/2014.
 */


define(['jquery','underscore', 'backbone',
        'utilities/session',
        'services/agent',
        'config/serverConfig',
        'config/config',
        'utils',
        'turnovercategory/turnovercategory-page/turnovercategory-model',
        'json'],

    function($, _, Backbone,
             Session,
             Agent,
             ServerConfig,
             Config,
             Utils,
             TurnoverCategoryModel){

        'use strict';

        /**
         * Model
         * @constructor
         * @private
         */
        var TurnoverCategoryCollection = Backbone.Collection.extend({

            model: TurnoverCategoryModel,

            isStorage: true,

            companyCode: null,

            categoryCode: null,

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
                                var reports = result.data.categoryBeanList;
                                if (reports != null && reports.length > 0) {
                                    $.each(reports, function(index, category){

                                        var turnoverCategoryModel = new me.model({
                                            categoryCode: category.categoryCode,
                                            categoryName: category.categoryName,
                                            totalNumber: Math.round(category.totalNumber) // keep int
                                        });

                                        me.add(turnoverCategoryModel);
                                    });

                                    Session.set("turnoverCategoryData" + me.companyCode + me.categoryCode + me.reportDate, JSON.stringify(me));
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

            turnoverCategoryData: function(companyCode, categoryCode, reportDate){
                var me = this;
                me.companyCode = companyCode;
                me.categoryCode = categoryCode;
                me.reportDate = reportDate;
                var turnoverCategoryData = Session.get("turnoverCategoryData" + me.companyCode + me.categoryCode + me.reportDate);
                if(me.isStorage && turnoverCategoryData != null){
                    var reports = JSON.parse(turnoverCategoryData);
                    $.each(reports, function(index, category){

                        var turnoverCategoryModel = new me.model({
                            categoryCode: category.categoryCode,
                            categoryName: category.categoryName,
                            totalNumber: category.totalNumber
                        });

                        me.add(turnoverCategoryModel);
                    });
                    me.trigger('renderContent');

                }else {
                    var postData = Utils.clone(ServerConfig.servicePostData.turnoverCategoryReport);
                    postData.attr.serviceName = ServerConfig.servicePostData.turnoverCategoryReport.attr.serviceName +
                        '/' + me.companyCode + '/' + me.categoryCode + '/' + me.reportDate;
                    Agent.callServlet(
                        ServerConfig.agentServiceUrl,
                        postData,
                        me.ajaxOption()
                    );
                }
            }

        });

        return TurnoverCategoryCollection;

    });