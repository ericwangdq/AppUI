/**
 * Created by Eric on 9/23/2014.
 */


define(['jquery','underscore', 'backbone',
        'utilities/session',
        'services/agent',
        'config/serverConfig',
        'config/config',
        'utils',
        'subaging/subaging-page/subaging-model',
        'subaging/subaging-page/range-model',
        'subaging/subaging-page/range-collection'],

    function($, _, Backbone, Session,
             Agent,
             ServerConfig,
             Config,
             Utils,
             SubAgingModel,
             RangeModel,
             RangeCollection){

        'use strict';

        /**
         * Home Model
         * @constructor
         * @private
         */
        var SubAgingCollection = Backbone.Collection.extend({

            model: SubAgingModel,

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
                                var reports = result.data.materialTypeCBeanList;
                                if(reports != null && reports.length > 0){
                                    $.each(reports, function(index, item){
                                        var ranges = new RangeCollection();
                                        $.each(item.intervalCBeanList, function(index, range){
                                            var months = [];
                                            $.each(range.dateNumberBeanList, function(index, month){
                                                var monthStr = month.issueDate;
                                                var monthName = monthStr.length > 7 ?
                                                    monthStr.substring(0,7) : monthStr;
                                                var monthNumber= Utils.toDate(monthStr).getMonth() + 1;
                                                months.push({
                                                    month: monthStr,
                                                    monthName: monthName,
                                                    monthNumber: monthNumber.toString() + "月",
                                                    totalNumber: Math.round(month.totalNumber) // keep int
                                                });
                                            });
                                            var rangeModel = new RangeModel({
                                                rangeCode: range.intervalCode,
                                                rangeName: range.intervalName ,
                                                months: months
                                            });
                                            ranges.add(rangeModel);
                                        });

                                        var subAgingModel = new me.model({
                                            categoryCode: item.materialTypeCode,
                                            categoryName: item.materialTypeName,
                                            ranges: ranges
                                        });

                                        me.add(subAgingModel);
                                    });

                                    Session.set("subAgingData" + me.companyCode + me.reportDate, JSON.stringify(me));
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

            subAgingData: function(companyCode, reportDate){
                var me = this;
                me.companyCode = companyCode;
                me.reportDate = reportDate;
                var subAgingData = Session.get("subAgingData" + me.companyCode + me.reportDate);
                if(me.isStorage && subAgingData != null){
                    var reports = JSON.parse(subAgingData);
                    $.each(reports, function(index, item){
                        var ranges = new RangeCollection();
                        $.each(item.ranges, function(index, range){
                            var rangeModel = new RangeModel({
                                rangeCode: range.rangeCode,
                                rangeName: range.rangeName ,
                                months: range.months
                            });
                            ranges.add(rangeModel);
                        });

                        var subAgingModel = new me.model({
                            categoryCode: item.categoryCode,
                            categoryName: item.categoryName,
                            ranges: ranges
                        });
                        me.add(subAgingModel);
                    });
                    me.trigger('renderContent');
                }else {
                    var postData = Utils.clone(ServerConfig.servicePostData.agingCompanyReport);
                    postData.attr.serviceName = ServerConfig.servicePostData.agingCompanyReport.attr.serviceName + '/'  + me.companyCode + '/' + me.reportDate;
                    Agent.callServlet(
                        ServerConfig.agentServiceUrl,
                        postData,
                        me.ajaxOption()
                    );
                }
            }

        });

        return SubAgingCollection;

    });