/**
 * Utilities
 * @module cookie
 */
define(['jquery', 'base/core'], function($, core) {

    var isFunction = $.isFunction,
        isObject = $.isPlainObject,
        isString = core.isString,
        isUndefined = core.isUndefined,
        encode      = encodeURIComponent,
        decode      = decodeURIComponent,
        NULL = null,
        doc = document;

    function error(message) {
        throw new TypeError(message);
    }

    function validateCookieName(name){
        if (!isString(name) || name === ""){
            error("Cookie name must be a non-empty string.");
        }
    }

    var Cookie = {
        _createCookieString: function(name, value, encodeValue, options) {
            options = options || {};

            var text /*:String*/ = encode(name) + "=" + (encodeValue ? encode(value) : value),
                expires = options.expires,
                path    = options.path,
                domain  = options.domain;


            if (isObject(options)){
                //expiration date
                if (expires instanceof Date){
                    text += "; expires=" + expires.toUTCString();
                }

                //path
                if (isString(path) && path !== ""){
                    text += "; path=" + path;
                }

                //domain
                if (isString(domain) && domain !== ""){
                    text += "; domain=" + domain;
                }

                //secure
                if (options.secure === true){
                    text += "; secure";
                }
            }

            return text;
        },

        _parseCookieString : function (text /*:String*/, shouldDecode /*:Boolean*/, options /*:Object*/) /*:Object*/ {

            var cookies /*:Object*/ = {};

            if (isString(text) && text.length > 0) {

                var decodeValue = (shouldDecode === false ? function(s){return s;} : decode),
                    cookieParts = text.split(/;\s/g),
                    cookieName  = NULL,
                    cookieValue = NULL,
                    cookieNameValue = NULL;

                for (var i=0, len=cookieParts.length; i < len; i++){
                    //check for normally-formatted cookie (name-value)
                    cookieNameValue = cookieParts[i].match(/([^=]+)=/i);
                    if (cookieNameValue instanceof Array){
                        try {
                            cookieName = decode(cookieNameValue[1]);
                            cookieValue = decodeValue(cookieParts[i].substring(cookieNameValue[1].length+1));
                        } catch (ex){
                            //intentionally ignore the cookie - the encoding is wrong
                        }
                    } else {
                        //means the cookie does not have an "=", so treat it as a boolean flag
                        cookieName = decode(cookieParts[i]);
                        cookieValue = "";
                    }
                    // don't overwrite an already loaded cookie if set by option
                    if (!isUndefined(options) && options.reverseCookieLoading) {
                        if (isUndefined(cookies[cookieName])) {
                            cookies[cookieName] = cookieValue;
                        }
                    } else {
                        cookies[cookieName] = cookieValue;
                    }
                }

            }

            return cookies;
        },

        get: function(name, options) {
            validateCookieName(name);   //throws error

            var cookies,
                cookie,
                converter;

            //if options is a function, then it's the converter
            if (isFunction(options)) {
                converter = options;
                options = {};
            } else if (isObject(options)) {
                converter = options.converter;
            } else {
                options = {};
            }

            cookies = this._parseCookieString(doc.cookie, !options.raw, options);
            cookie = cookies[name];

            //should return null, not undefined if the cookie doesn't exist
            if (isUndefined(cookie)) {
                return NULL;
            }

            if (!isFunction(converter)){
                return cookie;
            } else {
                return converter(cookie);
            }

        },
        set: function(name, value, options) {
            validateCookieName(name);   //throws error

            if (isUndefined(value)){
                error("Cookie.set(): Value cannot be undefined.");
            }

            options = options || {};

            var text = this._createCookieString(name, value, !options.raw, options);
            doc.cookie = text;
            return text

        },
        remove: function() {

        }
    };



    return Cookie;
});