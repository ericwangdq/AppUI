/** 处理session缓存,存储数据及流程控制标识  */
define(['json'],function(Json){
	
	var session = {
        
		set : function(key,value){
			session.TOOL.set(key, value);
			//session.keys.push(key);
		},
		get : function(key){
			return session.TOOL.get(key);
		},
		clear : function(){
            session.TOOL.clear();
		},
        remove : function(){
            session.TOOL.remove(key);
        },
        length: function(){
            return session.TOOL.length();
        },
		TOOL : {
			set : function(key, obj) {
				var str = JSON.stringify(obj);
				window.sessionStorage.setItem(key, str);
			},
			get : function(key) {
				var objStr = session.TOOL.Filter.ContentToNull(window.sessionStorage.getItem(key));
				if(objStr){
					return JSON.parse(objStr);
				}else{
					return null;
				}
			},
			remove : function(key) {
				window.sessionStorage.removeItem(key);
			},
			clear : function() {
				window.sessionStorage.clear();
			},
			length : function() {
				return window.sessionStorage.length;
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

	//window.Session = session;
	
	return {
		//isFetchedCategories : session.isFetchedCategories,
		//setFetchedCategories : session.setFetchedCategories,
		set : session.set,
		get : session.get,
        remove : session.remove,
		clear : session.clear,
        length: session.length
	};
});

