(function () {
    var loadingUrl = 'lib/loading',
        pluginUrl = 'lib/plugin',
        moduleUrl = 'js/module',
        config = 'js/config',
        sdkUrl='js/sdk';
    
    require.config({
        
        paths: {

            //Phonegap
            cordova: 'cordova',
            cordovaPlugin: moduleUrl +'/cordovaPlugin',

            //Libraries
            jquery: loadingUrl + '/jquery/jquery-2.1.0',
            backbone: loadingUrl + '/backbone/backbone1.12',
            underscore: loadingUrl + '/underscore/underscore1.60',
            jqm: loadingUrl + '/jmobile/jquery.mobile-1.4.5',

            //Settings
            jqmconfig: config + '/jqm.config',
            text: loadingUrl + '/require/text2.0.12',
            baseCss: 'css',

            //SDK
            base: sdkUrl + '/base',
            components: sdkUrl + '/components',
            services: sdkUrl + '/services',
            utilities: sdkUrl + '/utilities',
            utils: sdkUrl + '/utilities/utils',
            iscrollProbe: sdkUrl + '/components/iscroll/iscroll-probe',
            highcharts: sdkUrl + '/components/highcharts',

            //Config
            config: config,

            //Plugin
            json: pluginUrl + '/json/json2',
            draw: sdkUrl + '/utilities/draw',
            swiper: pluginUrl + '/swiper',

            //Module
            router: moduleUrl + "/router",
            render: moduleUrl + "/render",
            view: moduleUrl + "/view",
            userSession: moduleUrl + "/userSession",

            css: loadingUrl + '/require/css',

            //Entry
            app: 'js/app',

            //about
            about: 'modules/about',
            aboutPage: 'modules/about/about-page',

            //home
            home: 'modules/home',
            homePage: 'modules/home/home-page',

            //subreport
            subreport: 'modules/subreport',
            subreportPage: 'modules/subreport/subreport-page',

            //maincategory
            maincategory: 'modules/maincategory',
            maincategoryPage: 'modules/maincategory/maincategory-page',

            //subcategory
            subcategory: 'modules/subcategory',
            subcategoryPage: 'modules/subcategory/subcategory-page',

            //directional
            directional: 'modules/directional',
            directionalPage: 'modules/directional/directional-page',

            //aging
            aging: 'modules/aging',
            agingPage: 'modules/aging/aging-page',
            subaging: 'modules/subaging',
            subagingPage: 'modules/subaging/subaging-page',
            agingcategory: 'modules/agingcategory',
            agingcategoryPage: 'modules/agingcategory/agingcategory-page',

            //turnover
            turnover: 'modules/turnover',
            turnoverPage: 'modules/turnover/turnover-page',
            subturnover: 'modules/subturnover',
            subturnoverPage: 'modules/subturnover/subturnover-page',
            turnovercategory: 'modules/turnovercategory',
            turnovercategoryPage: 'modules/turnovercategory/turnovercategory-page',

            //email
            email: 'modules/email',
            emailPage: 'modules/email/email-page',

            //introduction
            introduction: 'modules/introduction',
            introductionPage: 'modules/introduction/introduction-page',

            //Common
            pageUtils: 'modules/common/pageUtils',
            panel: 'modules/common/panel',
            settingPanel: 'modules/common/panel/setting-panel.html',
            companyPanel: 'modules/common/panel/company-panel.html',
            toolbar: 'modules/common/panel/toolbar.html'
        },
        
        shim: {

            'underscore': {
                exports: '_'
            },

            'backbone': {
                deps: ['jquery', 'underscore'],
                exports: 'Backbone'
            }
        }
    });

    require(['jquery','app','jqmconfig','cordova'], function($, App, Jqmconfig) {
        $(function() {
            App.init();
        });
    });
    
})();
