/**
 * Created by Eric on 1/20/2015.
 */
define(['jquery','underscore', 'backbone','utils',
        'text!email/email-page/person-item-view.html'],

    function($, _, Backbone, Utils,
             PersonItemViewTemplate) {

        'use strict';

        var PersonItemView = Backbone.View.extend({

            tagName: 'li',

            userModel: null,

            users: null,

            events:{
                //'click': 'tapList'
            },

            template: _.template(PersonItemViewTemplate),

            initialize: function() {

                var me = this;

                _.bindAll(me, 'render');

                me.listenTo(me.model, 'change', me.render);

            },

            //用于创建el下的属性
            attributes: function() {

                return{
                    'class': 'person'
                }
            },

            render: function(){

                var me = this;

                me.elClass();
                me.$el.html(me.template(me.model.toJSON()));

                return me;

            },

            elClass: function(){
                var me = this;
                var isExist = false;
                var personId = me.model.toJSON().coguCode;
                if(me.users != null && me.users.length > 0) {
                    $.each(me.users, function (i, user) {
                        if (user.label == personId) {
                            isExist = true;
                        }
                    })
                    if (isExist) {
                        me.$el.addClass("selected");
                    }
                }
            }

        });

        return PersonItemView;

    });

