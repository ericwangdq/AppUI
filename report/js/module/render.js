/* We define a global variable 'namespace' as module manager*/
//'css!baseCss/reset', 'css!baseCss/base',  'css!jqmCss', 'codeBinding',
/* start application*/
define(['jquery','underscore', 'backbone', 'view',
        'introductionPage',
        'aboutPage',
        'homePage',
        'subreportPage',
        'maincategoryPage',
        'subcategoryPage',
        'directionalPage',
        'agingPage',
        'subagingPage',
        'agingcategoryPage',
        'turnoverPage',
        'subturnoverPage',
        'turnovercategoryPage',
        'emailPage',
        'css!baseCss/jqmCss.css',
        'css!baseCss/style.css',
        'css!baseCss/metal.css'],

    function($, _, Backbone, View, IntroductionPage, AboutPage, HomePage, SubreportPage,
             MainCategoryPage, SubCategoryPage, DirectionalPage,
             AgingPage, SubAgingPage, AgingCategoryPage,
             TurnoverPage, SubTurnoverPage, TurnoverCategoryPage,
             EmailPage){

        'use strict';

        //装载所有的view
        var allView = {
            introductionPage: IntroductionPage,
            aboutPage: AboutPage,
            homePage: HomePage,
            subreportPage: SubreportPage,
            maincategoryPage: MainCategoryPage,
            subcategoryPage: SubCategoryPage,
            directionalPage: DirectionalPage,
            agingPage: AgingPage,
            subagingPage: SubAgingPage,
            agingcategoryPage: AgingCategoryPage,
            turnoverPage: TurnoverPage,
            subturnoverPage: SubTurnoverPage,
            turnovercategoryPage: TurnoverCategoryPage,
            emailPage: EmailPage
        };

        var Render = {

            _VIEWROOTPATH: './plugins/',
            _fetchFlag: true,
            _currentPage: {},
            _firstPage: true,
            showPage: function(page_name, params) {

                var viewPage = page_name + 'Page';

                //实例化
                if (!View[viewPage]) {

                    View[viewPage] = new allView[viewPage]();

                }

                Render._currentPage = View[viewPage];

                console.log(viewPage);
                //console.log(JSON.stringify(Render._currentPage));

                if(Render._currentPage.urlParams){
                    Render._currentPage.urlParams(params);
                    console.log('完成对' + page_name + ' --->urlParams方法渲染...');
                }

                if (!Render._currentPage.el || !Render._currentPage.el.innerHTML) {
                    Render._currentPage.render();
                    console.log('完成对' + page_name + ' --->render方法渲染...');
                }


                // _currentPage.transition = false;   //动画效果
                document.body.appendChild(Render._currentPage.el);
                //console.log(JSON.stringify(Render._currentPage.el));

                //var transition={};
                //if(CordovaPlugin.isCordovaAvailable()){
                //    if(device.platform.toLowerCase()=="ios"){
                //transition={
                //    changeHash: false,
                //    transition:Render._currentPage.transition || $.mobile.defaultPageTransition
                //};
                //  };
                //};
                //$.mobile.changePage($('#' + page_name + '-page'),transition);

                var transition = $.mobile.defaultPageTransition;
                // We don't want to slide the first page
                if (Render._firstPage) {
                    transition = 'none';
                    Render._firstPage = false;
                }

                $.mobile.pageContainer.pagecontainer('change', $('#' + page_name + '-page'), {
                    transition: transition,
                    changeHash: false,
                    reverse: false
                });

            },

            showPageCompleted: function(page_name){

                if (Render._currentPage.el) {
                    Render._currentPage.$el = $(Render._currentPage.el);
                    Render._currentPage.delegateEvents();
                }

                if (Render._currentPage.renderCompleted) {
                    //$(window).off("orientationchange");
                    Render._currentPage.renderCompleted();
                    console.log('完成对' + page_name + ' --->renderCompleted方法渲染...');
                }

                if (Render._currentPage.fillData && Render._fetchFlag) {
                    Render._currentPage.fillData();
                    console.log('完成对' + page_name + ' --->fillData方法渲染...');
                }

                if (!Render._fetchFlag) {
                    Render._fetchFlag = true;
                }

            },

            /**
             * Get current page
             */
            currentPage: function () {
                return Render._currentPage;
            },

            /**
             * Indicate whether data should be fetched again, when this flag is set as false, current will
             * not fetch data for only one time and then set to be true.
             * @param {boolean} flag False if current view do not need to fetch data again
             */
            setFecthFlag: function (flag) {
                Render._fetchFlag = flag;
            },

            /**
             * Create a view instance by specified name
             * @param {string} view_name Name of the view
             * @example view_name
             *      'SocialBlogView',
             *      'FooterView'
             */
            getViewInstance: function (view_name) {

                if (!View[view_name]) {
                    var tmp_arr = view_name.match(/[A-Z][a-z]+/g);
                    for (var i = 0, len = tmp_arr.length; i < len; i++) {
                        tmp_arr[i] = tmp_arr[i].toLowerCase();
                    }
                    try {
                        Render._loadView(Render._VIEWROOTPATH + tmp_arr.join('-') + '.js');
                    } catch(err) {
                        console.log('err is ---> ' + err);
                        console.error('view_name --> *' + view_name + '* may not be right!');
                        return null;
                    }
                }

                var instance = new View[view_name]();
                instance.$el = $(instance.el);
                instance.delegateEvents();

                return instance;
            },


            _loadView: function(path){

                //CordovaPlugin.loadScriptSynchronously(path);
                console.log("CordovaPlugin.loadScriptSynchronously(path);");
            }

        }

        return Render;

    });