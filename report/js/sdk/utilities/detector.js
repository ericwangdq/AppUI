define(['jquery', 'base/core'], function($, core){

    'use strict';

    var detector = {
        isMobileUserAgent: function() {
//            return  (/iphone|ipod|android.*mobile|windows.*phone|blackberry.*mobile/i.test(window.navigator.userAgent.toLowerCase()));
            return  (/iphone|ipad|ipod|android|windows.*phone|blackberry.*mobile/i.test(window.navigator.userAgent.toLowerCase()));
        },
        /* Detect iPad */
        isiPad: function()  {
        //var ua1 = navigator.userAgent.toLowerCase();
        var ua2 = window.navigator.userAgent;
        return /iPad/i.test(ua2) || /iPhone OS 3_1_2/i.test(ua2) || /iPhone OS 3_2_2/i.test(ua2);
        },
        getDeviceId: function() {
            return "1111111";
        },
        getClientTypeId: function() {
            return "iPhone4S";
        },
        getClientIdVersion: function() {
            return "iPhone4S";
        },
        getNetwork: function() {
            return "wifi";
        },
        getOS: function() {
            return "iOS";

        },
        getOSVersion: function() {
            return "8";
        },
        getResolution1: function() {
            return "960.000";
        },
        getResolution2: function() {
            return "640.000";
        }
    };

    return detector;
});
