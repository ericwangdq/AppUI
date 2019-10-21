/* We define a global variable 'namespace' as module manager*/

/* start application*/
define(['jquery','underscore', 'json'],
	function($, _) {

	'use strict';

	var Utils = {
       
        pause: function(){
        
        },
        
        resume: function(){
        
        },
        
        online: function(){
        
        },
        
        offline: function(){
        
        },
        
        backbutton: function(){
            
            var activePageId = $.mobile.activePage.attr('id');
            
            if(activePageId === 'home-page'){
                
                if($('#messageMain').css('display') == 'block'){
                    
                      $('#messageMain').hide();
                
                      $('#home-page-one').show();
                
                }else{
                    
                     Utils.showConfirmDialog('是否退出程序?',function(){
                         
                            Utils.exit();
                         
                     });
                }
            
            }else{
               
                 window.history.back(); 
            }

        },
        
        menubutton: function(){
            
        
        },
        
        showConfirmDialog: function(message,onConfirm,opt){
        
            var title="";
            var buttonLabels="";
            if(opt){
                title=opt.title;
                buttonLabels=opt.buttonLabels;
            }

            if(!title){
                title = "提示";
            }
            
              if(!navigator.notification){
                  if(window.confirm(message)){
                      onConfirm.call(this,true);
                  }
//                 else{
//                      onConfirm.call(this,false);
//                  };
              }else{
                  
              if(buttonLabels){
                    navigator.notification.confirm(
                            message,  // message
                            onConfirm,              // callback to invoke with index of button pressed
                            title,            // title
                            buttonLabels          // buttonLabels
                     );
                }else{
                    buttonLabels="取消, 确定";
                    navigator.notification.confirm(
                                message,  // message
                                function(button){
                                    if(button=="确定"){
                                        onConfirm.call(this);
                                        return;
                                    }
                                    if(button==2){
                                        onConfirm.call(this);
                                        return;
                                    }
                                },               
                                title,
                                buttonLabels
                   );
                }
             } 
        
        },
        
        //弹出框
        alert : function(message, completeCallback, title, buttonLabel){
			if(navigator && navigator.notification && navigator.notification.alert){
				completeCallback = completeCallback || function(){};
				title = title || "提示";
				buttonLabel = buttonLabel || "确定";
				
				navigator.notification.alert(message,completeCallback,title,buttonLabel);
                
			}else{
				window.alert(message);
			}
		},
        
		//显示jqm-loading
		showLoading: function(){
			$.mobile.loadingMessageTextVisible = true;
			$.mobile.showPageLoadingMsg("a", "加载中..." );
		},
        
		//隐藏jqm-loading
		hideLoading: function(){
			$.mobile.hidePageLoadingMsg();
		},
        
        //退出程序
        exit: function(){
        
            navigator.app.exitApp();
        
        },

        toDate: function(dateString){
            return new Date(Date.parse(dateString.replace(/-/g, "/")));
        },

        extendDate: function(){

            Date.prototype.Format = function(fmt)
            {
                //author: meizz
                var o =
                {
                    "M+" : this.getMonth() + 1, //月份
                    "d+" : this.getDate(), //日
                    "h+" : this.getHours(), //小时
                    "m+" : this.getMinutes(), //分
                    "s+" : this.getSeconds(), //秒
                    "q+" : Math.floor((this.getMonth() + 3) / 3), //季度
                    "S" : this.getMilliseconds() //毫秒
                };
                if (/(y+)/.test(fmt))
                    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt))
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
            }

            Date.prototype.addDays = function(d)
            {
               this.setDate(this.getDate() + d);
            };

            Date.prototype.addWeeks = function(w)
            {
               this.addDays(w * 7);
            };

            Date.prototype.addMonths= function(m)
            {
               var d = this.getDate();
               this.setMonth(this.getMonth() + m);

               if (this.getDate() < d)
                   this.setDate(0);
            };

            Date.prototype.addYears = function(y)
            {
               var m = this.getMonth();
               this.setFullYear(this.getFullYear() + y);

               if (m < this.getMonth())
               {
                   this.setDate(0);
               }
            };
            //测试 var now = new Date(); now.addDays(1);//加减日期操作 alert(now.Format("yyyy-MM-dd"));

            Date.prototype.dateDiff = function(interval, endTime)
            {
                switch (interval)
                {
                    case "s":   //計算秒差
                        return parseInt((endTime - this)/1000);
                    case "n":   //計算分差
                        return parseInt((endTime - this)/60000);
                    case "h":   //計算時差
                        return parseInt((endTime - this)/3600000);
                    case "d":   //計算日差
                        return parseInt((endTime - this)/86400000);
                    case "w":   //計算週差
                        return parseInt((endTime - this)/(86400000*7));
                    case "m":   //計算月差
                        return (endTime.getMonth() + 1) + ((endTime.getFullYear() - this.getFullYear()) * 12) - (this.getMonth() + 1);
                    case "y":   //計算年差
                        return endTime.getFullYear() - this.getFullYear();
                    default:    //輸入有誤
                        return undefined;
                }
            }
            //测试 var starTime = new Date("2007/05/12 07:30:00");     var endTime = new Date("2008/06/12 08:32:02");     document.writeln("秒差: "+starTime .dateDiff("s",endTime )+"<br>");     document.writeln("分差: "+starTime .dateDiff("n",endTime )+"<br>");     document.writeln("時差: "+starTime .dateDiff("h",endTime )+"<br>");     document.writeln("日差: "+starTime .dateDiff("d",endTime )+"<br>");     document.writeln("週差: "+starTime .dateDiff("w",endTime )+"<br>");     document.writeln("月差: "+starTime .dateDiff("m",endTime )+"<br>");     document.writeln("年差: "+starTime .dateDiff("y",endTime )+"<br>");
        },

        extendString: function(){
            String.prototype.realLength = function() {
                var length = 0;
                var item = this.split("");
                for (var i = 0; i < item.length; i++) {
                    if (item[i].charCodeAt(0) < 299) {
                        length++;
                    } else {
                        length += 2;
                    }
                }
                return length;
            }
        },

        getEndDayOfMonth: function(){
            var dateNow = new Date();
            var dateNowMonth = new Date(dateNow.getFullYear(), dateNow.getMonth(), 0);
            return dateNowMonth.Format("yyyy-MM-dd");
        },

        clone: function(object) {
            var text = JSON.stringify(object);
            return JSON.parse(text);
        }

    }
	 
    return Utils;
});