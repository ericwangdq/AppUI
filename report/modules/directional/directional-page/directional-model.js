/**
 * Created by Eric on 12/22/2014.
 */

define(['jquery','underscore', 'backbone',
        'utilities/session',
        'services/agent',
        'config/serverConfig',
        'config/config',
        'utils',
        'directional/directional-page/directional-model',
        'json'],

    function($, _, Backbone,
             Session,
             Agent,
             ServerConfig,
             Config,
             Utils){

        'use strict';

        /**
         * Model
         * @constructor
         * @private
         */
        var DirectionalModel = Backbone.Model.extend({

            isStorage: true,

            companyCode: null,

            categoryCode: null,

            reportDate: null,

            defaults : {
                totalNumber: 0,
                customers: []
            },

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
                                var reports = result.data.customerBeanList;
                                if (reports != null && reports.length > 0) {
                                    me.set({
                                        totalNumber: Math.round(result.data.totalNumber), // keep int
                                        customers: reports
                                    });

                                    Session.set("directionalData" + me.companyCode + me.categoryCode + me.reportDate, JSON.stringify(me));
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

            directionalData: function(companyCode, categoryCode, reportDate){
                var me = this;
                me.companyCode = companyCode;
                me.categoryCode = categoryCode;
                me.reportDate = reportDate;
                var subCategoryData = Session.get("directionalData" + me.companyCode + me.categoryCode + me.reportDate);
                if(me.isStorage && subCategoryData != null) {
                    var reports = JSON.parse(subCategoryData);
                    me.set({
                        totalNumber: reports.totalNumber,
                        customers: reports.customers
                    });
                    me.trigger('renderContent');

                }else {
                    var postData = Utils.clone(ServerConfig.servicePostData.basicDirectionalReport);
                    postData.attr.serviceName = ServerConfig.servicePostData.basicDirectionalReport.attr.serviceName +
                        '/' + me.companyCode + '/' + me.categoryCode +'/' + me.reportDate;
                    Agent.callServlet(
                        ServerConfig.agentServiceUrl,
                        postData,
                        me.ajaxOption()
                    );
                }
            }

        });

        return DirectionalModel;

    });