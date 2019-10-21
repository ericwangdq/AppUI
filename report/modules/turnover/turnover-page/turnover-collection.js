/**
 * Created by Eric on 9/23/2014.
 */


define(['jquery','underscore', 'backbone','utilities/session',
        'services/agent',
        'config/serverConfig',
        'config/config',
        'utils',
        'turnover/turnover-page/turnover-model',
        'turnover/turnover-page/company-model',
        'turnover/turnover-page/company-collection',
        'json'],

    function($, _, Backbone, Session, Agent,
             ServerConfig,
             Config,
             Utils,
             TurnoverModel,
             CompanyModel,
             CompanyCollection){

        'use strict';

        /**
         * Model
         * @constructor
         * @private
         */
        var TurnoverCollection = Backbone.Collection.extend({

            model: TurnoverModel,

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
                                var reports = result.data.materialTypeBeanList;
                                if (reports != null && reports.length > 0) {

                                    $.each(reports, function (index, item) {

                                        var companies = new CompanyCollection();
                                        $.each(item.companyBeanList, function (index, company) {
                                            var months = [];
                                            $.each(company.dateNumberBeanList, function (index, month) {
                                                var monthStr = month.issueDate;
                                                var monthName = Utils.toDate(monthStr).getMonth() + 1;
                                                months.push({
                                                    month: monthStr,
                                                    monthName: monthName.toString() + "月",
                                                    totalNumber: Math.round(month.totalNumber) // keep int
                                                });
                                            });
                                            var companyModel = new CompanyModel({
                                                companyCode: company.companyCode,
                                                companyName: company.companyName,
                                                months: months
                                            });
                                            companies.add(companyModel);
                                        });

                                        var turnoverModel = new me.model({
                                            categoryCode: item.materialTypeCode,
                                            categoryName: item.materialTypeName,
                                            companies: companies
                                        });

                                        me.add(turnoverModel);
                                    });

                                    Session.set("turnoverData" + me.reportDate, JSON.stringify(me));
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

            turnoverData: function(reportDate){
                var me = this;
                me.reportDate = reportDate;
                var turnoverData = Session.get("turnoverData" + me.reportDate)
                if(me.isStorage && turnoverData != null){
                    var reports=JSON.parse(turnoverData);
                    $.each(reports, function(index, category){

                        var companies = new CompanyCollection();
                        $.each(category.companies, function(index, company){
                            var months = [];
                            $.each(company.months, function(index, month){
                                months.push(month);
                            });
                            var companyModel = new CompanyModel({
                                companyCode: company.companyCode,
                                companyName: company.companyName,
                                months: months
                            });
                            companies.add(companyModel);
                        });

                        var turnoverModel = new me.model({
                            categoryCode: category.categoryCode,
                            categoryName: category.categoryName,
                            companies: companies
                        });

                        me.add(turnoverModel);
                    });
                    me.trigger('renderContent');

                }else {
                    var postData = Utils.clone(ServerConfig.servicePostData.turnoverReport);
                    postData.attr.serviceName = ServerConfig.servicePostData.turnoverReport.attr.serviceName + '/' + me.reportDate;
                    Agent.callServlet(
                        ServerConfig.agentServiceUrl,
                        postData,
                        me.ajaxOption()
                    );
                }
            }

        });

        return TurnoverCollection;

    });