/**
 * Created by Eric on 1/20/2015.
 */

define(['jquery','underscore', 'backbone',
        'utilities/session',
        'services/agent',
        'config/serverConfig',
        'config/config',
        'email/email-page/person-model'],

    function($, _, Backbone,
             Session,
             Agent,
             ServerConfig,
             Config,
             PersonModel){

        'use strict';

        /**
         * Collection
         * @constructor
         * @private
         */
        var PersonCollection = Backbone.Collection.extend({

            model: PersonModel,

            isStorage: true,

            groupGuid: null,

            initialize: function(){
                var me = this;

            },

            ajaxOption: function(){

                var me = this;

                return {
                    success: function(data){
                        if(data !=null && typeof (data.status) != "undefined" && data.status == 1) {
                            var results = data.data.resultList;
                            if (results) {
                                $.each(results, function (i, person) {
                                    var personModel = new me.model({
                                        coguPosition: person.coguPosition,
                                        coguGuid: person.coguGuid,
                                        coguName: person.coguName,
                                        coguCode: person.coguCode,
                                        isFriend: person.isFriend,
                                        coguPinyincn: person.coguPinyincn,
                                        coguPycn: person.coguPycn
                                    });
                                    me.add(personModel);
                                });

                                Session.set("personData" + me.groupGuid, JSON.stringify(me));
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

            personData: function(groupGuid){
                var me = this;
                me.groupGuid = groupGuid;
                var personData = Session.get("personData" + me.groupGuid);
                if(me.isStorage && personData != null) {
                    var persons = JSON.parse(personData);
                    $.each(persons, function (i, person) {
                        var personModel = new me.model({
                            coguPosition: person.coguPosition,
                            coguGuid: person.coguGuid,
                            coguName: person.coguName,
                            coguCode: person.coguCode,
                            isFriend: person.isFriend,
                            coguPinyincn: person.coguPinyincn,
                            coguPycn: person.coguPycn
                        });
                        me.add(personModel);
                    });

                    me.trigger('renderHtml');
                }else {
                    var postData = ServerConfig.servicePostData.queryPersonList;
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

        return PersonCollection;

    });