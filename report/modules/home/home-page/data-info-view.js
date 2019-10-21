/**
 * Created by Eric
 */

define(['jquery','underscore', 'backbone',
        'utilities/session',
        'text!home/home-page/data-info-view.html'],

    function($, _, Backbone,
             Session,
             DataInfoViewTemplate) {

        'use strict';

        var DataInfoView = Backbone.View.extend({

            template: _.template(DataInfoViewTemplate),

            dataScroll: null,

            dataPositionX: null,

            dataPositionY: null,

            subViewEl: null,

            homeCollection: null,

            //用于创建el下的属性
            attributes: function() {

                return{
                    'id': 'data-view',
                    'class': 'data-wrapper'
                }
            },

            initialize: function() {
                var me = this;
                _.bindAll(me, 'render');
                me.render();
                //me.listenTo(me.homeCollection, 'change', me.render);
                console.log("DataInfoView initialize" );
            },

            render: function(){
                var me = this;

            },

            fillData: function(subViewEl, homeCollection){
                var me = this;
                me.subViewEl = subViewEl;
                me.homeCollection = homeCollection;
                //console.log("DataInfoView RenderContent Home collection: " + JSON.stringify(me.homeCollection.toJSON()));
                me.$el.html(me.template({collection: me.homeCollection.toJSON()}));

                me.subViewEl.find('#data-info').html(me.el);
            },

            renderCompleted: function(){
                var me = this;
                me.populateDataInfo();
            },

            populateDataInfo: function(){
                var me = this;
                document.querySelector("#data-view").addEventListener('touchmove', function (e) {e.preventDefault();}, false);

                /*Tablet*/
                var isTablet = $(window).width() >= 768;
                var colWidth = 100, colHeight = 40;
                if(isTablet){
                    colWidth = 150;
                    colHeight = 60;
                }


                var cols = $("#data-view .scroller > ul:nth-child(1) > li").length;
                var rows = $("#data-view .scroller > ul").length;

                //data-wrapper width
                if((cols + 1) * colWidth > $(window).width() - 20) {
                    $("#data-view").width($(window).width() - 20);
                }
                else {
                    $("#data-view").width((cols + 1) * colWidth);
                }
                //data-wrapper height
                if((rows + 1) * colHeight > $(window).height() - 160){
                    $("#data-view").height($(window).height() - 160);
                }else{
                    $("#data-view").height((rows + 1) * colHeight);
                }

                $("#data-view .scroller").width((cols + 1) * colWidth).height((rows + 1) * colHeight);
                $("#data-view .row-header").width(colWidth).height(rows * colHeight);
                $("#data-view .column-header, #data-view .column-header-bg").width(cols * colWidth);

                if(me.homeCollection.toJSON().length > 0) {
                    me.dataScroll = new IScroll('#data-view', {
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
                $("#data-view div.column-header").css("transform", "translate(" + me.dataPositionX + "px, 0)");
                $("#data-view div.row-header").css("transform", "translate(0, " + me.dataPositionY + "px)");
            }

        });

        return DataInfoView;

    });

