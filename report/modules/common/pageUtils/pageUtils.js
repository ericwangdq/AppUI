/**
 * Created by Eric on 1/28/2015.
 */

define(['jquery','underscore','backbone',
        'utilities/session',
        'services/agent',
        'config/serverConfig',
        'config/config',
        'utils',
        'text!pageUtils/message.html',
        'text!pageUtils/refresh.html',
        'text!companyPanel'],
    function($, Underscore, Backbone,
             Session,
             Agent,
             ServerConfig,
             Config,
             Utils,
             MessageTemplate,
             RefreshTemplate,
             CompanyPanelTemplate) {

        'use strict';

        var PageUtils = {

            messageTemplate: _.template(MessageTemplate),

            refreshTemplate: _.template(RefreshTemplate),

            companyTemplate: _.template(CompanyPanelTemplate),

            isStorage: true,

            companies: null,

            message: function(el, message){
                var me = this;
                me.cleanMessage(el);
                el.append(me.messageTemplate({message: message}));

            },

            refresh: function(el, view, message){
                var me = this;
                me.cleanMessage(el);
                el.append(me.refreshTemplate({message:message, refresh: Config.refresh}));
                $(document).off('vclick','#refresh-link');
                $(document).on('vclick','#refresh-link',function(event){
                    event.preventDefault();
                    event.stopPropagation();
                    me.cleanMessage(el);
                    view.refresh();
                });
            },

            cleanMessage: function(el) {
                el.find("div.message").remove();
            },

            cleanAllMessage: function() {
                $("div.message").remove();
            },

            getCompanies: function(){
                var me = this;
                var postData = Utils.clone(ServerConfig.servicePostData.userCompanies);
                var ajaxOption = function(){
                    return {
                        success: function(result){
                            if(result != null && result.status != null && result.status == "1") {
                                if(result.data != null && typeof (result.data.status) != "undefined"
                                    && result.data.status != 1) {
                                    console.log(result.data.msg);
                                    me.companyError();
                                }
                                else{
                                    var companies = result.data.companyBeanList;
                                    if(companies != null && companies.length > 0){
                                        if(companies.length == 11){
                                            Session.set("isLeader", true);
                                        }else{
                                            Session.set("isLeader", false);
                                        }
                                        me.companies = companies;
                                        me.renderCompanyPanel(companies);
                                        Session.set("companyData", JSON.stringify(companies));
                                    }
                                    else {
                                        if($("#company-panel").length > 0) {
                                            $("#company-panel").html("<li  class=\"full\">" + Config.emptyData + "</li>");
                                        }
                                    }
                                }
                            }
                            else{
                                console.log(result.msg);
                                me.companyError();
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown){
                            console.log(JSON.stringify(jqXHR));
                            me.companyError();
                        }
                    }
                };

                var companyData = Session.get("companyData");
                if(me.isStorage && companyData != null) {
                    var companies = JSON.parse(companyData);
                    me.companies = companies;
                    me.renderCompanyPanel(companies);
                }
                else{
                    Agent.callServlet(
                        ServerConfig.agentServiceUrl,
                        postData,
                        ajaxOption()
                    );
                }
            },

            renderCompanyPanel: function(companies){
                $("#company-panel").empty();
                var htmlContent = "";
                if($("#company-panel").length > 0) {
                    if (companies != null && companies.length > 0) {
                        $.each(companies, function (index, company) {
                            htmlContent += "<li><a class=\"company\" href=\"javascript:void(0);\" data-attr=\"" + company.companyCode + "\">"
                                + company.companyName + "<span class=\"selected\"></span></a></li>";
                        });
                        htmlContent += "<li><a href=\"javascript:void(0);\" class=\"done\" data-transition=\"flow\">完成</a></li>";
                        $("#company-panel").html(htmlContent);
                    }
                    else {
                        $("#company-panel").html("<li>" + Config.emptyData + "</li>");
                    }
                }
            },

            companyError: function(){
                var me = this;
                if($("#company-panel").length > 0) {
                    $(document).off('vclick','#company-panel a.refresh');
                    $(document).on('vclick','#company-panel a.refresh',function(event){
                        event.preventDefault();
                        event.stopPropagation();
                        $("#company-panel").empty();
                        me.getCompanies();
                        //reopen panel to render position
                        $( "#popup-company" ).popup("close");
                        $( "#popup-company" ).popup("open",{
                            transition: "pop"
                        });
                    });
                    $("#company-panel").html("<li class=\"full\">" + Config.networkError +
                        "<a class=\"refresh\" href=\"javascript:void(0)\">点击刷新</a>" +"</li>");
                }
            }

        }

        return PageUtils;

    });