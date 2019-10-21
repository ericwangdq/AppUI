/**
 * Created by Eric on 1/30/2015.
 */

define(['jquery','underscore',
        'backbone',
        'utilities/session',
        'services/agent',
        'config/serverConfig',
        'config/config',
        'utils',
        'subreport/subreport-page/subreport-model',
        'subreport/subreport-page/unit-model',
        'subreport/subreport-page/unit-collection'],

    function($, _, Backbone, Session,
             Agent,
             ServerConfig,
             Config,
             Utils,
             SubReportModel,
             UnitModel,
             UnitCollection){

        'use strict';

        /**
         * Collection
         * @constructor
         * @private
         */
        var SubReportCollection = Backbone.Collection.extend({

            model: SubReportModel,

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
                                    $.each(reports, function (index, category) {

                                        var units = new UnitCollection();
                                        $.each(category.unitBeanList, function(index, unit){
                                            var months = [];
                                            $.each(unit.dateNumberBeanList, function(index, month){
                                                var monthStr = month.issueDate;
                                                var monthName = Utils.toDate(monthStr).getMonth() + 1;
                                                months.push({
                                                    month: monthStr,
                                                    monthName: monthName.toString() + "月",
                                                    totalNumber: Math.round(month.totalNumber) // keep int
                                                });
                                            });
                                            var unitModel = new UnitModel({
                                                unitCode: unit.unitCode,
                                                unitName: unit.unitName,
                                                months: months
                                            });
                                            units.add(unitModel);
                                        });

                                        var subreportModel = new me.model({
                                            categoryCode: category.categoryShowCode,
                                            categoryName: category.categoryShowName,
                                            units: units
                                        });

                                        me.add(subreportModel);
                                    });

                                    Session.set("subreportData" + me.companyCode + me.reportDate, JSON.stringify(me));
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

            subReportData: function(companyCode, reportDate) {
                var me = this;
                me.companyCode = companyCode;
                me.reportDate = reportDate;

                var subReportData = Session.get("subReportData" + me.companyCode + me.reportDate);
                if(subReportData != null){
                    var reports = JSON.parse(subReportData);
                    $.each(reports, function (index, category) {
                        var units = new UnitCollection();
                        $.each(category,units, function(index, unit){
                            var unitModel = new UnitModel({
                                unitCode: unit.unitCode,
                                unitName: unit.unitName,
                                months: unit.months
                            });
                            units.add(unitModel);
                        });

                        var subreportModel = new me.model({
                            categoryCode: category.categoryCode,
                            categoryName: category.categoryName,
                            units: units
                        });

                        me.add(subreportModel);
                    });

                    me.trigger('renderContent');

                }else {
                    var postData = Utils.clone(ServerConfig.servicePostData.basicCompanyReport);
                    postData.attr.serviceName = ServerConfig.servicePostData.basicCompanyReport.attr.serviceName + '/' + me.companyCode + '/' + me.reportDate;
                    Agent.callServlet(
                        ServerConfig.agentServiceUrl,
                        postData,
                        me.ajaxOption()
                    );

                }
            }

        });

        return SubReportCollection;

    });