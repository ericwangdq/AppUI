/* We define a global variable 'namespace' as module manager*/

/* start Application*/
define(['jquery', 'underscore', 'backbone', 'router','cordovaPlugin','utils','utilities/session','userSession','jqm'],
    function($, _, Backbone, Router, CordovaPlugin, Utils, Session, UserSession) {

        'use strict';

        var App = {
            router: null,

            init: function() {

                if(CordovaPlugin.isCordovaAvailable()){
                    console.log("InitOnMobile: Cordova on device ready.");
                    App.initOnMobile();
                }
                else {
                    console.log("InitOnPC: Document ready.");
                    App.initOnPC();
                }
            },

            testUser: "{\"userId\": \"110652\"," +
            "\"userName\": \"康慷\"," +
            "\"userTokenId\": \"1426475587916\"}",

//            testUser: "{\"userId\": \"571243\"," +
//            "\"userName\": \"俞皓\"," +
//            "\"userTokenId\": \"1426475587916\"}",

            /*PC端执行方法*/
            initOnPC: function(){
                $(document).ready(function () {

                    Session.set("UserSession", App.testUser);
                    window.Router = new Router();
                    Backbone.history.start();
                });
            },

            /*手机端执行方法*/
            initOnMobile: function(){

                document.addEventListener(
                   'deviceready',
                   App.onDeviceReady,
                   false
                );

//                $(document).ready(function () {
//                    console.log('document ready');
//                    App.onDeviceReady()
//                });
            },

            /*移动端cordova事件 phonegap加载完成执行方法*/
            onDeviceReady: function(){
                CordovaPlugin.check();
                CordovaPlugin.cordovaEvent(Utils, function(){

                    var success = function (result) {
                        //var success = eval("(" + result + ")");
                        console.log(result);
                        Session.set("UserSession", result);
                        window.Router = new Router();
                        Backbone.history.start();
                    };
                    var error = function (data) {
                        console.log("get user session error 1: " + data);
                        //retry get user session
                        try {
                            CordovaPlugin.getUserSession("Cordova plugin iPlat4m getUserSession",
                                function (result) {
                                    //var success = eval("(" + result + ")");
                                    console.log(result);
                                    Session.set("UserSession", result);
                                    window.Router = new Router();
                                    Backbone.history.start();
                                },
                                function (error) {
                                    console.log("get user session error 2: " + data);
                                    Session.set("UserSession", App.testUser);
                                    window.Router = new Router();
                                    Backbone.history.start();
                                });
                        }
                        catch (e) {
                            console.log("Cordova plugin iPlat4m getUserSession: " + e);
                        }
                        window.Router = new Router();
                        Backbone.history.start();
                    };

                    try {
                        CordovaPlugin.getUserSession("Cordova plugin iPlat4m getUserSession", success, error);
                    }
                    catch (e) {
                        console.log("Cordova plugin iPlat4m getUserSession: " + e);
                    }

                });
            }
        };

        return App;

    });