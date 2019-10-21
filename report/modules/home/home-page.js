/**
 * Created by Eric on 9/22/2014.
 */

define(['jquery','underscore', 'backbone',
        'draw',
        'utilities/session',
        'utilities/local',
        'config/config',
        'utils',
        'pageUtils/pageUtils',
        'home/home-page/home-collection',
        'home/home-page/home-model',
        'text!home/home-page/home-page.html',
        'text!settingPanel',
        'text!companyPanel',
        'text!toolbar',
        'home/home-page/data-info-view',
        'home/home-page/bar-info-view',
        'home/home-page/percentage-info-view',
        'home/home-page/group-info-view',
        'iscrollProbe',
        'highcharts/highcharts',
        'css!home/common/css/home-page.css'],

    function($, _, Backbone,
             Draw,
             Session,
             Local,
             Config,
             Utils,
             PageUtils,
             HomeCollection,
             HomeModel,
             HomePageTemplate,
             SettingPanelHTML,
             CompanyPanelHTML,
             ToolbarHTML,
             DataInfoView,
             BarInfoView,
             PercentageInfoView,
             GroupInfoView
            ) {

        'use strict';

        var HomePage = Backbone.View.extend({

            model: null,

            template: _.template(HomePageTemplate + SettingPanelHTML + CompanyPanelHTML + ToolbarHTML),

            dataInfoView: null,

            barInfoView: null,

            percentageInfoView: null,

            groupInfoView: null,

            groupData: null,

            homeCollection: null,

            originalHomeCollection: null,

            reportDate: null,

            pageLoaded: false,

            events: {
                'click #data-info-tab': 'addDataInfo',
                'click #bar-info-tab': 'addBarInfo',
                'click #percentage-info-tab': 'addPercentageInfo'
            },

            //用于创建el下的属性
            attributes: function() {
                return{
                    'data-role': 'page',
                    'class': 'layout',
                    'id': 'home-page',
                    'data-theme': 'metal'
                }
            },

            initialize: function() {
                var me = this;

            },

            urlParams: function(params){
                var me = this;
                //params[0];
                //console.log(JSON.stringify(params) + params.length);
            },

            render: function(){
                var me = this;
                me.el.innerHTML = me.template();

                Local.set("isSkip", true);

                $(document).off("click", "#home-page a.back-page");
                $(document).on("click", "#home-page a.back-page", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    me.showGrouping();
                });

                $(document).off("vclick", "#home-page #expand-all");
                $(document).on("vclick", "#home-page #expand-all", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    me.showBasic();
                });

                $(document).off("vclick", "#home-page #data-info div.row-header li");
                $(document).on("vclick", "#home-page #data-info div.row-header li", function (event) {
                    event.preventDefault();
                    var code = $(this).attr("data-attr");
                    window.location.href = "#page/subreport/" + code +"/"+me.reportDate;
                });

                $(document).off("vclick", "#home-page a.company-setting");
                $(document).on("vclick", "#home-page a.company-setting", function (event) {
                    event.preventDefault();
                    //none pop fade flip turn flow slide slidefade slideup slidedown
                    $( "#popup-company" ).popup("open",{
                            transition: "pop"
                     });
                });

                $(document).off("vclick", "#home-page a.done");
                $(document).on("vclick", "#home-page a.done", function (event) {
                    event.preventDefault();
                    //$( "#popupArrow" ).popup( "open", { x: evt.pageX, y: evt.pageY } );
                    $( "#popup-company" ).popup("close");
                    me.filterCompany();
                });

                $(document).off("vclick", "#home-page a.company");
                $(document).on("vclick", "#home-page a.company", function (event) {
                    event.preventDefault();
                    var icon = $(this).find("span");
                    if(icon.hasClass("selected")){
                        icon.removeClass("selected").addClass("normal");
                    }else{
                        icon.removeClass("normal").addClass("selected");
                    }
                });

                $(document).off("change", "#home-page #date-value");
                $(document).on("change", "#home-page #date-value", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var date = $(event.target).val();
                    if(date != "") {
                        me.reportDate = date;
                        me.homeCollection = new HomeCollection();
                        me.listenTo(me.homeCollection,'renderContent',me.renderContent);
                        me.listenTo(me.homeCollection, 'error', me.error);
                        me.listenTo(me.homeCollection, 'emptyData', me.emptyData);
                        me.homeCollection.homeData(me.reportDate);
                    }
                });

            },

            fillData: function(){
                var me = this;

                console.log("Home fillData " + me.reportDate);
                if(!me.homeCollection) {
                    me.homeCollection = new HomeCollection();
                    me.listenTo(me.homeCollection,'renderContent',me.renderContent);
                    me.listenTo(me.homeCollection, 'error', me.error);
                    me.listenTo(me.homeCollection, 'emptyData', me.emptyData);
                    me.homeCollection.homeData(me.reportDate);
                }
            },

            renderContent: function(){
                var me = this;
                //console.log("Homepage RenderContent Home collection: " + me.reportDate + " " + JSON.stringify(me.homeCollection));
                me.originalHomeCollection = me.homeCollection.clone();
                me.groupData = me.homeCollection.groupData;
                var isLeader = Session.get("isLeader");
                var isDisplayedNormal = $("#home-tabs").css("display") == "block";
                if(isLeader != null && isLeader && !isDisplayedNormal){
                    me.showGrouping();
                }
                else{
                    if(isLeader != null && isLeader) {
                        me.showBasic();
                    }
                    else{
                        me.showNormalView();
                    }
                }
                me.renderGroupInfo();
                me.filterCompany();

            },

            refresh:function(){
                var me = this;
                me.homeCollection.homeData(me.reportDate);
            },

            error: function(message){
                var me = this;
                PageUtils.refresh(me.$el.find("div.generic-wrapper.ui-content"), me, "数据加载失败，" + message);
            },

            emptyData: function(){
                var me = this;
                PageUtils.message(me.$el.find("div.generic-wrapper.ui-content"), Config.emptyData);
            },

            renderCompleted: function() {
                var me = this;

                $("div.page-footer a.ui-btn").removeClass("ui-btn-active");
                $("div.page-footer a.inventory").addClass("ui-btn-active");

                if(!me.pageLoaded) {

                    //days
                    for (var i = 1; i <= 7; i++) {
                        var dateNowDay = new Date();
                        dateNowDay.addDays(-i);//加减日期操作 alert(now.Format("yyyy-MM-dd"));
                        //console.log(dateNow.Format("yyyy-MM-dd"))
                        $("#date-value").append("<option value=\"" + dateNowDay.Format("yyyy-MM-dd") + "\">" + "近" + i +"天：" + dateNowDay.Format("yyyy/MM/dd") + "</option>");
                    }

                    //weeks
                    var dateNowWeek = new Date();
                    if(dateNowWeek.getDay() > 5) {
                        for (var i = 0; i < 10; i++) {
                            var dateWeek = new Date();
                            dateWeek.addDays(5 - dateWeek.getDay());
                            dateWeek.addWeeks(-i);
                            $("#date-value").append("<option value=\"" + dateWeek.Format("yyyy-MM-dd") + "\">" + "近" + (i+1) + "周：" + dateWeek.Format("yyyy/MM/dd") + "</option>");
                        }
                    }else{
                        for (var i = 1; i <= 10; i++) {
                            var dateWeek = new Date();
                            dateWeek.addDays(5 - dateWeek.getDay());
                            dateWeek.addWeeks(-i);
                            $("#date-value").append("<option value=\"" + dateWeek.Format("yyyy-MM-dd") + "\">" + "近" + i + "周：" + dateWeek.Format("yyyy/MM/dd") + "</option>");
                        }
                    }

                    //months
                    var dateNow = new Date();
                    for (var i = 0; i <= 12; i++) {
                        var dateNowMonth = new Date(dateNow.getFullYear(), dateNow.getMonth() - i, 0);
                        //console.log(dateNowMonth.Format("yyyy/MM/dd"));
                        $("#date-value").append("<option value=\"" + dateNowMonth.Format("yyyy-MM-dd") + "\">" + "近" + (i + 1) +"月：" +  dateNowMonth.Format("yyyy/MM/dd") + "</option>");
                    }

                    //yesterday report
                    var dateNowDay = new Date();
                    dateNowDay.addDays(-1);
                    me.reportDate = dateNowDay.Format("yyyy-MM-dd");

                    //select yesterday
                    $("#date-value").val(me.reportDate);

                    //refresh
                    $("#date-value").selectmenu('refresh');

                    PageUtils.getCompanies();


                    //me.showBasic();
                    me.pageLoaded = true;
                }

//                $(window).on("orientationchange", function(event) {
//                    alert("This device is in " + event.orientation + " mode!" );
//                    me.renderBarInfo();
//                    me.renderDataInfo();
//                    me.renderPercentageInfo();
//                    me.renderGroupInfo();
//                });

                Draw.start('blue',[]);
            },

            filterCompany: function(){
                var me = this;
                me.homeCollection = me.originalHomeCollection.clone();
                $.each($("#popup-company a.company"), function(index, item){
                    if(!$(item).find("span").hasClass("selected")){
                        var companyCode = $(item).attr("data-attr");
                        var companies = me.homeCollection.filter(function(company){
                            return company.get('companyCode') != companyCode;
                        });
                        me.homeCollection = new Backbone.Collection(companies);
                    }
                });

//                console.log(me.homeCollection.length);
//                console.log(me.originalHomeCollection.length);

                me.refreshView();
            },

            addDataInfo: function(){
                var me = this;
                $('#data-info-tab').addClass("tab-active");
                $('#bar-info-tab, #percentage-info-tab').removeClass('tab-active').removeClass('ui-btn-active');
                me.renderDataInfo();

                return false;
            },

            addBarInfo: function(){
                var me = this;
                $('#bar-info-tab').addClass("tab-active");
                $('#data-info-tab, #percentage-info-tab').removeClass('tab-active').removeClass('ui-btn-active');
                me.renderBarInfo();
                return false;
            },

            addPercentageInfo: function(){
                var me = this;
                $('#percentage-info-tab').addClass("tab-active");
                $('#data-info-tab, #bar-info-tab').removeClass('tab-active').removeClass('ui-btn-active');
                me.renderPercentageInfo();
                return false;
            },

            renderDataInfo: function(){
                var me = this;
                me.dataInfoView = new DataInfoView();
                me.dataInfoView.fillData(me.$el, me.homeCollection);
                //me.$el.find('#data-info').html(me.dataInfoView.el);
                me.dataInfoView.renderCompleted();
            },

            renderBarInfo: function(){
                var me = this;
                me.barInfoView = new BarInfoView();
                me.barInfoView.reportDate = me.reportDate;
                me.barInfoView.fillData(me.$el, me.homeCollection);
                me.$el.find('#bar-info').html(me.barInfoView.el);
                me.barInfoView.renderCompleted();
            },

            renderPercentageInfo: function(){
                var me = this;
                me.percentageInfoView = new PercentageInfoView();
                me.percentageInfoView.reportDate = me.reportDate;
                me.percentageInfoView.fillData(me.$el, me.homeCollection);
                me.$el.find('#percentage-info').html(me.percentageInfoView.el);
                me.percentageInfoView.renderCompleted();
            },

            refreshView: function(){
                var me = this;
                PageUtils.cleanMessage(me.$el.find("div.generic-wrapper.ui-content"));
                if(me.homeCollection != null) {
                    if ($("#data-info").attr("aria-expanded") == "true") {
                        me.renderDataInfo();
                    }
                    else if ($("#bar-info").attr("aria-expanded") == "true") {
                        me.renderBarInfo();
                    }
                    else if ($("#percentage-info").attr("aria-expanded") == "true") {
                        me.renderPercentageInfo();
                    }
                    else {
                        me.renderBarInfo();
                        me.renderDataInfo();
                        me.renderPercentageInfo();
                    }
                }
            },

            showBasic: function(){
               var me = this;
               $("a.setting, #grouping").hide();
               $("a.back-page, #home-tabs, a.company-setting").show();
               //$("a.setting").show(); $("a.back-page").hide();
               me.refreshView();
            },

            showGrouping: function(){
                var me = this;
                $("a.setting, #grouping").show();
                $("a.back-page, #home-tabs, a.company-setting").hide();
                if(me.groupData != null) {
                    me.renderGroupInfo();
                }
            },

            showNormalView: function(){
                var me = this;
                $("a.back-page, #grouping").hide();
                $("a.setting, #home-tabs, a.company-setting").show();
                //$("a.setting").show(); $("a.back-page").hide();
                me.refreshView();
            },

            renderGroupInfo: function(){
                var me = this;
                me.groupInfoView = new GroupInfoView();
                me.groupInfoView.reportDate = me.reportDate;
                me.groupInfoView.fillData(me.$el, me.groupData.toJSON());
                me.$el.find('#group-info').html(me.groupInfoView.el);
                me.groupInfoView.renderCompleted();
            }

        });

        return HomePage;

    });

