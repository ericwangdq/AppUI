/**
 * Created by Eric on 12/24/2014.
 */

define(['jquery','underscore', 'backbone',
        'email/email-page/email-model',
        'email/email-page/group-list-view',
        'email/email-page/person-list-view',
        'email/email-page/recent-list-view',
        'email/email-page/user-model',
        'text!email/email-page/email-page.html',
        'utils',
        'utilities/session',
        'utilities/local',
        'config/config',
        'userSession',
        'css!email/common/css/email-page.css'
        ],

    function($, _, Backbone,
             EmailModel,
             GroupListView,
             PersonListView,
             RecentListView,
             UserModel,
             EmailPageTemplate,
             Utils,
             Session,
             Local,
             Config,
             UserSession) {

        'use strict';

        var EmailPage = Backbone.View.extend({

            model: null,

            userModel: null,

//            toUsers: [{
//                        label: "111111",
//                        name: "QQ Email",
//                        email: "6611094@qq.com"
//
//                    },
//                    {
//                        label: "111112",
//                        name: "Deloitte Email",
//                        email:"ericwang@deloitte.com.cn"
//                    }],

            toUsers: [],

            tempUsers: [],

//            copyUsers: [{
//                    label: "111113",
//                    name: "Outlook",
//                    email: "wdq1103@hotmail.com"
//                 }],

            copyUsers: [],

            recentUsers:[],

            attachments: [],

            groupGuid: null,

            previousGroupGuid: null,

            template: _.template(EmailPageTemplate),

            events: {
                'click span.remove': 'removeEmail',
                'click div.add-person': 'showContacts',
                'click #recent-person': 'showRecentContacts',
                'click #confirm-select-to': 'confirmAddTo',
                'click #confirm-select-copy': 'confirmAddCopy',
                'click #close-contact': 'hideContacts',
                'click #previous': 'previous',
                'click #send-email': 'sendEmail'
            },

            //用于创建el下的属性
            attributes: function(){
                return {
                    'data-role': 'page',
                    'class': 'layout',
                    'id': 'email-page',
                    'data-theme': 'metal'
                }
            },

            initialize: function(){
                var me = this;
                if(!me.model){
                    me.model =  new EmailModel();
                    // me.listenTo(me.model, 'change', me.login);
                }

            },

            urlParams: function(params){
                var me = this;
                //params[0];
                //console.log(JSON.stringify(params) + params.length);
            },

            render: function(){
                var me = this;
                me.el.innerHTML = me.template();

                $(document).off("vclick", "ul.img-list > li");
                $(document).on("vclick", "ul.img-list > li", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    //input blur event
                    $("#subject, #email-content").blur();
                    var attachment = $(this);
                    if(attachment.hasClass("checked")){
                        attachment.removeClass("checked");
                    }else{
                        attachment.addClass("checked");
                    }
                    $("#email-area span.count").text($("ul.img-list > li.checked").length);
                });

                $(document).off("vclick", "#group-list li > a");
                $(document).on("vclick", "#group-list li > a", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var groupId = $(this).attr("data-attr");
                    var subset = $(this).attr("data-subset");
                    if(subset=="1") {
                        me.addGroupList(groupId);
                    }
                    else{
                        $("#group-container").empty();
                    }
                    me.addPersonList(groupId);
                });

                $(document).off("vclick", "#person-list li > a");
                $(document).on("vclick", "#person-list li > a", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var PersonEl = $(event.target);
                    var personId = PersonEl.attr("data-attr");
                    var personName = PersonEl.attr("data-pinyincn");
                    if(personId != "") {
                        if (!PersonEl.parent().hasClass("selected")) {
                            me.addPerson(personId, personName);
                        }
                        //else {
                        //    PersonEl.parent().removeClass("selected");
                        //    me.removePerson(personId);
                        //}
                    }
                });

                $(document).off("vclick", "#recent-list li > a");
                $(document).on("vclick", "#recent-list li > a", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var PersonEl = $(event.target);
                    var personId = PersonEl.attr("data-attr");
                    var personName = PersonEl.attr("data-pinyincn");
                    if(personId != "") {
                        if (!PersonEl.parent().hasClass("selected")) {
                            me.recentUsers = me.getRecentPersons();
                            if(me.recentUsers != null && me.recentUsers.length > 0) {
                                $.each(me.recentUsers, function (i, user) {
                                    if (user.label == personId) {
                                        me.tempUsers.push(user);
                                    }
                                });
                            }
                            $("#recent-list li > a[data-attr='" + personId + "']").parent().addClass("selected");
                            console.log(personId + " " + personName);
                        }
                    }
                });
            },

            fillData: function(){
                var me = this;
            },

            renderCompleted: function() {
                var me = this;
                me.displayAttachments();
            },

            addGroupList: function(groupId){
                var me = this;
                $("#group-container").empty();
                me.groupListView = new GroupListView();
//                if( me.groupGuid != null) {
//                    me.previousGroupGuid = me.groupGuid;
//                }
                me.groupGuid = groupId;
                me.groupListView.fillData(groupId);
            },

            addPersonList: function(groupId){
                var me = this;
                $("#person-container").empty();
                me.personListView = new PersonListView();
                var allUsers = me.toUsers.concat(me.copyUsers);
                me.personListView.fillData(groupId, me.toUsers);
            },

            addRecentPersonList: function(){
                var me = this;
                $("#recent-container").empty();
                me.recentListView = new RecentListView();
                me.recentUsers = me.getRecentPersons();
                var allUsers = me.toUsers.concat(me.copyUsers);
                me.recentListView.fillData(allUsers, me.recentUsers);
            },

            removeEmail: function(event){
                var me = this;
                event.preventDefault();
                event.stopPropagation();
                //alert($(event.target).parent().attr("data-attr"));
                var emailEl = $(event.target).parent();
                var userId = emailEl.attr("data-id");
                emailEl.remove();
                if(userId != "") {
                    if(emailEl.attr("class") == "to") {
                        me.removeToPerson(userId);
                    }
                    else{
                        me.removeCopyPerson(userId);
                    }
                }
                me.resetContactsHeight();

            },

            showContacts: function(event){
                var me = this;
                event.preventDefault();
                event.stopPropagation();
                me.previousGroupGuid = "BSEC";
                $("#recent-container").empty();
                $("#contact-area, #previous").show();
                $("#email-area, div.add-person, #email-footer").hide();
                $("#contact-footer").show().navbar();
                setTimeout(function(){
                    me.addGroupList("BSEC");
                    me.addPersonList("BSEC");
                    me.resetContactsHeight();
                }, 0);
            },

            hideContacts: function(){
                var that = this;
                that.tempUsers = [];
                $("#contact-area").hide();
                $("#email-area, div.add-person").show();
                $("#contact-footer").hide();
                $('#email-footer').show().navbar();
                return false;
            },

            showRecentContacts: function(event){
                var me = this;
                event.preventDefault();
                event.stopPropagation();
                $("#group-container").empty();
                $("#person-container").empty();
                $("#contact-area").show();
                $("#email-area, #previous, div.add-person, #email-footer").hide();
                $("#contact-footer").show().navbar();
                setTimeout(function(){
                    me.addRecentPersonList()
                    me.resetContactsHeight();
                }, 0);
            },

            confirmAddTo: function(event){
                var me = this;
                event.preventDefault();
                event.stopPropagation();
                me.addPersons("to");
                me.hideContacts();
            },

            confirmAddCopy: function(event){
                var me = this;
                event.preventDefault();
                event.stopPropagation();
                me.addPersons("copy");
                me.hideContacts();
            },

            addPerson: function(personId, personName){
                var me = this;
                if(personId != "")
                {
                    me.userModel = new UserModel();
                    me.listenTo(me.userModel, 'change' , me.pushPerson);
                    me.listenTo(me.userModel, 'error' , me.pushPersonError);
                    me.userModel.userData(personId);

                }
                else{
                    console.log(personName + " is empty");
                }
            },

            pushPerson: function(){
                var me = this;
                if( me.userModel != null && typeof (me.userModel.get("name")) != "undefined"
                    && me.userModel.get("name") != "") {
                    var name = me.userModel.get("name");
                    var email = me.userModel.get("email");
                    var userId = me.userModel.get("label");
                    me.tempUsers.push(me.userModel.toJSON());
                    $("#person-list li > a[data-attr='" + userId + "']").parent().addClass("selected");
                    console.log(name + " " + userId + " " + email);
                    me.pushRecentPersons(me.userModel.toJSON());
                    //var isExist= false;
                    //$.each(me.toUsers, function (i, user) {
                    //    if(user.label == userId)
                    //    {
                    //        isExist = true;
                    //    }
                    //})
                    //if(!isExist)
                    //{
                    //    me.toUsers.push(me.userModel.toJSON());
                    //    console.log(name + " " + userId + " " + email);
                    //}

                }
            },

            pushPersonError: function(message){
                console.log("push person error " + message);
                Utils.alert("获取用户信息失败，" + message ,function(){}, "提示" , "确定");
            },

            pushRecentPersons: function(user) {

                var me = this;
                console.log("pushRecentPersons: " + JSON.stringify(user));

                me.recentUsers = me.getRecentPersons();
                var isExist = false;
                if(me.recentUsers != null && me.recentUsers.length > 0) {
                    $.each(me.recentUsers, function (index, person) {
                        if (person.label == user.label) {
                            isExist = true;
                        }
                    });
                }
                if (!isExist) {
                    if(me.recentUsers != null) {
                        me.recentUsers.push(user);
                    }
                    Local.set("recentPersons", JSON.stringify(me.recentUsers));
                    console.log("get pushRecentPersons: " + JSON.stringify(me.recentUsers));
                }
            },

            getRecentPersons: function(){
                var me = this;
                var recentPersons = Local.get("recentPersons");
                if(recentPersons == null){
                    Local.set("recentPersons", "[]");
                }
                return JSON.parse(recentPersons);
            },

            addPersons: function(action){
                var me = this;
                $("ul.email-list, ul.copy-list").empty();
                if(action == "to") {
                    $.merge(me.toUsers ,me.tempUsers);

                }else{
                    $.merge(me.copyUsers ,me.tempUsers);
                }
                if (me.toUsers != null && me.toUsers.length > 0) {
                    $.each(me.toUsers, function (i, user) {
                        $("ul.email-list").append("<li class=\"to\" data-id=\"" + user.label + "\" data-attr=\"" + user.email + "\">"
                            + user.name + "<span class=\"remove\"></span></li>")
                    });
                    $("div.to-email p.placeholder").remove();
                }
                if (me.copyUsers != null && me.copyUsers.length > 0) {
                    $.each(me.copyUsers, function (i, user) {
                        $("ul.copy-list").append("<li class=\"copy\" data-id=\"" + user.label + "\" data-attr=\"" + user.email + "\">"
                            + user.name + "<span class=\"remove\"></span></li>")
                    });
                    $("div.to-email p.placeholder").remove();
                }
                me.tempUsers = [];
            },

            removeToPerson: function(personId){
                var me = this;
                if($("div.to-email > ul > li").length == 0){
                    $("div.to-email p.placeholder").remove();
                    $("div.to-email").prepend("<p class=\"placeholder\">请添加发送对象</p>");
                }
                console.log("To Users: "+ JSON.stringify(me.toUsers));
                if(me.toUsers != null && me.toUsers.length > 0) {
                    $.each(me.toUsers, function (index, user) {
                        if (typeof ( user.label) != 'undefined' && user.label != null &&
                            user.label == personId) {
                            me.toUsers.splice(index, 1);
                            console.log("remove to person: " + personId);
                        }
                    });
                }
            },

            removeCopyPerson: function(personId){
                var me = this;
                if($("div.to-email > ul > li").length == 0){
                    $("div.to-email p.placeholder").remove();
                    $("div.to-email").prepend("<p class=\"placeholder\">请添加发送对象</p>");
                }
                console.log("Copy Users: "+ JSON.stringify(me.copyUsers));
                if(me.copyUsers != null && me.copyUsers.length > 0) {
                    $.each(me.copyUsers, function (index, user) {
                        if (typeof ( user.label) != 'undefined' && user.label != null &&
                            user.label == personId) {
                            me.copyUsers.splice(index, 1);
                            console.log("remove copy person: " + personId);
                        }
                    });
                }
            },

            previous: function(){
                var me = this;
//                if(me.groupGuid == me.previousGroupGuid){
//                    me.previousGroupGuid = "BSEC";
//                }
                $("#recent-container").empty();
                me.previousGroupGuid = "BSEC";
                me.addGroupList(me.previousGroupGuid);
                me.addPersonList(me.previousGroupGuid);
                return false;
            },

            displayAttachments: function(){
                var me = this;
                $("#attachment-content .empty-message").empty();
                $("ul.img-list").empty();
                var imageData = Session.get('imageData');
                if(imageData != null){
                    var imageDataJSON = JSON.parse(Session.get('imageData'))
                    if(imageDataJSON.length > 0) {
                        me.attachments = imageDataJSON;
                        $.each(imageDataJSON,function(i,img){
                            $("ul.img-list").append("<li><img src=\"" + img + "\" alt=\"Screenshot"+i+"\"></li>");
                        });
                    }
                    else{
                        $("#attachment-content .empty-message").append("<p>没有附件</p>");
                    }
                }
                else{
                    $("ul.img-list").empty();
                    $("#attachment-content .empty-message").append("<p>没有附件</p>");
                }
            },

            resetContactsHeight: function(){
                //$("#contact-area").height($(window).height()-190);
                //280
                if($("#person-list").height() < $(window).height() - 250)
                {
                    $("#contact-area").height($(window).height() - $("#person-list").height() - 120); //150
                }else
                {
                    $("#contact-area").css("height","auto");
                }
            },

            sendEmail:function(event){
                event.preventDefault();
                event.stopPropagation();
                var me = this;
                if(me.toUsers == null || me.toUsers.length == 0)
                {
                    Utils.alert("请选择联系人", function(){}, "提示" , "确定");
                    return false;
                }
                if($("#subject").val() == "")
                {
                    Utils.alert("请输入邮件标题", function(){}, "提示" , "确定");
                    return false;
                }
                if($("#email-content").val() == "")
                {
                    Utils.alert("请输入邮件内容", function(){}, "提示" , "确定");
                    return false;
                }
                if($("#email-content").val().length > 140)
                {
                    Utils.alert("邮件内容超过140字", function(){}, "提示" , "确定");
                    return false;
                }

                var currentUser = UserSession.currentUser();
                var disclaimer = Config.email.disclaimer.replace("$name$", currentUser.userName)
                    .replace("$from-email$", currentUser.userId + Config.email.domain);
                var content = disclaimer + "<br/><br/>" +
                    $("#email-content").val() +
                    "<br/><br/>" + disclaimer;

                me.model = new EmailModel();
                me.listenTo(me.model, 'success' , me.emailSuccess);
                me.listenTo(me.model, 'error' , me.emailError);

                var toEmails = [];
                if(me.toUsers != null && me.toUsers.length > 0) {
                    $.each(me.toUsers, function (index, user) {
                        toEmails.push(user.email);
                    });
                }

                var copyEmails = [];
                if(me.copyUsers != null && me.copyUsers.length > 0) {
                    $.each(me.copyUsers, function (index, user) {
                        copyEmails.push(user.email);
                    });
                }
                copyEmails.push(currentUser.userId + Config.email.domain);
//                copyEmails.push("ericwang@deloitte.com.cn");

                var selectedAttachments = [];
                $.each($("ul.img-list > li.checked"), function(){
                    var img = $(this).find("img").attr("src");
                    selectedAttachments.push(img);
                });

                me.model.set({
                    subject: $("#subject").val(),
                    //from: "jiangdanfeng@baosteel.com",
                    from: currentUser.userId + Config.email.domain,
                    to: toEmails,
                    //cc: ["wdq1103@outlook.com"],
                    cc: copyEmails,
                    content: content,
                    attachments: selectedAttachments
                });
                me.model.sendEmail();
            },

            //Send email success
            emailSuccess: function(messge){
                Utils.alert("邮件发送成功！ ",function(){
                    $("#subject").val();
                    $("#email-content").val();
                }, "提示" , "确定");
                console.log("Send email success: " + messge);
            },

            //Send email error
            emailError: function(messge){
                Utils.alert("邮件发送失败， " + messge,function(){}, "提示" , "确定");
                console.log("Send email error: " + messge);
            }

        });

        return EmailPage;

    });

