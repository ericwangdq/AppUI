/**
 * Created by Eric
 */

define(['jquery','underscore', 'backbone',
        'utilities/session',
        'subcategory/subcategory-page/subcategory-model',
        'subcategory/subcategory-page/category-collection',
        'text!subcategory/subcategory-page/data-info-view.html'],

    function($, _, Backbone, Session,
             SubCategoryModel,
             CategoryCollection,
             DataInfoViewTemplate) {
        'use strict';

        var DataInfoView = Backbone.View.extend({

            template: _.template(DataInfoViewTemplate),

            dataScroll: null,

            dataPositionX: null,

            dataPositionY: null,

            subViewEl: null,

            categoryContainer: null,

            dataWrapper: null,

            subCategoryModel: null,

            categoryCollection: null,

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
                //me.listenTo(me.homeCollection, 'change', me.render);
                console.log("DataInfoView initialize" );
            },

            render: function(){
                var me = this;

            },

            fillData: function(subViewEl, categoryContainer, dataWrapper, subCategoryModel){
                var me = this;
                console.log("DataInfoView" + " " + categoryContainer + " " +  JSON.stringify(subCategoryModel));

                me.subViewEl = subViewEl;
                me.categoryContainer = categoryContainer;
                me.dataWrapper = dataWrapper;
                me.subCategoryModel = subCategoryModel;
                me.$el.addClass(me.dataWrapper);
                me.$el.html(me.template({model: me.subCategoryModel}));
                me.subViewEl.find(categoryContainer).html(me.el);
            },

            renderCompleted: function(){
                var me = this;
                me.populateDataInfo();
            },

            populateDataInfo: function() {
                var me = this;
                document.querySelector("." + me.dataWrapper).addEventListener('touchmove',
                    function (event) {
                        event.preventDefault();
                    }
                    , false);
//                $("." + me.dataWrapper).width($(window).width() - 20);
//                $("." + me.dataWrapper).height($(window).height() - 120);

                /*Tablet*/
                var isTablet = $(window).width() >= 768;
                var colWidth = 100, colHeight = 40;
                if(isTablet){
                    colWidth = 150;
                    colHeight = 60;
                }

                var cols = $("div." + me.dataWrapper + " .scroller > ul:nth-child(1) > li").length;
                var rows = $("div." + me.dataWrapper + " .scroller > ul").length;

                //data-wrapper width
                //$(".data-wrapper").width($(window).width() - 20);
                //$("." + me.dataWrapper).width(300);
                //data-wrapper width
                if((cols + 1) * colWidth > $(window).width() - 20) {
                    $("div." + me.dataWrapper).width($(window).width() - 20);
                }
                else {
                    $("div." + me.dataWrapper).width((cols + 1) * colWidth);
                }
                //data-wrapper height
                if((rows + 1) * colHeight > $(window).height() - 120){
                    $("div." + me.dataWrapper).height($(window).height() - 120);
                }else{
                    $("div." + me.dataWrapper).height((rows + 1) * colHeight);
                }


                $("div." + me.dataWrapper + " .scroller").width((cols + 1) * colWidth).height((rows + 1) * colHeight);
                $("div." + me.dataWrapper + " .row-header").width(colWidth).height(rows * colHeight);
                $("div." + me.dataWrapper + " .column-header," +
                    " " +"div." + me.dataWrapper + " .column-header-bg")
                    .width(cols * colWidth);

                if(me.subCategoryModel.subCategories.toJSON().length > 0) {

                    me.dataScroll = new IScroll("." + me.dataWrapper, {
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
                $("div." + me.dataWrapper + " div.column-header").css("transform", "translate(" + me.dataPositionX + "px, 0)");
                $("div." + me.dataWrapper + " div.row-header").css("transform", "translate(0, " + me.dataPositionY + "px)");
            }

        });

        return DataInfoView;

    });

