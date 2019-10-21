/**
 * Created by Eric
 */

define(['jquery','underscore', 'backbone',
        'utilities/session',
        'text!directional/directional-page/data-info-view.html'],

    function($, _, Backbone, Session,
             DataInfoViewTemplate) {
        'use strict';

        var DataInfoView = Backbone.View.extend({

            template: _.template(DataInfoViewTemplate),

            dataScroll: null,

            dataPositionX: null,

            dataPositionY: null,

            subViewEl: null,

            directionalModel: null,

            //用于创建el下的属性
            attributes: function() {
                var me = this;
                return{
                    'class': 'data-wrapper'
                }
            },

            initialize: function() {
                var me = this;
                _.bindAll(me, 'render');
                me.render();
                console.log("DataInfoView initialize" );
            },

            render: function(){
                var me = this;

            },

            fillData: function(subViewEl, directionalModel){
                var me = this;
                console.log("DataInfoView" + " " +  JSON.stringify(directionalModel));
                me.subViewEl = subViewEl;
                me.directionalModel = directionalModel;
                me.$el.html(me.template({model: me.directionalModel.toJSON()}));
                me.subViewEl.find("#data-info").html(me.el);
            },

            renderCompleted: function(){
                var me = this;
                me.populateDataInfo();
            },

            populateDataInfo: function() {
                var me = this;
                document.querySelector(".data-wrapper").addEventListener('touchmove',
                    function (event) {
                        event.preventDefault();
                    }
                    , false);

                $(".data-wrapper").width(300);
                var colWidth = 100, colHeight = 40;
                var isTablet = $(window).width() >= 768;
                if(isTablet){
                    colWidth = 150;
                    colHeight = 60;
                }

                var cols = $("div.data-wrapper .scroller > ul:nth-child(1) > li").length;
                var rows = $("div.data-wrapper .scroller > ul").length;


                if((rows + 1) * colHeight > $(window).height() - 80) {
                    $(".data-wrapper").height($(window).height() - 80);
                }
                else{
                    $(".data-wrapper").height((rows + 1) * colHeight);
                }
                $(".data-wrapper").width(colWidth + 200);
                $("div.data-wrapper .scroller").width(colWidth + 200).height((rows + 1) * colHeight);
                $("div.data-wrapper .row-header").width(colWidth*2).height(rows * colHeight);
                $("div.data-wrapper .column-header, div.data-wrapper .column-header-bg").width(100);

                if(me.directionalModel.toJSON().customers.length > 0) {

                    me.dataScroll = new IScroll(".data-wrapper", {
                        scrollX: true,
                        scrollY: true,
                        momentum: false,
//                    interactiveScrollbars: false,
//                    fadeScrollbars: false,
                        bounce: true,
//                    hScrollbar: false,
//                    vScrollbar: true,
                        scrollbars: false,
                        probeType: 3,
                        //snap: 'li',
                        mouseWheel: true
                    });

                    me.dataScroll.on('scroll', function () {
                        me.updatePosition();
                        //console.log(this.y);
                    });

                    me.dataScroll.on('scrollEnd', function () {
                        //console.log(JSON.stringify(myScroll));
                        me.updatePosition();
                    });

                    setTimeout(function () {
                        me.dataScroll.refresh();
                    }, 0);
                }

            },

            updatePosition: function(){
                var me = this;
                me.dataPositionX = me.dataScroll.x;
                me.dataPositionY = me.dataScroll.y;
                $("div.column-header").css("transform", "translate(" + me.dataPositionX + "px, 0)");
                $("div.row-header").css("transform", "translate(0, " + me.dataPositionY + "px)");
            }

        });

        return DataInfoView;

    });

