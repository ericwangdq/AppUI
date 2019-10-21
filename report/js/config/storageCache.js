define([],function(){

    'use strict';
    var storageCache={
        dailyNews:{
            newsID: 'INTEGER'
        },
        
        news:{
            newsID: 'INTEGER',
            doctitle: 'TEXT' //新闻标题
        }
    };

    return storageCache;

});