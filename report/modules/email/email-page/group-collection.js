/**
 * Created by Eric on 1/20/2015.
 */

define(['jquery','underscore', 'backbone',
        'utilities/session',
        'services/agent',
        'config/serverConfig',
        'config/config',
        'email/email-page/group-model'],

    function($, _, Backbone,
             Session,
             Agent,
             ServerConfig,
             Config,
             GroupModel){

        'use strict';

        /**
         * Collection
         * @constructor
         * @private
         */
        var GroupCollection = Backbone.Collection.extend({

            model: GroupModel,

            isStorage: true,

            groupGuid: null,

            initialize: function(){
                var me = this;

            },

            ajaxOption: function(){

                var me = this;

                return {
                    success: function(data){
                        if(data != null && typeof (data.status) != "undefined" && data.status == 1) {
                            var results = data.data.resultList;
                            if (results) {
                                $.each(results, function (i, group) {
                                    var groupModel = new me.model({
                                        cogrGuid: group.cogrGuid,
                                        cogrName: group.cogrName,
                                        cogrSubset: group.cogrSubset

                                    });

                                    me.add(groupModel);
                                });

                                Session.set("groupData" + me.groupGuid, JSON.stringify(me));
                                me.trigger('renderHtml');
                            }
                        }
                        else{
                            me.trigger('error', Config.networkError);
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                        console.log(JSON.stringify(jqXHR));
                        me.trigger('error', Config.networkError);
                    }
                }
            },


            groupData: function(groupGuid){
                var me = this;
                me.groupGuid = groupGuid;
                var groupData = Session.get("groupData" + me.groupGuid);
                if(me.isStorage && groupData != null) {
                    var groups = JSON.parse(groupData);
                    $.each(groups, function (i, group) {
                        var groupModel = new me.model({
                            cogrGuid: group.cogrGuid,
                            cogrName: group.cogrName,
                            cogrSubset: group.cogrSubset

                        });
                        me.add(groupModel);
                    });

                    me.trigger('renderHtml');
                }else {
                    var postData = ServerConfig.servicePostData.queryGroupList;
                    if (me.groupGuid == "0") {
                        postData.data.groupGuid = "BSEC";
                    }
                    else {
                        postData.data.groupGuid = me.groupGuid;
                    }
                    Agent.callWebService(
                        ServerConfig.agentServiceUrl,
                        JSON.stringify(postData),
                        me.ajaxOption()
                    );
                }
            }

        });

        return GroupCollection;

    });