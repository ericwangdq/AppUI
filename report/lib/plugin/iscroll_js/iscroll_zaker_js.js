
var myScroll;

function loaded() {
	
	var win = $(window).height();
   //alert(win)
   $("#wrapper-zaker").height(win-45);
   
   //动态计算li的宽和外层总宽
   var daily_win = $("#daily-page #thelist li").width();
   var daily_len = $("#daily-page #thelist li").length;
   $("#daily-page #thelist li").width(daily_win);
   $("#scroller").width(daily_win*daily_len);
   
   
	myScroll = new iScroll('wrapper-zaker', {
		snap: true,
		momentum: false,
		hScrollbar: false,
		onScrollEnd: function () {
			//alert(1);
            //var left = document.querySelector('#indicator > li.active').offsetLeft;
			//document.querySelector('#indicator > li.active').className = '';
			//document.querySelector('#indicator > li:nth-child(' + (this.currPageX+1) + ')').className = 'active';
            //myScroll.refresh();
		}
       
	 });
}
document.addEventListener('DOMContentLoaded', loaded, false);


