/**
 * Created by Eric
 */

define(['jquery','underscore', 'backbone',
        'utilities/session',
        'text!home/home-page/group-info-view.html'],

    function($, _, Backbone,
             Session,
             GroupInfoViewTemplate) {

        'use strict';

        var GroupInfoView = Backbone.View.extend({

            template: _.template(GroupInfoViewTemplate),

            dataScroll: null,

            dataPositionX: null,

            dataPositionY: null,

            subViewEl: null,

            groupData: null,

            //用于创建el下的属性
            attributes: function() {

                return{
                    'id': 'group-data-view',
                    'class': 'data-wrapper'
                }
            },

            initialize: function() {
                var me = this;
                _.bindAll(me, 'render');
                me.render();
                console.log("GroupInfoView initialize" );
            },

            render: function(){
                var me = this;

            },

            fillData: function(subViewEl, groupData){
                var me = this;
                me.subViewEl = subViewEl;
                me.groupData = groupData;
                me.$el.html(me.template({groupData: groupData}));
                console.log("GroupInfoView data: " + JSON.stringify(groupData));
                me.subViewEl.find('#group-info').html(me.el);
            },

            renderCompleted: function(){
                var me = this;
                me.populateDataInfo();
            },

            populateDataInfo: function() {
                var me = this;
                document.querySelector("#group-data-view").addEventListener('touchmove', function (e) {
                    e.preventDefault();
                }, false);

                /*Tablet*/
                var isTablet = $(window).width() >= 768;
                var colWidth = 100, colHeight = 40;
                if(isTablet){
                    colWidth = 150;
                    colHeight = 60;
                }

                var cols = $("#group-data-view .scroller > ul:nth-child(1) > li").length;
                var rows = $("#group-data-view .scroller > ul").length;

                //data-wrapper width
                if ((cols + 1) * colWidth > $(window).width() - 20) {
                    $("#group-data-view").width($(window).width() - 20);
                }
                else {
                    $("#group-data-view").width((cols + 1) * colWidth);
                }
                //data-wrapper height
                if ((rows + 1) * colHeight > $(window).height() - 160) {
                    $("#group-data-view").height($(window).height() - 160);
                } else {
                    $("#group-data-view").height((rows + 1) * colHeight);
                }

                $("#group-data-view .scroller").width((cols + 1) * colWidth).height((rows + 1) * colHeight);
                $("#group-data-view .row-header").width(colWidth).height(rows * colHeight);
                $("#group-data-view .column-header, #group-data-view .column-header-bg").width(cols * colWidth);

                if(me.groupData.groups.length > 0) {
                    me.dataScroll = new IScroll('#group-data-view', {
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
//                        snap: 'li',
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
                $("#group-data-view div.column-header").css("transform", "translate(" + me.dataPositionX + "px, 0)");
                $("#group-data-view div.row-header").css("transform", "translate(0, " + me.dataPositionY + "px)");
            }

        });

        return GroupInfoView;

    });

