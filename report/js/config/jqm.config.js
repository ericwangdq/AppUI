/** jquery mobile 初始化配置  */
define(['jquery'], function($){
  	'use strict';

    // document.firstPage=true;
    $(document).on("mobileinit", function () {
        $.mobile.ajaxEnabled = false;
        $.mobile.linkBindingEnabled = false;
        $.mobile.hashListeningEnabled = false;
        $.mobile.pushStateEnabled = false;
        $.mobile.phonegapNavigationEnable = true;
        //$.mobile.defaultPageTransition = 'slide';
        $.mobile.defaultPageTransition = 'none';
        $.mobile.changePage.defaults.allowSamePageTransition = true;

        $.event.special.tap.tapholdThreshold = 1500;

        $.event.special.swipe.scrollSupressionThreshold = 130;  //水平拖曳大于这个值时，jQuery Mobile 会抑制页面滚动。
        $.event.special.swipe.horizontalDistanceThreshold = 130;  //水平划动距离超过这个数值才会产生滑动事件
        $.event.special.swipe.verticalDistanceThreshold =20; // 垂直拖曳距离小于这个值时才会触发 swipe 事件。
        $.mobile.loadingMessage = "加载中...";
        //$.mobile.pageLoadErrorMessage = "页面加载失败";
        // Prevent 1px jump when transition
        $.mobile.defaultHomeScroll = 0;
        // Set maximum window width for transitions to apply - 'false' for no limit
        $.mobile.maxTransitionWidth = 500;  //超过此宽度,不使用动画转场

        //描述：当滚动超出所设置的高度时才会出发滚动位置记忆功能。当滚动高度没有超过所设置的高度时，后腿到该页面滚动条会到达的顶部。通过设置该选项的数值来减小位置记忆的数据量。
        $.mobile.minScrollBack = 100000000;

        //去掉按钮按下/划过的状态感觉反应有些迟缓,默认200
        $.mobile.buttonMarkup.hoverDelay = 10;

        //阻止点击底部或是顶部栏出现的弹动现像(ios中出现白条)
        //$.mobile.fixedtoolbar.prototype.options.tapToggle = false;
        //$.mobile.fixedtoolbar.prototype.options.hideDuringFocus ="";

        //$.mobile.orientationChangeEnabled = false;

        // Remove page from DOM when it's being replaced
        $(document).on('pagehide','div[data-role="page"]', function (event, ui) {

            var target = $(event.currentTarget);

            //console.log($(event.currentTarget));

            target.detach();
            console.log('Ready to hide ---> ' + event.target.id);
        });

        $(document).on('pageshow', 'div[data-role="page"]', function (event, ui){
            var page_id = event.target.id;

            switch(page_id) {
                case 'blank-page':
                    showBlankPage();
                    break;
                default:
                    break;
            }

            console.log('Ready to show ---> ' + page_id);
        });

        function showBlankPage() {
            // Direct to the first page
            //首次打开页面控制
//            window.location.href = "#page/home";
            window.location.href = "#page/introduction";
        }

    });

});

