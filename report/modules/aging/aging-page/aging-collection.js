/**
 * Created by Eric on 9/23/2014.
 */


define(['jquery','underscore', 'backbone',
        'utilities/session',
        'services/agent',
        'config/serverConfig',
        'config/config',
        'utils',
        'aging/aging-page/aging-model',
        'aging/aging-page/range-model',
        'aging/aging-page/range-collection',
        'aging/aging-page/company-model',
        'aging/aging-page/company-collection'],

    function($, _, Backbone,
             Session,
             Agent,
             ServerConfig,
             Config,
             Utils,
             AgingModel,
             RangeModel,
             RangeCollection,
             CompanyModel,
             CompanyCollection){

        'use strict';

        /**
         * Collection
         * @constructor
         * @private
         */
        var AgingCollection = Backbone.Collection.extend({

            model: AgingModel,

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
                                var reports = result.data.materialTypeBeanList;;
                                if(reports != null && reports.length > 0){
                                    $.each(reports, function(index, item){

                                        var companies = new CompanyCollection();
                                        $.each(item.companyAgeBeanList, function(index, company){
                                            var ranges = new RangeCollection();
                                            $.each(company.intervalBeanList, function(index, range){
                                                var rangeModel = new RangeModel({
                                                    rangeCode: range.intervalCode,
                                                    rangeName: range.intervalName ,
                                                    totalNumber: Math.round(range.totalNumber) // keep 00.00
                                                });
                                                ranges.add(rangeModel);
                                            });
                                            var companyModel = new CompanyModel({
                                                companyCode: company.companyCode,
                                                companyName: company.companyName ,
                                                ranges: ranges
                                            });
                                            companies.add(companyModel);
                                        });

                                        var agingModel = new me.model({
                                            categoryCode: item.materialTypeCode,
                                            categoryName: item.materialTypeName,
                                            companies: companies
                                        });

                                        me.add(agingModel);
                                    });
                                    Session.set("agingData" + me.reportDate, JSON.stringify(me));
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

            agingData: function(reportDate){
                var me = this;
                me.reportDate = reportDate;
                var agingData = Session.get("agingData" + me.reportDate);
                if(me.isStorage && agingData != null){
                    var reports = JSON.parse(agingData);
                    $.each(reports, function(index, item){
                        var companies = new CompanyCollection();
                        $.each(item.companies, function(index, company){
                            var ranges = new RangeCollection();
                            $.each(company.ranges, function(index, range){
                                var rangeModel = new RangeModel({
                                    rangeCode: range.rangeCode,
                                    rangeName: range.rangeName ,
                                    totalNumber: range.totalNumber
                                });
                                ranges.add(rangeModel);
                            });
                            var companyModel = new CompanyModel({
                                companyCode: company.companyCode,
                                companyName: company.companyName ,
                                ranges: ranges
                            });
                            companies.add(companyModel);
                        });
                        var agingModel = new me.model({
                            categoryCode: item.categoryCode,
                            categoryName: item.categoryName,
                            companies: companies
                        });

                        me.add(agingModel);
                    });

                    me.trigger('renderContent');
                }else {
                    var postData = Utils.clone(ServerConfig.servicePostData.agingReport);
                    postData.attr.serviceName = ServerConfig.servicePostData.agingReport.attr.serviceName + '/' + me.reportDate;
                    Agent.callServlet(
                        ServerConfig.agentServiceUrl,
                        postData,
                        me.ajaxOption()
                    );
                }
            }

        });

        return AgingCollection;

    });