/**
 * Created by Eric on 1/20/2015.
 */
define(['jquery','underscore', 'backbone',
        'services/agent',
        'config/serverConfig',
        'config/config'],

    function($, _, Backbone,
             Agent,
             ServerConfig,
             Config){

        'use strict';

        /**
         * Model
         * @constructor
         * @private
         */
        var UserModel = Backbone.Model.extend({

            defaults : {
                groupbriefpath: '',
                mobile: '',
                logoUrl: '',
                isFriend: '',
                position: '',
                name: '',
                userVersion: '',
                addr: '',
                label: '',
                linkId: '',
                ypIntranet: '',
                ypMailLogo: '',
                type: '',
                tel: '',
                email: '',
                fax: ''
            },

            ajaxOption: function(){

                var me = this;

                return {
                    success: function(data){
                        if(data != null && typeof (data.status) != "undefined" && data.status == 1) {
                            var results = data.data.resultList;
                            if (results && results[0]) {
                                var person = results[0]
                                me.set({
                                    groupbriefpath: person.groupbriefpath,
                                    mobile: person.mobile,
                                    logoUrl: person.logoUrl,
                                    isFriend: person.isFriend,
                                    position: person.position,
                                    name: person.name,
                                    userVersion: person.userVersion,
                                    addr: person.addr,
                                    label: person.label,
                                    linkId: person.linkId,
                                    ypIntranet: person.ypIntranet,
                                    ypMailLogo: person.ypMailLogo,
                                    type: person.type,
                                    tel: person.tel,
                                    email: person.email,
                                    fax: person.fax
                                });
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

            userData: function(personId){
                var me = this;
                var postData = ServerConfig.servicePostData.queryUserInfo;
                postData.data.guid = personId;
                Agent.callWebService(
                    ServerConfig.agentServiceUrl,
                    JSON.stringify(postData),
                    me.ajaxOption()
                );
            },

            flag: false

        });

        return UserModel;

    })