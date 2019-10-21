/**
 * Created by Eric on 12/24/2014.
 */

define(['jquery','underscore', 'backbone',
        'draw',
        'utilities/session',
        'config/config',
        'utils',
        'pageUtils/pageUtils',
        'aging/aging-page/aging-collection',
        'aging/aging-page/aging-model',
        'text!aging/aging-page/aging-page.html',
        'text!settingPanel',
        'text!companyPanel',
        'text!toolbar',
        'aging/aging-page/data-info-view',
        'aging/aging-page/bar-info-view',
        'aging/aging-page/percentage-info-view',
        'iscrollProbe',
        'highcharts/highcharts',
        'css!aging/common/css/aging-page.css'],

    function($, _, Backbone,
             Draw,
             Session,
             Config,
             Utils,
             PageUtils,
             AgingCollection,
             AgingModel,
             AgingPageTemplate,
             SettingPanelHTML,
             CompanyPanelHTML,
             ToolbarHTML,
             DataInfoView,
             BarInfoView,
             PercentageInfoView) {

        'use strict';

        var AgingPage = Backbone.View.extend({

            model: null,

            template: _.template(AgingPageTemplate + SettingPanelHTML + ToolbarHTML + CompanyPanelHTML),

            dataInfoView: null,

            barInfoView: null,

            agingCollection: null,

            originalAgingCollection: null,

            companyCollection: null,

            originalCompanyCollection: null,

            reportDate: null,

            categoryCode: null,

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
                    'id': 'aging-page',
                    'data-theme': 'metal'
                }
            },

            initialize: function() {
                var me = this;

                me.categoryCode = Config.code.category.M1;
            },

            urlParams: function(params){
                var me = this;
                //params[0];
                //console.log(JSON.stringify(params) + params.length);
            },

            render: function(){
                var me = this;
                me.el.innerHTML = me.template();

                $(document).off("vclick", "#aging-page div.row-header li");
                $(document).on("vclick", "#aging-page div.row-header li", function (event) {
                    event.preventDefault();
                    var code = $(this).attr("data-attr");
                    window.location.href = "#page/subaging/" + code + "/" + me.reportDate;
                });

                $(document).off("vclick", "#aging-page a.company-setting");
                $(document).on("vclick", "#aging-page a.company-setting", function (event) {
                    event.preventDefault();
                    //$( "#popupArrow" ).popup( "open", { x: evt.pageX, y: evt.pageY } );
                    //none pop fade flip turn flow slide slidefade slideup slidedown
                    $( "#popup-company" ).popup("open",{
                        transition: "pop"
                    });
                });

                $(document).off("vclick", "#aging-page a.done");
                $(document).on("vclick", "#aging-page a.done", function (event) {
                    event.preventDefault();
                    //$( "#popupArrow" ).popup( "open", { x: evt.pageX, y: evt.pageY } );
                    $( "#popup-company" ).popup("close");
                    me.filterCompany();
                });

                $(document).off("vclick", "#aging-page a.company");
                $(document).on("vclick", "#aging-page a.company", function (event) {
                    event.preventDefault();

                    var icon = $(this).find("span");
                    if(icon.hasClass("selected")){
                        icon.removeClass("selected").addClass("normal");
                    }else{
                        icon.removeClass("normal").addClass("selected");
                    }
                });

                $(document).off("change", "#aging-page #date-value");
                $(document).on("change", "#aging-page #date-value", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var dateValue = $(event.target).val();
                    if(dateValue != "") {
                        me.reportDate = dateValue;
                        me.agingCollection = new AgingCollection();
                        me.listenTo(me.agingCollection, 'renderContent', me.renderContent);
                        me.listenTo(me.agingCollection, 'error', me.error);
                        me.listenTo(me.agingCollection, 'emptyData', me.emptyData);
                        me.agingCollection.agingData(me.reportDate);
                    }
                });

                $(document).off("change", "#aging-page #category-value");
                $(document).on("change", "#aging-page #category-value", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var categoryValue = $(event.target).val();
                    if(categoryValue != "") {
                        me.categoryCode = categoryValue;
                        console.log(me.categoryCode);
                        me.filterCategory();
                        me.filterCompany();
                    }
                });
            },

            fillData: function(){
                var me = this;
                //todo hard code report date
                //me.reportDate = '2014-12-22';
                console.log("Aging fillData " + me.reportDate);
                var me = this;
                if(!me.agingCollection) {
                    me.agingCollection = new AgingCollection();
                    me.listenTo(me.agingCollection,'renderContent',me.renderContent);
                    me.listenTo(me.agingCollection, 'error', me.error);
                    me.listenTo(me.agingCollection, 'emptyData', me.emptyData);
                    me.agingCollection.agingData(me.reportDate);
                }
            },

            renderContent: function(){
                var me = this;
                //console.log("Agingpage RenderContent aging collection: " + JSON.stringify(me.agingCollection.toJSON()));
                me.originalAgingCollection = me.agingCollection.clone();
                me.filterCategory();
                me.filterCompany();
            },

            refresh:function(){
                var me = this;
                me.agingCollection.agingData(me.reportDate);
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
                $("div.page-footer a.aging").addClass("ui-btn-active");

                if(!me.pageLoaded) {

                    //weeks
                    var dateNowWeek = new Date();
                    if(dateNowWeek.getDay() > 5) {
                        dateNowWeek.addDays(5 - dateNowWeek.getDay());
                        for (var i = 0; i < 10; i++) {
                            var dateWeek = new Date();
                            dateWeek.addDays(5 - dateWeek.getDay());
                            dateWeek.addWeeks(-i);
                            $("#date-value").append("<option value=\"" + dateWeek.Format("yyyy-MM-dd") + "\">" + "近" + (i+1) + "周：" + dateWeek.Format("yyyy/MM/dd") + "</option>");
                        }
                    }else{
                        dateNowWeek.addDays(5 - dateNowWeek.getDay());
                        dateNowWeek.addWeeks(-1);
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

                    //if today > friday display this weekend, otherwise display last weekend
                    me.reportDate = dateNowWeek.Format("yyyy-MM-dd");

                    //select yesterday
                    $("#date-value").val(me.reportDate);

                    $.each(Config.categories,function(index, category){
                        $("#category-value").append("<option value=\"" + category.code + "\">" + category.name + "</option>");
                    });

                    //refresh
                    $("#date-value").selectmenu('refresh');
                    $("#category-value").selectmenu('refresh');

                    PageUtils.getCompanies();

                    me.pageLoaded = true;
                }

                Draw.start('blue',[]);
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

            filterCompany: function(){
                var me = this;
                me.companyCollection = me.originalCompanyCollection.clone();
                $.each($("#popup-company a.company"), function(index, item){
                    if(!$(item).find("span").hasClass("selected")){
                        var companyCode = $(item).attr("data-attr");
                        var companies = me.companyCollection.filter(function(company){
                            return company.get('companyCode') != companyCode;
                        });
                        me.companyCollection = new Backbone.Collection(companies);
                    }
                });

//                console.log(me.homeCollection.length);
//                console.log(me.originalHomeCollection.length);
                me.refreshView();
            },

            filterCategory: function(){
                var me = this;

                var category = me.agingCollection.filter(function(categories){
                    return categories.get('categoryCode') === me.categoryCode;
                });
                var categoryJSON = new Backbone.Collection(category).toJSON();
                if(categoryJSON != null && categoryJSON.length > 0){
                    me.companyCollection  = categoryJSON[0].companies;
                }
                else
                {
                    me.companyCollection  = new Backbone.Collection();
                }
                me.originalCompanyCollection = me.companyCollection.clone();

                //console.log("Agingpage RenderContent company collection: " + JSON.stringify(me.companyCollection.toJSON()));
                //me.refreshView();
            },

            renderDataInfo: function(){
                var me = this;
                me.dataInfoView = new DataInfoView();
                me.dataInfoView.fillData(me.$el, me.companyCollection);
                //me.$el.find('#data-info').html(me.dataInfoView.el);
                //me.dataInfoView.renderContent();
                me.dataInfoView.renderCompleted();
            },

            renderBarInfo: function(){
                var me = this;
                me.barInfoView = new BarInfoView();
                me.barInfoView.reportDate = me.reportDate;
                me.barInfoView.fillData(me.$el, me.companyCollection);
                me.$el.find('#bar-info').html(me.barInfoView.el);
                me.barInfoView.renderCompleted();
            },

            renderPercentageInfo: function(){
                var me = this;
                me.percentageInfoView = new PercentageInfoView();
                me.percentageInfoView.reportDate = me.reportDate;
                me.percentageInfoView.fillData(me.$el, me.companyCollection);
                me.$el.find('#percentage-info').html(me.percentageInfoView.el);
                me.percentageInfoView.renderCompleted();
            },

            refreshView:function(){
                var me = this;
                if($("#data-info").attr("aria-expanded") == "true"){
                    me.renderDataInfo();
                }
                else if($("#bar-info").attr("aria-expanded") == "true"){
                    me.renderBarInfo();
                }
                else
                {
                    me.renderBarInfo();
                    me.renderDataInfo();
                }
            }

        });

        return AgingPage;

    });

