/**
 * Created by Eric on 12/24/2014.
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
        var EmailModel = Backbone.Model.extend({

            defaults : {
                subject: '',
                from: '',
                to: '',
                cc: '',
                content: '',
                attachments: []

            },

            sendEmail:function(){
                var me = this;
                var postData = ServerConfig.servicePostData.sendEmail;
                console.log(me.toJSON());
                postData.data = me.toJSON();
                Agent.callServlet(
                    ServerConfig.agentServiceUrl,
                    postData,
                    me.ajaxOption()
                );
            },

            ajaxOption: function(){

                var me = this;
                return {
                    success: function(data){
                        if(data.status == "1") {
                            var results = data.data.operateResultBean;
                            if (results != null && results.flag) {
                                console.log(JSON.stringify(results));
                                me.trigger('success', data.msg);
                            }
                            else if(results != null && !results.flag)
                            {
                                console.log(results.failReason);
                                me.trigger('error', results.failReason);
                            }
                        }
                        else{
                            console.log(data.msg);
                            me.trigger('error', data.msg);
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                        console.log(JSON.stringify(jqXHR));
                        me.trigger('error', Config.networkError );
                    }
                }
            }

        });

        return EmailModel;

    });