define(['jquery',
        'utilities/session',
        'userSession',
        'config/config',
        'cordovaPlugin',
        'json'],
    function($,
             Session,
             UserSession,
             Config,
             CordovaPlugin) {

    'use strict';

    var loginData = {};
    loginData["parameter_compressdata"] = false;
    loginData["parameter_postdata"] = "parameter_postdata";
    loginData["parameter_deviceid"] = "1111111";
    loginData["parameter_clienttypeid"] = "iPhone4S";
    loginData["parameter_clienidtversion"] = "iPhone4S";
    loginData["network"] = "wifi";
    loginData["os"] = "iOS";
    loginData["resolution1"] = "8";
    loginData["resolution2"] = "960.000";
    loginData["osVersion"] = "640.000";
    loginData["appcode"] = "com.baosight.iplat4mipad"; // "iplatmbs"; // core.CONSTANT

    var Agent = {
        init: function(){
            console.log("Agent init function");
        },
        login: function(loginURL, options) {

            var data = {};
            data["parameter_userid"] = options.userid;
            data["parameter_password"] = options.password;

            $.extend(data, loginData);
            $.ajax({
                type : "POST",
                async : true,
                url : loginURL,
                data : data,
                dataType : "json",
                success : function(data) {
                    options.success(data);
                },
                error : function(jqXHR, textStatus, errorThrown) {
                    options.error(jqXHR, textStatus, errorThrown);
                }
            });

        },
        callService: function(url, data, options) {// data is eiInfo
            $.mobile.loading('show', {text: '加载中...'});
            $.ajax({
                type: "POST",
                async: true,
                url: url,
                data: {
                    "parameter_encryptdata": "false",
                    "parameter_usertokenid": UserSession.getUserTokenId(),
                    "parameter_userid": UserSession.getUserId(),
                    "parameter_compressdata": "false",
                    "datatype":"json/eiinfo",
                    "parameter_postdata": data
                },
                dataType: "json",
                success: function (result) {
                    options.success(result);
                },
                error: function ( jqXHR, textStatus, errorThrown){
                    options.error(jqXHR, textStatus, errorThrown);
                },
                complete: function(){
                    $.mobile.loading('hide');
                }
            });

        },
        callServlet: function(url, json, options) {
            $.mobile.loading('show', {text: '加载中...'});
            var me = this;
            var token = Config.GuestUserTokenID;
            var userId = Config.GuestUserID;
            var currentUser = UserSession.currentUser();
            if(currentUser != null) {
                userId = currentUser.userId;
                token = currentUser.userTokenId;
                if (json.attr.userId != null) {
                    json.attr.userId = userId;
                }
            }
            me.callServletWithToken(url, JSON.stringify(json), options, token);

        },
        callServletWithToken: function(url, json, options, token){
            $.ajax({
                type: "POST",
                async: true,
                url: url,
                data: {
                    "parameter_encryptdata": "false",
                    "parameter_usertokenid": token,
                    "parameter_compressdata": "false",
                    "datatype":"json/json",
                    "parameter_postdata": json
                },
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                dataType: "json",
                timeout: 30000, // 30 second
                success: function (result) {
                    options.success(result);
                },
                error: function ( jqXHR, textStatus, errorThrown ){
                    options.error(jqXHR, textStatus, errorThrown);
                },
                complete: function(){
                    $.mobile.loading('hide');
                }
            });
        },
        callWebService: function(url, json, options) {
            $.mobile.loading('show', {text: '加载中...'});
            var token = UserSession.getUserTokenId();
            $.ajax({
                type: "POST",
                async: true,
                url: url,
                data: {
                    "parameter_encryptdata": "false",
                    "parameter_usertokenid": token,
                    "parameter_compressdata": "false",
                    "datatype":"json/xml",
                    "parameter_postdata": json
                },
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                dataType: "json",
                timeout: 30000, // 30 second
                success: function (result) {
                    options.success(result);
                },
                error: function ( jqXHR, textStatus, errorThrown ){
                    options.error(jqXHR, textStatus, errorThrown);
                },
                complete: function(){
                    $.mobile.loading('hide');
                }
            });
        }
    };

    return Agent;

});