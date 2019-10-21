define([], function(){
  	'use strict';
    
    var ServerConfig = {

        //代理服务器地址
        agentServiceUrl: 'http://202.101.47.84/iPlatMBS/AgentService',
        //agentServiceUrl: 'https://mobile.baosteel.com/iPlatMBS/AgentService',

        servicePostData: {
            basicReport:{
                data: {
                },
                attr: {
                    projectName: "inventoryreport",
                    serviceName: "getBasicReport",
                    serviceCode: "baosteelMetal",
                    userId: "",
                    methodName: "",
                    requestType: "get"
                }
            },
            basicCompanyReport:{
                data: {
                },
                attr: {
                    projectName: "inventoryreport",
                    serviceName: "getOneCompanyBasicReport",
                    serviceCode: "baosteelMetal",
                    userId: "",
                    methodName: "",
                    requestType: "get"
                }
            },
            basicMainCategoryReport:{
                data: {
                },
                attr: {
                    projectName: "inventoryreport",
                    serviceName: "getCategoryReport",
                    serviceCode: "baosteelMetal",
                    userId: "",
                    methodName: "",
                    requestType: "get"
                }
            },
            basicSubCategoryReport:{
                data: {
                },
                attr: {
                    projectName: "inventoryreport",
                    serviceName: "getSubCategoryReport",
                    serviceCode: "baosteelMetal",
                    userId: "",
                    methodName: "",
                    requestType: "get"
                }
            },
            basicDirectionalReport:{
                data: {
                },
                attr: {
                    projectName: "inventoryreport",
                    serviceName: "getCustomerReport",
                    serviceCode: "baosteelMetal",
                    userId: "",
                    methodName: "",
                    requestType: "get"
                }
            },
            agingReport:{
                data: {
                },
                attr: {
                    projectName: "inventoryreport",
                    serviceName: "getAgeCategoryReport",
                    serviceCode: "baosteelMetal",
                    userId: "",
                    methodName: "",
                    requestType: "get"
                }
            },
            agingCompanyReport:{
                data: {
                },
                attr: {
                    projectName: "inventoryreport",
                    serviceName: "getAgeOneCompanyCategoryReport",
                    serviceCode: "baosteelMetal",
                    userId: "",
                    methodName: "",
                    requestType: "get"
                }
            },
            agingCategoryReport:{
                data: {
                },
                attr: {
                    projectName: "inventoryreport",
                    serviceName: "getAgeMaterialCategoryReport",
                    serviceCode: "baosteelMetal",
                    userId: "",
                    methodName: "",
                    requestType: "get"
                }
            },
            turnoverReport:{
                data: {
                },
                attr: {
                    projectName: "inventoryreport",
                    serviceName: "getConsumptionMaterialTypeReport",
                    serviceCode: "baosteelMetal",
                    userId: "",
                    methodName: "",
                    requestType: "get"
                }
            },
            turnoverCategoryReport:{
                data: {
                },
                attr: {
                    projectName: "inventoryreport",
                    serviceName: "getConsumptionCategoryReport",
                    serviceCode: "baosteelMetal",
                    userId: "",
                    methodName: "",
                    requestType: "get"
                }
            },
            userCompanies:{
                data: {
                },
                attr: {
                    projectName: "inventoryreport",
                    serviceName: "getCompanyBeanList",
                    serviceCode: "baosteelMetal",
                    userId: "",
                    methodName: "",
                    requestType: "get"
                }
            },
            queryGroupList:{
                attr:{
                    prop2:"prop2",
                    prop1:"prop1",
                    methodName:"queryOrgListByOrgCode",
                    projectName:"spesmobile",
                    serviceName:"yellowPage",
                    requestType:"post",
                    serviceCode:""
                },
                data:{
                    type:"yellowPage",
                    guid:"120101",
                    groupGuid:""
                }
            },
            queryPersonList:{
                attr:{
                    prop2: "prop2",
                    prop1: "prop1",
                    methodName: "queryUsersInfoByGroupGuid",
                    projectName: "spesmobile",
                    serviceName: "yellowPage",
                    requestType: "post",
                    serviceCode: ""
                },
                data:{
                    type: "yellowPage",
                    guid: "120101",
                    groupGuid: ""
                }
            },
            queryUserInfo:{
                attr:{
                    prop2: "prop2",
                    parameter_deviceid: "A00000452BB22D",
                    prop1: "prop1",
                    methodName: "queryPrivateUserInfoByUserLabel",
                    projectName: "spesmobile",
                    serviceName: "yellowPage",
                    requestType: "post",
                    serviceCode: ""
                },
                "data":{
                    "type": "yellowPage",
                    "guid": ""
                }
            },
            //"subject": "Email Testing 20150123", "from": "ericwang@deloitte.com.cn", "to": ["6611094@qq.com"], "cc": ["wdq1103@163.com"], "content": "Content testing 20150123", "attachments": []
            sendEmail: {
                attr:{
                    projectName:"userbehavior",
                    serviceName:"sendMessage",
                    methodName:"",
                    requestType:"post"
                },
                data: {

                }
            },
            addUserBehavior: {
                attr:{
                    projectName:"userbehavior",
                    serviceName:"addUserBehavior",
                    methodName:"",
                    requestType:"post"
                },
                data: {

                }
            }
        }

    }
    
    return ServerConfig;
    
});