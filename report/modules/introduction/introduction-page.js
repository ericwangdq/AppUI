define(['jquery','underscore', 'backbone',
        'utilities/session',
        'utilities/local',
        'config/config',
        'swiper/swiper',
        'text!introduction/introduction-page/introduction-page.html',
        'css!swiper/swiper.css'],

    function($, _, Backbone, Session, Local, Config, Swiper, IntroductionPageTemplate) {

        'use strict';

        var IntroductionPage = Backbone.View.extend({

            model: null,

            template: _.template(IntroductionPageTemplate),

            //用于创建el下的属性
            attributes: function() {
                return{
                    'data-role': 'page',
                    'class': 'layout',
                    'id': 'introduction-page',
                    'data-theme': 'metal'
                }
            },
            
            events: {
            	'click #helpShow-href-js': 'tapHref'
            },

            initialize: function() {

                var me = this;
            },

            render: function(){
            	
                var me = this;
                me.el.innerHTML = me.template(); 

            },
            
            fillData: function(){
            	
            	//$('#setting-bg-tap').hide();
            },

            renderCompleted: function(){

                var me = this;
                
                var swiper = new Swiper('.swiper-container',{
                	 pagination: '.swiper-pagination',
                     paginationClickable: true
                });
                
                if(Local.get('version') == Config.version && Local.get('isSkip') != null && Local.get('isSkip')){
                	window.Router.navigate('#page/home', {trigger: true});
                }else{
                	Local.set('version', Config.version);
                	Local.set('isSkip', true);
                }

            },

            tapHref: function(){
            	window.Router.navigate('#page/home', {trigger: true});
            }

        });

        return IntroductionPage;

    });

