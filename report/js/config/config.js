define([], function(){
  	'use strict';
    
    var Config = {

        //Highcharts color
        highchartsColor:{
            basicReport:{
                mit: "#6ec0cf", //原料在途
                rm: "#e7e931",  //原材料
                fp: "#4ce54c",  //成品
                sit: "#faa442", //销售在途
                wip: "#f64c4c"  //在制品
            },
            basicCompanyReport:{
                mit: "#6ec0cf", //原料在途
                rm: "#e7e931",  //原材料
                fp: "#4ce54c",  //成品
                sit: "#faa442", //销售在途
                wip: "#f64c4c"  //在制品
            },
            basicCategoryReport:{
                mit: "#6ec0cf", //原料在途
                rm: "#e7e931",  //原材料
                fp: "#4ce54c",  //成品
                sit: "#faa442", //销售在途
                wip: "#f64c4c"  //在制品
            },
            agingReport:{
                range1: "#6ec0cf", // 1-30天
                range2: "#e7e931", // 31-60天
                range3: "#4ce54c", // 61-90天
                range4: "#faa442", // 91-180天
                range5: "#f64c4c", // 181-365天
                range6: "#ca6adb" //  365以上
            }
        },

        email:{
            disclaimer: "“此封邮件发自宝钢金属领导库存报表移动应用，发件人为$name$（$from-email$）”",
            domain: "@baosteel.com"
        },

        code:{
            company: {
                MYB: "00201",
                BGJSMY: "00201101",
                SHBYZG: "10301",
                SHBGYT: "10305",
                WHBGYT: "10311",
                FSBGYT: "10310",
                BJBGYT: "10306",
                NTBGZP: "BT",
                SHBGXG: "XG",
                JSBGJM: "JSJM",
                NJBRGS: "NJGS"
            },
            category: {
                M1: "m1",
                M2: "m2",
                M3: "m3"
            },
            basicCategory: {
                MIT: "C1",
                RM: "C2",
                FP: "C3",
                SIT: "C4",
                WIP: "C5"
            },
            agingRange: {
                Days30: "R1",
                Days60: "R2",
                Days90: "R3",
                Days180: "R4",
                Days365: "R5",
                Days365GT: "R6"
            },
            unit:{
                Ton: "u1",
                A: "u2",
                Piece: "u3"
            }
        },

        companies:[
            {
                code: "00201",
                name: "贸易部"
            },
            {
                code: "00201101",
                name: "宝钢金属贸易"
            },
            {
                code: "NJGS",
                name: "南京宝日钢丝"
            },
            {
                code: "JSJM",
                name: "江苏宝钢精密"
            },
            {
                code: "XG",
                name: "上海宝钢型钢"
            },
            {
                code: "BT",
                name: "南通宝钢制品"
            },
            {
                code: "10301",
                name: "上海宝翼制罐"
            },
            {
                code: "10305",
                name: "上海宝钢印铁"
            },
            {
                code: "10311",
                name: "武汉宝钢印铁"
            },
            {
                code: "10310",
                name: "佛山宝钢印铁"
            },
            {
                code: "10306",
                name: "北京宝钢印铁"
            }
        ],

        categories:[
            {
                code: "m1",
                name: "原材料"
            },
            {

                code: "m2",
                name: "成品"
            },
            {

                code: "m3",
                name: "热轧钢带"
            }
        ],

        basicCategories:[
            {
                code: "C1",
                name: "采购在途"
            },
            {

                code: "C2",
                name: "原材料"
            },
            {
                code: "C3",
                name: "成品"
            },
            {

                code: "C4",
                name: "销售在途"
            },
            {

                code: "C5",
                name: "在制品"
            }
        ],

        agingRanges: [
            {
                code: "R1",
                name: "1-30天"
            },
            {
                code: "R2",
                name: "31-60天"
            },
            {
                code: "R3",
                name: "61-90天"
            },
            {

                code: "R4",
                name: "91-180天"
            },
            {

                code: "R5",
                name: "181-365天"
            },
            {

                code: "R6",
                name: "365天以上"
            }
        ],

        networkError: '网络错误。',

        NA: "N/A",

        GuestUserTokenID: "1426475587916",

        GuestUserID: "110652",

        getCompanyName: function(code){
            var name = "";
            $.each(this.companies, function(index, company){
                if(company.code == code)
                {
                    name = company.name;
                }
            });

            return name;
        },

        getCompanyCode: function(name){
            var code = "";
            $.each(this.companies, function(index, company){
                if(company.name == name)
                {
                    code = company.code;
                }
            });

            return code;
        },

        getCategoryName: function(code){
            var name = "";
            $.each(this.categories, function(index, category){
                if(category.code == code)
                {
                    name = category.name;
                }
            });

            return name;
        },

        getBasicCategoryName: function(code){
            var name = "";
            $.each(this.basicCategories, function(index, category){
                if(category.code == code)
                {
                    name = category.name;
                }
            });

            return name;
        },

        emptyData: '暂无数据',

        refresh: '点击刷新',

        version: '1.0.7'

    }
    
    return Config;
    
});