({
    dir: '../www-built',
    optimize: 'uglify',
    paths: {
        cordova: 'empty:',
        jquery: 'lib/loading/jquery/jquery-2.1.0',
        backbone:'lib/loading/backbone/backbone1.12',
        underscore:'lib/loading/underscore/underscore1.60',
        router:'js/module/router',
        cordovaPlugin:'js/module/cordovaPlugin',
        jqm:'empty:',
        jqmconfig:'js/config/jqm.config',
        utils:'js/sdk/utilities/utils',
        draw:'js/sdk/utilities/draw',
        utilities:'js/sdk/utilities',

        render:'js/module/render',
        view: "js/module/view",
        base: 'js/sdk/base',
        json: 'lib/plugin/json/json2',
        text: 'lib/loading/require/text2.0.12',
        swiper: 'lib/plugin/swiper',

        config: 'js/config',
        services: 'js/sdk/services',
        iscrollProbe: 'js/sdk/components/iscroll/iscroll-probe',
        highcharts: 'js/sdk/components/highcharts',

        css: 'lib/loading/require/css',

        app: 'js/app',

        userSession: "js/module/userSession",

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
    modules: [
        {
            name: "main-mobile"
        }
    ]
})