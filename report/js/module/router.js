/* We define a global variable 'namespace' as module manager*/

/* start application*/
define(['jquery', 'underscore', 'backbone',
        'utils',
        'render',
        'draw',
        'utilities/session',
        'utilities/local',
        'userSession',
        'utilities/action'],

	function($, _, Backbone,
             Utils,
             Render,
             Draw,
             Session,
             Local,
             UserSession,
             Action) {

	'use strict';

     var Router = Backbone.Router.extend({
         
        initialize:function(){

            Utils.extendDate();

            $(document).off("click", "a.back");
            $(document).on('click', 'a.back', function (event) {
                event.preventDefault();
                event.stopPropagation();
                window.history.back();
            });

            $("#setting-bg-contanier").remove();
            $('body').append('<div id="setting-bg-contanier" class="setting-bg"></div>');

            $(document).off("vclick", "a.setting");
            $(document).on("vclick", "a.setting", function(event){
                event.preventDefault();
                event.stopPropagation();
                var currentUser = UserSession.currentUser();
                if(currentUser != null){
                    UserSession.setUserName(currentUser);
                }
                else{
                    $("#userName").text("测试用户");
                }
                $("#settingpanel").panel("open");
            });

            $(document).off("tap", "#setting-bg-contanier");
            $(document).on("tap", "#setting-bg-contanier", function(event){
                //alert("tap close");
                event.preventDefault();
                event.stopPropagation();
                $(this).hide();
                $("#settingpanel").panel("close");
            });

            $(document).off("panelbeforeopen","#settingpanel");
            $(document).on("panelbeforeopen","#settingpanel", function(event,ui){
                event.preventDefault();
                event.stopPropagation();

                $('#setting-bg-contanier').show();
            });

            $(document).off("panelbeforeclose","#settingpanel");
            $(document).on("panelbeforeclose","#settingpanel",function(event,ui){
                event.preventDefault();
                event.stopPropagation();
                $('#setting-bg-contanier').hide();
            });

            $(document).off("vclick","#settingpanel a.clear");
            $(document).on("vclick","#settingpanel a.clear",function(event){
                event.preventDefault();
                event.stopPropagation();
                var userSession = Session.get("UserSession");
                var isLeader =  Session.get("isLeader");
                var isSkip =  Local.get("isSkip");

                window.sessionStorage.clear();
                window.localStorage.clear();

                //set current user session
                if(userSession != null && userSession != ""){
                    Session.set("UserSession", userSession);
                }
                //set is leader
                if(isLeader != null && isLeader != ""){
                    Session.set("isLeader", isLeader);
                }
                //set is skip
                if(isSkip != null && isSkip != ""){
                    Local.set("isSkip", isSkip);
                }
                Session.set('imageData',JSON.stringify([]));
                Utils.alert("缓存清理成功！ ",function(){}, "提示" , "确定");
            });

            //Initialize Draw
            Draw.initialize('header.page-header a.tool');
        },
         
        routes: {
            'page/:page_name(/)(*params)': 'renderPage' 
        },

        /**
         * Show page content
         */
        renderPage: function (page_name, params_str, Model) {

            var params = params_str ? params_str.split('/') : [];

            //$(window).off("orientationchange");

            Render.showPage(page_name, params);
         
            Render.showPageCompleted(page_name);

            //track user behavior
            Action.ajaxAction(page_name);
        }   
         
    });
        
    return Router;
        
});