/**
 * Library base
 */
define(['jquery'], function($) {

    var Core = window.Core = window.Core || {},
        extend = $.extend,
        type = $.type,

        ARRAY = "array",
        BOOLEAN = "boolean",
        DATE = "date",
        NUMBER = "number",

        OBJECT = "object",
        UNDEFINED = "undefined",
        STRING = "string";


    var CONSTANT = {
            PARAMETER_COMPRESSDATA: "parameter_compressdata",
            PARAMETER_ENCRYPTDATA: "parameter_encryptdata",
            PARAMETER_POSTDATA: "parameter_postdata",
            PARAMETER_USERID: "parameter_userid",
            PARAMETER_PASSWORD: "parameter_password",
            PARAMETER_DEVICEID: "parameter_deviceid",
            PARAMETER_CLIENTTYPEID: "parameter_clienttypeid", // android
            PARAMETER_CLIENTVERSION: "parameter_clienidtversion", // HTC Desire
            PARAMETER_OS: "os",
            APP_CLUSTER_CODE: "APP_CLUSTER_CODE",
            PARAMETER_NETWORK_TYPE: "network",
            PARAMETER_DEVICE_WIDTH: "resolution1",
            PARAMETER_DEVICE_HEIGHT: "resolution2",
            PARAMETER_OS_VERSION: "osVersion",
            PARAMETER_APPCODE: "appcode"
        };

    function Class() {};
    Class.extend = function(proto) {
        var base = function() {},
            member,
            that = this,
            subclass = proto && proto.init ? proto.init : function () {
                that.apply(this, arguments);
            },
            fn;

        base.prototype = that.prototype;
        fn = subclass.fn = subclass.prototype = new base();

        for (member in proto) {
            if (typeof proto[member] === OBJECT && !(proto[member] instanceof Array) && proto[member] !== null) {
                // Merge object members
                fn[member] = extend(true, {}, base.prototype[member], proto[member]);
            } else {
                fn[member] = proto[member];
            }
        }

        fn.constructor = subclass;
        subclass.extend = that.extend;

        return subclass;
    };

    extend(Core, {
        CONSTANT: CONSTANT,
        Class: Class,
        isAvailable: function(o) {
            return !!o || o === 0 || o === false;
        },
        isArray: $.isArray,
        isBoolean: function(o) {
            return typeof o === BOOLEAN;
        },
        isDate: function(o) {
            return type(o) === "DATE" && o.toString() !== 'Invalid Date' && !isNaN(o);
        },
        isString: function(o) {
            return typeof o === STRING;
        },
        isUndefined: function(o) {
            return typeof o === UNDEFINED;
        },
        isNull: function(o) {
            return o === null;
        }

    });
    return Core;
});
