/**
 * Created by Eric on 9/29/2014.
 */

/* We define a global variable 'namespace' as module manager*/

/* start application*/
define(['jquery', 'jsonMinify'],
    function($) {

        'use strict';

        var Request = {

            http:{

                common_successCallback: function(successCallback, data){

                    successCallback.call(this, data);

                },

                common_failCallback: function(xhr, message, exp, failCallback){

                    failCallback.call(this, message);

                },

                common_failCallback_default: function(){

                    alert("获取数据失败...");

                },

                _ajax: function(url, type, data, dataType, successCallback, failCallback){


                    $.ajax({

                        type: type,

                        async:false,

                        url: url,

                        timeout:1200000,

                        data: data,

                        dataType: dataType

                    }).done(function(data){
                        //alert(12);
                        Request.http.common_successCallback(successCallback, data);

                    }).fail(function(xhr, message, exp){

                        if(failCallback == null){
                            failCallback =WWW.http.common_failCallback_default;
                        }

                        Request.http.common_failCallback(xhr, message, exp, failCallback);

                    });

                },

                get: function(url, data, dataType, successCallback, failCallback){

                    Request.http._ajax(url, 'GET', data, dataType, successCallback, failCallback);

                },

                post: function(url, data, dataType, successCallback, failCallback){

                    Request.http._ajax(url, 'POST', data, dataType, successCallback, failCallback);

                },

                loadLocalJSONFile: function (path) {
                    var request = $.ajax({
                        url: path,
                        type: 'GET',
                        async: false
                    });

                    return JSON.parse(JSON.minify(request.responseText));
                }
            }
        }

        return {

            http:{

                get: Request.http.get,

                post: Request.http.post,

                loadLocalJSONFile: Request.http.loadLocalJSONFile

            }


        };
    });