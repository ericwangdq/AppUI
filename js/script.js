/**
 * Created by Eric on 11/27/2014.
 */

var genericScroll;

$(function () {

    document.addEventListener('touchmove', function (e) {
        e.preventDefault();
    }, false);

    $(document).on("pagebeforeshow", "#my-created", function () {

        $("div.page-footer a.ui-btn").removeClass("ui-btn-active");
        $("div.page-footer a.created").addClass("ui-btn-active");
    });
    $(document).on("pagebeforeshow", "#my-unhandled", function () {

        $("div.page-footer a.ui-btn").removeClass("ui-btn-active");
        $("div.page-footer a.myunhandled").addClass("ui-btn-active");
    });
    $(document).on("pagebeforeshow", "#dep-unhandled", function () {

        $("div.page-footer a.ui-btn").removeClass("ui-btn-active");
        $("div.page-footer a.depunhandled").addClass("ui-btn-active");
    });
    $(document).on("pagebeforeshow", "#my-processed", function () {
        $("div.page-footer a.ui-btn").removeClass("ui-btn-active");
        $("div.page-footer a.processed").addClass("ui-btn-active");
    });
    $(document).on("pageshow", "#contract-detail", function () {

        var targetTab;
        var target = Storage.getItem('target')
        if(target != null && target.length > 0) {
            targetTab = getQueryStringByName('target', target);
        }
        if(targetTab != null && targetTab.length > 0)
        {
//                console.log(targetTab);
            $('#' + targetTab).click();
        }
        else
        {
            Storage.removeItem('target');
            $("#base-info-tab").click();
        }

    });

//    $(document).on("pageshow", "[data-role=page]", function () {
//        if ($('.generic-wrapper').length > 0) {
//            setTimeout(function () {
//                GenericScroll();
//            }, 0);
//        }
//    });

    $(document).on("vclick", "#all-pages ul.ui-group-theme-contract li a.ui-link", function (event) {
        event.preventDefault();
        event.stopPropagation();
        Storage.setItem('target',$(this).attr('href'));
        $.mobile.pageContainer.pagecontainer('change', $(this).attr('href'), {
            transition: "slide",
            changeHash: true,
            reverse: false
        });
    });
    $(document).on("vclick", ".ui-group-theme-contract.ui-listview.linked > li", function (event) {
        event.preventDefault();
        event.stopPropagation();
        $.mobile.pageContainer.pagecontainer('change', $('#contract-detail'), {
            transition: "slide",
            changeHash: true,
            reverse: false
        });
    });
});

var GenericScroll = function() {
    //清除所占的内存空间
    if (genericScroll != null) {
        genericScroll.destroy();
    }

    genericScroll = new IScroll('.generic-wrapper', {
        useTransition: false,    //默认为false
        scrollbars: true,
        mouseWheel: true,
        disableMouse: false,
        disablePointer: false,
        disableTouch: false,
        interactiveScrollbars: true,
        shrinkScrollbars: 'scale',
        fadeScrollbars: true,
        preventDefault: false
    });
    //alert("IScroll loaded!");
};

var Storage = {
    setCache: function (value) {
        window.localStorage.setItem("TempCache", value);
    },
    getCache: function () {
        return  window.localStorage.getItem("TempCache");
    },
    setItem: function (key, value) {
        window.localStorage.setItem(key, value);
    },
    getItem: function (key) {
        return window.localStorage.getItem(key);
    },
    removeItem: function (key) {
        return window.localStorage.removeItem(key);
    },
    clear: function()
    {
        window.localStorage.clear();
    }
};

var getQueryStringByName = function (name, url) {
    var result = url.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
};