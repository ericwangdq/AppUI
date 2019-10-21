/**
 * Created by Eric on 1/20/2015.
 */
define(['jquery','underscore', 'backbone',
        'email/email-page/group-collection',
        'email/email-page/group-item-view',
        'utils', 'config/config'],

    function($, _, Backbone, GroupCollection,
             GroupItemView,
             Utils, Config) {

        'use strict';

        var GroupListView = Backbone.View.extend({

            model: null,

            subViewEl: "#email-page",

            tagName: 'ul',

            groupGuid: null,

            groupCollection: null,

            // template: _.template(MyUnhandledPageTemplate + PanelHtmlTemplate),

            events: {

            },
            //用于创建el下的属性
            attributes: function() {
                return{
                    'id': 'group-list',
                    'class': 'contacts'
                }
            },

            initialize: function() {

                var me = this;
                me.groupGuid = 0;

            },


            fillData: function(groupGuid) {

                var me = this;
                me.groupGuid = groupGuid;

                me.groupCollection = new GroupCollection();

                me.listenTo(me.groupCollection, 'add', me.addOne);

                me.listenTo(me.groupCollection, 'reset', me.addAll);

                me.listenTo(me.groupCollection, 'renderHtml', me.renderHtml);

                me.listenTo(me.groupCollection,'error',me.error);

                me.groupCollection.groupData(me.groupGuid);

            },

            refresh: function(){

                var me = this;
                $("#group-container").empty();
                me.groupCollection.groupData(me.groupGuid);
            },

            renderHtml: function(){

                var me = this;

                $(me.subViewEl).find('#group-container').append(me.el);
            },

            addOne: function(groupModel, i){

                var me = this;
                //console.log(i.length);
                me.groupItemView = new GroupItemView({model: groupModel});
                me.groupItemView.render();

                me.$el.append(me.groupItemView.el);
            },

            addAll: function(){
                var me = this;
                me.groupCollection.each(me.addOne, me);
            },

            render: function(){
                var me = this;

            },

            error: function(message){
                var me = this;
                console.log("加载部门列表失败，" + message);
                var text = "加载部门列表失败，" + message;
                $("#group-container").empty();
                $(me.subViewEl).find('#group-container').append("<p class='message'>" + text +
                    "<a href=\"javascript:void(0)\" class=\"refresh\">"+ Config.refresh + "</a></p>");
                $(document).off("vclick", "#group-container a.refresh");
                $(document).on("vclick", "#group-container a.refresh", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    me.refresh();
                });
            }
        });

        return GroupListView;

    });

