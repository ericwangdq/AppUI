/* We define a global variable 'namespace' as module manager*/

/* start application*/
define(['utilities/detector','utilities/session'],
	function(Detector, Session) {

	'use strict';

	var cordovaPlugin = {
    
        isCordovaAvailable: function() {
            if (Detector.isMobileUserAgent()) {
                return typeof (window.cordova || window.Cordova || window.PhoneGap) !== 'undefined';
            }
            return false;
        },
        
        cordovaEvent: function(call,callback){

            // TODO ... 
            document.addEventListener(
                'pause',
                call.pause, 
                false
            );

            // TODO ...
            document.addEventListener(
                'resume',
                call.resume, 
                false
            );

            // TODO ...
            document.addEventListener(
                'online',
                call.online, 
                false
            );

            // TODO ...
            document.addEventListener(
                'offline',
                call.offline, 
                false
            );
            
            document.addEventListener(
                'backbutton',
                call.backbutton,
                false
            );
            
            document.addEventListener(
                'menubutton',
                call.menubutton, 
                false
            );
            
            callback();
        },

        check: function(){
            var me = this;
            me.system();
            me.checkConnection();
            me.time();
            me.screenSize();
        },

        system: function(){
            Session.set('system',window.device.platform + window.device.version);
        },

        checkConnection: function(){

            var networkState = navigator.connection.type;

            var states = {};
            states[Connection.UNKNOWN]  = 'Unknown';
            states[Connection.ETHERNET] = 'Ethernet';
            states[Connection.WIFI]     = 'WiFi';
            states[Connection.CELL_2G]  = '2G';
            states[Connection.CELL_3G]  = '3G';
            states[Connection.CELL_4G]  = '4G';
            states[Connection.CELL]     = 'generic';
            states[Connection.NONE]     = 'No network';

            Session.set('network',states[networkState]);
        },

        time: function(){
            var myDate = new Date();
            Session.set('time',myDate.getTime());
        },

        screenSize: function(){
            Session.set('screenSize', $(window).height()/$(window).width());
        },

        takeScreenshot :function(message, successCallback, errorCallback) {
            if(window.device.platform.toLowerCase() == "ios") {
                //iOS
                Screenshot.saveScreenshot(message, successCallback, errorCallback);
            }
            else if(window.device.platform.toLowerCase() == "android") {
                //Android
                cordova.exec(
                    successCallback, // success callback function
                    errorCallback, // error callback function
                    'Screenshot', // mapped to our native Java class called "Screenshot"
                    'takeScreenshot', // with this action name
                    [                  // and this array of custom arguments to create our entry
                        message
                    ]
                );
            }
            else{
                console.log("Take Screenshot plugin fired in unknown platform.")
            }
        },

        getUserSession: function(message, successCallback, errorCallback) {

            if(window.device.platform.toLowerCase() == "ios") {
                //iOS
                cordova.exec(
                    successCallback, // success callback function
                    errorCallback,
                    "iPlat4MUserSessionUtils",
                    "getUserSession");
            }
            else if(window.device.platform.toLowerCase() == "android") {
                //Android
                cordova.exec(
                    successCallback, // success callback function
                    errorCallback, // error callback function
                    'IPlat4m', // mapped to our native Java class called "IPlat4m"
                    'getUserSession', // with this action name
                    [                  // and this array of custom arguments to create our entry
                        message
                    ]
                );
            }
            else{
                console.log("Get user session plugin fired in unknown platform.")
            }

        },

        openAttachment: function(url, successCallback, errorCallback) {
            cordova.exec(
                successCallback, // success callback function
                errorCallback, // error callback function
                'IPlat4m', // mapped to our native Java class called "IPlat4m"
                'openAttachment', // with this action name
                [                  // and this array of custom arguments to create our entry
                    {
                        "url":url
                    }
                ]
            );
        },

        viewScreenshot: function(message, successCallback, errorCallback) {
            cordova.exec(
                successCallback, // success callback function
                errorCallback, // error callback function
                'IPlat4m', // mapped to our native Java class called "IPlat4m"
                'viewScreenshot', // with this action name
                [
                    message
                ]
            );
        }

    }
	 
    return cordovaPlugin;
});