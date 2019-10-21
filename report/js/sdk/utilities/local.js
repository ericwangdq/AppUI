/** 处理local缓存,存储数据及流程控制标识  */
define(['json'],function(Json){
	
	var local = {
        
		set : function(key,value){
			local.TOOL.set(key, value);
			//local.keys.push(key);
		},
		get : function(key){
			return local.TOOL.get(key);
		},
		clear : function(){
            local.TOOL.clear();
		},
        remove : function(){
            local.TOOL.remove(key);
        },
        length: function(){
            return local.TOOL.length();
        },
		TOOL : {
			set : function(key, obj) {
				var str = JSON.stringify(obj);
				window.localStorage.setItem(key, str);
			},
			get : function(key) {
				var objStr = local.TOOL.Filter.ContentToNull(window.localStorage.getItem(key));
				if(objStr){
					return JSON.parse(objStr);
				}else{
					return null;
				}
			},
			remove : function(key) {
				window.localStorage.removeItem(key);
			},
			clear : function() {
				window.localStorage.clear();
			},
			length : function() {
				return window.localStorage.length;
			},
			Filter:{
				ContentToNull:function(data){
					if(data){
						return data;
					}else{
						return null;
					}
				}
			}
		}
	};
	
	//window.Session = local;
	
	return {
		//isFetchedCategories : local.isFetchedCategories,
		//setFetchedCategories : local.setFetchedCategories,
		set : local.set,
		get : local.get,
        remove : local.remove,
		clear : local.clear,
        length: local.length
	};
});

