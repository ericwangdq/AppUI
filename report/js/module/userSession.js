/**
 * Created by Eric on 1/23/2015.
 */
define(['jquery',
        'utilities/session',
        'utilities/local',
        'config/config',
        'utils',
        'cordovaPlugin'],
    function($,
             Session,
             Local,
             Config,
             Utils,
             CordovaPlugin) {

        'use strict';

        var UserSession = {

            isStorage: true,

            initialize: function(){
                var me = this
            },

            currentUser: function(){
                var me = this;
                var user = null;
                var userSession =  Session.get("UserSession");
                if(userSession != null && userSession != "")
                {
                    user = JSON.parse(userSession);
                    //console.log(user.userName);
                }
                return user;
            },

            getUserId: function(){
                var me = this;
                var user = me.currentUser();
                var userId = "";
                if(user != null && user.userId != null
                    && user.userId != ""){
                    userId = user.userId;
                }
                else{
                    userId = Config.GuestUserID;
                }
                return userId;
            },

            getUserTokenId: function(){
                var me = this;
                var user = me.currentUser();
                var userTokenId = "";
                if(user != null && user.userTokenId != null
                    && user.userTokenId != ""){
                    userTokenId = user.userTokenId;
                }
                else{
                    userTokenId = Config.GuestUserTokenID;
                }
                return userTokenId;
            },

            setUserName: function(user){
                if($("#userName").length > 0) {
                    $("#userName").text(user.userName);
                }
            }

        }

        return UserSession;

    });