/**
 * Created by Eric on 9/29/2014.
 */

define(['jquery','utilities/session', 'utilities/local',
        'utils', 'cordovaPlugin'],
    function($, Session, Local,
             Utils, CordovaPlugin) {

        'use strict';

        var Draw = {
            ctx: null,
            color: '#0040ff',
            drawArea: null,
            scrollers: [],
            hasScroller: false,
            lineWidth: 3,
            toolEl: 'a.tool',

            initialize: function(toolEl){
                var me = this;
                me.toolEl = (toolEl == null) ? me.toolEl : toolEl;

                Session.set('imageData',JSON.stringify([]));

                // prototype to	start drawing on touch using canvas moveTo and lineTo
                $.fn.drawTouch = function() {
                    var start = function(e) {
                        e = e.originalEvent;
                        me.ctx.beginPath();
                        var x = e.changedTouches[0].pageX;
                        var y = e.changedTouches[0].pageY - 44;
                        me.ctx.moveTo(x, y);
                    };
                    var move = function(e) {
                        e.preventDefault();
                        e = e.originalEvent;
                        var x = e.changedTouches[0].pageX;
                        var y = e.changedTouches[0].pageY - 44;
                        me.ctx.lineTo(x, y);
                        me.ctx.stroke();
                    };
                    $(this).on("touchstart", start);
                    $(this).on("touchmove", move);
                };

                // prototype to	start drawing on pointer(microsoft ie) using canvas moveTo and lineTo
                $.fn.drawPointer = function() {
                    var start = function(e) {
                        e = e.originalEvent;
                        me.ctx.beginPath();
                        var x = e.pageX;
                        var y = e.pageY - 44;
                        me.ctx.moveTo(x, y);
                    };
                    var move = function(e) {
                        e.preventDefault();
                        e = e.originalEvent;
                        var x = e.pageX;
                        var y = e.pageY - 44;
                        me.ctx.lineTo(x, y);
                        me.ctx.stroke();
                    };
                    $(this).on("MSPointerDown", start);
                    $(this).on("MSPointerMove", move);
                };

                // prototype to	start drawing on mouse using canvas moveTo and lineTo
                $.fn.drawMouse = function() {
                    var clicked = 0;
                    var start = function(e) {
                        clicked = 1;
                        me.ctx.beginPath();
                        var x = e.pageX;
                        var y = e.pageY - 44;
                        me.ctx.moveTo(x, y);
                    };
                    var move = function(e) {
                        if(clicked){
                            var x = e.pageX;
                            var y = e.pageY - 44;
                            me.ctx.lineTo(x, y);
                            me.ctx.stroke();
                        }
                    };
                    var stop = function(e) {
                        clicked = 0;
                    };
                    $(this).on("mousedown", start);
                    $(this).on("mousemove", move);
                    $(window).on("mouseup", stop);
                };

                $(document).on("vclick", me.toolEl, function (event) {
                    event.preventDefault();

                    if($("#toolbar").hasClass("popup-active")){
                        $("#toolbar").fadeOut();
                        $("#toolbar").removeClass("popup-active");
                        console.log("toolbar close");
                    }
                    else {
                        $("#toolbar").addClass("popup-active");
                        $("#toolbar").width($(window).width()).height(44).width($(window).width());
                        $("#toolbar").fadeIn();
                        console.log("toolbar open");
                    }
                });

                $(document).on("vclick", "#toolbar a.annotations", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $("#toolbar .tab-bar a").removeClass("ui-btn-active");
                    $(this).addClass("ui-btn-active");
                    me.annotations()
                });

                $(document).on("vclick", "#toolbar a.clean", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $("#toolbar .tab-bar a").removeClass("ui-btn-active");
                    $(this).addClass("ui-btn-active");
                    me.clean();
                });

                $(document).on("vclick", "#toolbar a.save", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $("#toolbar .tab-bar a").removeClass("ui-btn-active");
                    $(this).addClass("ui-btn-active");
                    me.screenshot();
                });

                $(document).on("vclick", "#toolbar a.email", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $("#toolbar .tab-bar a").removeClass("ui-btn-active");
                    $(this).addClass("ui-btn-active");
                    window.location.href = "#page/email";
                });

                // reset palette selection (css) and select the clicked color for canvas strokeStyle
                $(document).on("vclick", "div.palette", function(event){
                    event.preventDefault();
                    event.stopPropagation();
                    me.changeColor(this);
                });

            },

            newCanvas: function () {
                // define and resize canvas
//               var canvas = '<canvas id="canvas" width="'+$(window).width()+'" height="'+($(window).height() - 106)+'"></canvas>';
                var me = this;
                me.drawArea.height($("div.ui-page .ui-content").height());
                var canvas = '<canvas id="draw-canvas" width="'+$(window).width()+'" height="'+ $("div.ui-page .ui-content").height() +'"></canvas>';
                me.drawArea.html(canvas);

                // setup canvas
                me.ctx = document.getElementById("draw-canvas").getContext("2d");
                me.ctx.beginPath();
                me.ctx.strokeStyle = me.color;
                me.ctx.lineWidth = me.lineWidth;

                // setup to trigger drawing on mouse or touch
                $("#draw-canvas").drawTouch();
                $("#draw-canvas").drawPointer();
                $("#draw-canvas").drawMouse();
            },

            start: function(color, scrollers){
                var me = this;

                me.setColor($("div.palette." + color).attr("data-color"));
                me.changeColor($("div.palette." + color));

                if($('#draw-area').length > 0){
                    $('#draw-area').remove();
                    $("#toolbar .tab-bar a").removeClass("ui-btn-active");
                }
                $("div.ui-page .generic-wrapper.ui-content").append("<div id=\"draw-area\"> </div>");
                me.drawArea = $('#draw-area');

                me.setScrollers(scrollers);
            },

            setScrollers: function(scrollers){
                var me = this;
                if(scrollers.length > 0) {
                    me.scrollers = scrollers;
                    me.hasScroller = true;
                }
            },

            setColor: function(color){
                var me = this;
                if(color != null && color != ""){
                    me.color = color;
                }
            },

            changeColor: function(el){
                var me = this;
                $("div.palette").removeClass("active");
                $(el).addClass("active");
                me.color = $(el).attr("data-color");
                if(typeof(me.ctx) != undefined && me.ctx != null) {
                    me.ctx.beginPath();
                    me.ctx.strokeStyle = me.color;
                    me.ctx.lineWidth = me.lineWidth;
                }
            },

            annotations: function(){
                var me = this;
                if(!me.drawArea.hasClass("draw"))
                {
                    me.drawArea.addClass("draw");
                    if(me.hasScroller) {
                        $.each(me.scrollers, function (index, item) {
                            if (item != null) {
                                item.disable();
                            }
                        });
                    }
                    me.newCanvas();
                }
            },

            clean: function(){
                var me = this;
                if (me.drawArea.hasClass("draw")) {
                    $("#draw-canvas").remove();
                    me.drawArea.height(0).html("").removeClass("draw");
                    if(me.hasScroller) {
                        $.each(me.scrollers, function (index, item) {
                            if (item != null) {
                                item.enable();
                            }
                        });
                    }
                }
            },

            screenshot: function(){
                var me = this;

                var success = function (data) {

                    var originalData = [];
                    if(Session.get('imageData') != null){
                        originalData = JSON.parse(Session.get('imageData'));
                    }
                    originalData.push(data);
                    Session.set('imageData', JSON.stringify(originalData));
                    console.log(Session.get('imageData'));
                    Utils.alert("截屏保存成功!",function(){me.clean();}, "提示", "确定");

                };
                var error = function (data) {
                    Utils.alert("截屏保存失败!",function(){me.clean();}, "提示", "确定");
                    console.log("error: " + data);
                };

                try {
                    CordovaPlugin.takeScreenshot("Cordova plugin Screenshot", success, error);

                }
                catch (e) {
                    console.log("Cordova plugin take screenshot error: " + e);
                }

            }
        }

        return Draw;

    });