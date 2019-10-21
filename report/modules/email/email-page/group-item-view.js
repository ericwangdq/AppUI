/**
 * Created by Eric on 1/20/2015.
 */
define(['jquery','underscore', 'backbone','utils',
        'text!email/email-page/group-item-view.html'],

    function($, _, Backbone, Utils, GroupItemViewTemplate) {

        'use strict';

        var GroupItemView = Backbone.View.extend({

            tagName: 'li',

//            events:{
//                'click': 'tapList'
//            },

            template: _.template(GroupItemViewTemplate),

            initialize: function() {

                var me = this;

                _.bindAll(me, 'render');

                me.listenTo(me.model, 'change', me.render);

            },

            //用于创建el下的属性
            attributes: function() {

//                return{
//                    'class': ''
//                }
            },

            render: function(){

                var me = this;

                //me.elClass();
                me.$el.html(me.template(me.model.toJSON()));

                return me;

            },

            elClass: function(){

                var me = this;
                var color = me.model.toJSON().lightStatus;

                switch(color){
                    case 'red': me.$el.addClass('urgent');
                        break;
                    case 'yellow': me.$el.addClass('track');
                        break;
                    case 'green': me.$el.addClass('normal');
                        break;
                }

            },

            tapList: function(event){
                var me = this;
                //alert($(event.target).attr("data-attr"));
                //window.location.href='#page/contractDetail';
                //Router.navigate("page/contractDetail/" + me.model.get('pactNewGuid'), {trigger: true});

                return false;
            }

        });

        return GroupItemView;

    });

