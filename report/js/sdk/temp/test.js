define(['jquery'], function($){

    'use strict';

    var Test ={
        add : function (x, y) {
            return x + y;
        },
        updateTitle: function()
        {
            $("h1").css('color', 'red');
        }
    }

    return Test;
});