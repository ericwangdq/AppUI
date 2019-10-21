/**
 * Created by Eric on 12/24/2014.
 */

define(['jquery','underscore', 'backbone',
        'draw',
        'config/config',
        'utils',
        'pageUtils/pageUtils',
        'about/about-page/about-model',
        'text!about/about-page/about-page.html',
        'css!about/common/css/about-page.css'],

    function($, _, Backbone,
             Draw,
             Config,
             Utils,
             PageUtils,
             AboutModel,
             AboutPageTemplate) {

        'use strict';

        var AboutPage = Backbone.View.extend({

            model: null,

            template: _.template(AboutPageTemplate),

            //用于创建el下的属性
            attributes: function() {
                return{
                    'data-role': 'page',
                    'class': 'layout no-footer',
                    'id': 'about-page',
                    'data-theme': 'metal'
                }
            },

            initialize: function() {
                var me = this;

            },

            urlParams: function(params){
                var me = this;
            },

            render: function(){
                var me = this;
                me.el.innerHTML = me.template();
            },

            fillData: function() {
                var me = this;

            },

            renderCompleted: function() {
                var me = this;
                $("#app-version").text(Config.version);

                $("#setting-bg-contanier").hide();

//                $("header.page-header .ui-title").text("关于");
//                Draw.start('blue',[]);

//                $(document).off("click", "#about-page a.back");
//                $(document).on('click', '#about-page a.back', function (event) {
//                    event.preventDefault();
//                    event.stopPropagation();
//                    //window.history.back();
//                    window.location.href = "#page/home";
//                });

            }

        });

        return AboutPage;

    });

