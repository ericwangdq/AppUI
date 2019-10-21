/**
 * Created by Eric on 1/20/2015.
 */
define(['jquery','underscore', 'backbone',
        'email/email-page/person-item-view',
        'email/email-page/person-model',
        'utils',
        'config/config'],

    function($, _, Backbone,
             PersonItemView,
             PersonModel,
             Utils,
             Config) {

        'use strict';

        var PersonListView = Backbone.View.extend({

            subViewEl: "#email-page",

            tagName: 'ul',

            personCollection: null,

            users: null,

            events: {

            },
            //用于创建el下的属性
            attributes: function() {
                return{
                    'id': 'recent-list',
                    'class': 'contacts'
                }
            },

            initialize: function() {

                var me = this;
                me.groupGuid = 0;
            },


            fillData: function(users, recentPersons) {

                var me = this;
                me.users = users;
                me.personCollection = recentPersons;
                if(recentPersons != null && recentPersons.length > 0) {
                    me.renderHtml();
                }
                else{
                    me.emptyData();
                }
            },

            refresh: function(){

                var me = this;
                $("#recent-container").empty();
                me.renderHtml();

            },

            renderHtml: function(){
                var me = this;
                $.each(me.personCollection, function(index, person){
                    me.addOne(person);
                });

                $(me.subViewEl).find('#recent-container').append(me.el);
            },

            addOne: function(person){

                var me = this;
                var personModel = new PersonModel({
                    coguPosition: person.position,
                    coguGuid: person.label,
                    coguName: person.name,
                    coguCode: person.label,
                    isFriend: "0",
                    coguPinyincn: person.email,
                    coguPycn: person.email
                });
                me.personItemView = new PersonItemView({model: personModel});
                me.personItemView.users = me.users;
                me.personItemView.render();

                me.$el.append(me.personItemView.el);
            },

            render: function(){

                var me = this;
            },

            error: function(message){

                var me = this;
                console.log("加载常用联系人列表失败，" + message);
                var text = "加载常用联系人列表失败，" + message;
                $("#person-container").empty();
                $(me.subViewEl).find('#recent-container').append("<p class='message'>" + text +
                    "<a href=\"javascript:void(0)\" class=\"refresh\">"+ Config.refresh + "</a></p>");
                $(document).off("vclick", "#person-container a.refresh");
                $(document).on("vclick", "#person-container a.refresh", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    me.refresh();
                });
            },

            emptyData: function(){
                var me = this;
                $(me.subViewEl).find('#recent-container').append("<p class='message'>常用联系人为空</p>");
            }


        });

        return PersonListView;

    });

