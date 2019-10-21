/* We define a global variable 'namespace' as module manager*/

/* start application*/
define(['jquery','utilities/session','services/agent','config/serverConfig','userSession','config/config'],
	function($, Session, Agent, ServerConfig, UserSession, Config) {

	'use strict';
	
	var action = {

        pageName: null,
		
		  //记录用户操作信息
        ajaxAction: function(page_name){
        	var me = this;
        	var record = {};

        	record.time =  new Date().getTime();
        	record.pageName = page_name;
            me.pageName = page_name;
     
        	var system = Session.get('system');
            var screenSize = Session.get('screenSize');
            var network = Session.get('network');

            system = system == null ? "PC端" : system ;
            screenSize = screenSize == null ? "PC端" : screenSize ;
            network = network == null ? "PC端" : network ;

            var currentUser = UserSession.currentUser();
	    	var postData = ServerConfig.servicePostData.addUserBehavior;
            postData.data = [
                {
                    "osVersion": system ,
                    "screenSize":  screenSize,
                    "networkStatus": network,
                    "operateTime": record.time,
                    "operatePage": record.pageName,
                    "operateContent": "访问了" + record.pageName + "模块",
                    "appName": "领导库存报表",
                    "userId": currentUser.userId,
                    "userName": currentUser.userName
                }
            ];

            me.callServlet(
                ServerConfig.agentServiceUrl,
                postData,
                me.ajaxOption()
            );
        },
        
        ajaxOption: function(){
        	  var me = this;
                return {
                    success: function(data){
                        if(data.status == "1") {
                            var results = data.data.operateResultBean;
                            if (results != null && results.flag) {
                                //console.log(JSON.stringify(results));
                                //me.trigger('success', data.msg);
                                console.log(me.pageName + "行为收集成功" + results.flag);
                            }
                            else if(results != null && !results.flag)
                            {
                            	console.log(me.pageName + "行为收集不成功");
                                //console.log(results.failReason);
                               // me.trigger('error', results.failReason);
                            }
                        }
                        else{
                            console.log(data.msg);
                           // me.trigger('error', data.msg);
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                        console.log(JSON.stringify(jqXHR));
                      //  me.trigger('error', Config.networkError );
                    }
                }
        },

        callServlet: function(url, json, options){
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
            $.ajax({
                type: "POST",
                async: true,
                url: url,
                data: {
                    "parameter_encryptdata": "false",
                    "parameter_usertokenid": token,
                    "parameter_compressdata": "false",
                    "datatype":"json/json",
                    "parameter_postdata": JSON.stringify(json)
                },
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                dataType: "json",
                timeout: 15000, // 15 second
                success: function (result) {
                    options.success(result);
                },
                error: function ( jqXHR, textStatus, errorThrown ){
                    options.error(jqXHR, textStatus, errorThrown);
                },
                complete: function(){
                    //$.mobile.loading('hide');
                }
            });
        }
	};
	
	return action;

});