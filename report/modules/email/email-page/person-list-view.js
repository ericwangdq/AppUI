/**
 * Created by Eric on 1/20/2015.
 */
define(['jquery','underscore', 'backbone',
        'email/email-page/person-collection',
        'email/email-page/person-item-view',
        'utils',
        'config/config'],

    function($, _, Backbone, PersonCollection,
             PersonItemView,
             Utils,
             Config) {

        'use strict';

        var PersonListView = Backbone.View.extend({

            model: null,

            subViewEl: "#email-page",

            tagName: 'ul',

            groupGuid: null,

            personCollection: null,

            users: null,

            events: {

            },
            //用于创建el下的属性
            attributes: function() {
                return{
                    'id': 'person-list',
                    'class': 'contacts'
                }
            },

            initialize: function() {

                var me = this;
                me.groupGuid = 0;
            },


            fillData: function(groupGuid, users) {

                var me = this;
                me.groupGuid = groupGuid;
                me.users = users;

                me.personCollection = new PersonCollection();

                me.listenTo(me.personCollection, 'add', me.addOne);

                me.listenTo(me.personCollection, 'reset', me.addAll);

                me.listenTo(me.personCollection, 'renderHtml', me.renderHtml);

                me.listenTo(me.personCollection, 'error', me.error);

                me.personCollection.personData(me.groupGuid);

            },

            refresh: function(){

                var me = this;
                $("#person-container").empty();
                me.personCollection.personData(me.groupGuid);
            },

            renderHtml: function(){

                var me = this;

                $(me.subViewEl).find('#person-container').append(me.el);
            },

            addOne: function(personModel, i){

                var me = this;
                //console.log(i.length);

                me.personItemView = new PersonItemView({model: personModel});
                me.personItemView.users = me.users;
                me.personItemView.render();

                me.$el.append(me.personItemView.el);
            },

            addAll: function(){
                var me = this;
                me.personCollection.each(me.addOne, me);
            },

            render: function(){

                var me = this;
            },

            error: function(message){

                var me = this;
                console.log("加载人员列表失败，" + message);
                var text = "加载人员列表失败，" + message;
                $("#person-container").empty();
                $(me.subViewEl).find('#person-container').append("<p class='message'>" + text +
                    "<a href=\"javascript:void(0)\" class=\"refresh\">"+ Config.refresh + "</a></p>");
                $(document).off("vclick", "#person-container a.refresh");
                $(document).on("vclick", "#person-container a.refresh", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    me.refresh();
                });
            }


        });

        return PersonListView;

    });

