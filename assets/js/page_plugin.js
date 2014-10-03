/**
 * main.js
 *
 * 页面交互
 *
 * @author <huangchenglong@kingsoft.com>
 *
 */
"use strict";
function PageUI() {
    this.init.apply(this, arguments);
}

PageUI.prototype = {
    "xoyoboxHeader": null,
    "isLogin": false,
    "isJoined": false,
    "account": '',
    "apiBaseUrl": 'https://www.xoyobox.com/',
    "init": function () {

        this.xoyoboxHeader = window.xoyoboxHeader;
        this.updateStatus((this.statusChange));
        this.initUI();
    },
    "updateStatus": function (cb) {
        var obj = this;
        this.xoyoboxHeader.onLoginSuccess(function () {
            obj.isLogin = obj.xoyoboxHeader.isLogin();
            if (typeof(cb) == 'function') {
                cb.call(obj);
            }
        });
        this.xoyoboxHeader.onLogoutSuccess(function () {
            obj.isLogin = obj.xoyoboxHeader.isLogin();
            if (typeof(cb) == 'function') {
                cb.call(obj);
            }
        });

    },
    "statusChange": function () {
        var obj = this;
        obj.isLogin = obj.xoyoboxHeader.isLogin();
        if (this.isLogin == true) {
            //已登陆
            obj.account = obj.xoyoboxHeader.information.account;
            obj.info = obj.xoyoboxHeader.information
            obj.showJxsjLoginUI()
        } else {
            //未登录，显示登陆首页UI
            this.hideUI();
            this.showStartBtnUI();
        }

    },
    //显示用户登陆的验证码input
    "showLoginCaptchaInput": function (imgTag) {
        $('.login_form_ui .login_captcha .captcha').val('');
        $('.login_form_ui .login_captcha').show();
        $('.login_captcha .login_captcha_img').html(imgTag);
        $('.login_captcha .login_captcha_img img').css({"width":105,"height":"40"});

    },
    //用户登陆成功相关处理
    "onLoginSuccess": function () {
        var obj = this;
        obj.account = obj.xoyoboxHeader.information.account;
        obj.showJxsjLoginUI();

    },
    //平台登陆方法
    "login": function (account, password, captcha) {

        var obj = this;
        var args = {};
        args.account = account;
        args.password = password;
        if (typeof(captcha) != 'undefined') {
            args.captcha = captcha;
        }

        $.ajax({
            "url": obj.apiBaseUrl + "index.php?r=ExApi/Login",
            "type": "get",
            "data": args,
            "dataType": "jsonp",
            "success": function (r) {
                if (r.code == 0) {
                    obj.xoyoboxHeader.initMemberInfo(function () {
                        obj.xoyoboxHeader.initFinished();
                    });
                    alert('登陸成功！');
                    obj.onLoginSuccess();
                } else if (r.code == 3) {
                    alert(r.tips);
                    obj.showLoginCaptchaInput(r.data.captchaImgTag)
                } else {
                    alert(r.tips);
                }
                if ("function" == typeof(cb)) cb();
            }
        });
    },
    //平台注册接口
    "regist": function (account, password, repeat, subscribe, areaId, captcha) {
        var obj = this;
        var args = {};
        args.account = account;
        args.password = password;
        args.repeat = repeat;
        args.subscibe = subscribe;
        args.areaId = areaId;
        args.captcha = captcha;

        $.ajax({
            "url": obj.apiBaseUrl + "index.php?r=ExApi/Regist",
            "type": "get",
            "data": args,
            "dataType": "jsonp",
            "success": function (r) {
                if (r.code == 0) {
                    obj.xoyoboxHeader.initMemberInfo(function () {
                        obj.xoyoboxHeader.initFinished();
                    });
                    alert('註冊成功！');
                    obj.onLoginSuccess();
                } else {
                    alert(r.data[0].value);
                    obj.refreshRegistFormUI();
                }
                if ("function" == typeof(cb)) cb();
            }
        });


    },
    "refreshRegistFormUI":function(){
        var obj = this;
        var thisDiv = $('.register_form_ui');
        thisDiv.find('input[name="password"]').val('');
        thisDiv.find('input[name="repeat"]').val('');
        thisDiv.find('input[name="captcha"]').val('');
        thisDiv.find('#registCodeImg').attr('src',window.xoyoboxHeader.baseUrl+'resources/images/captcha.php?form_id=regist&time='+(new Date()).getTime());
    },
    "logout":function(){
        var obj=this
        this.xoyoboxHeader.logout(function(){
            obj.updateStatus();
        });
    },
    //参数：剑侠世界第三方账号、剑侠世界新账号、剑侠世界新密码、剑侠世界新密码重复
    "showJxsjLoginUI": function () {
        var obj = this;
        obj.hideUI();
        var thisDiv = $('.login_my');
        thisDiv.find('.account_name').empty().html(obj.account);
        thisDiv.find('.account_cur').empty().html(obj.info.data.currency);

        if(!jQuery.isEmptyObject(obj.info.data.lastLogin)){
            thisDiv.find('.game_name').empty().html(obj.info.data.lastLogin.gname);
            thisDiv.find('.game_ser').empty().html(obj.info.data.lastLogin.gsname);
        }else{
            thisDiv.find('.play_game').hide()
                .end().find(".no_gamme").show()
        }
        thisDiv.show();

    },

    //UI初始化，绑定全局事件
    "initUI": function () {
        var obj = this;
        //绑定各个UI关闭退出到主页UI
        $('.ui_box').find('.btnToStart').click(function () {
            obj.showStartBtnUI();
        });
        //绑定登陆按钮事件
        $('.login_form_ui .submit_btn').click(function () {
            var account = $('.login_form_ui .account').val();
            var password = $('.login_form_ui .password').val();
            var captcha = $('.login_form_ui .captcha').val();
            if(!account){
                alert("請輸入賬號或電郵");
                return false;
            }
            if(!password){
                alert("請輸入密碼");
                return false;
            }
            obj.login(account, password, captcha);
        });
        //绑定注册按钮事件
        $('.register_form_ui .submit_btn').click(function () {
            var account = $('.register_form_ui input[name=account]').val();
            var password = $('.register_form_ui input[name=password]').val();
            var repeat = $('.register_form_ui input[name=repeat]').val();
            var captcha = $('.register_form_ui input[name=captcha]').val();
            var subscribe = $('.register_form_ui input[name=subscribe]').attr("checked")? 1 : 0;
            var areaId = $('.register_form_ui select').val();
            var agreement = $('.register_form_ui input[name=agreement]').attr("checked")? 1 : 0;
            if(!agreement){
                alert("請仔細閱讀服務及隱私並同意後再進行註冊");
                return false;
            }
            obj.regist(account, password, repeat, subscribe, areaId, captcha);
        });
    },

    //开始按钮UI显示
    "showStartBtnUI": function () {
        var obj = this;
        this.hideUI();
        $(".user_area").show();
    },
    //用户登陆UI
    "showLoginUI": function () {
        var obj = this;
        obj.hideUI();
        alert(obj.isLogin)
        if (obj.isLogin == true) {
            obj.showJxsjLoginUI();
            return;
        }

        var thisDiv = $('.login_form_ui');
        var account = thisDiv.find('.account').val('');
        var password = thisDiv.find('.password').val('');

        thisDiv.find('.login_captcha').hide();
        thisDiv.show();

    },
    //用户注册UI
    "showRegistUI": function () {
        var obj = this;
        this.hideUI();
        var thisDiv = $('.reg_form_ui');
        var dom = $('.reg_form_ui');
        var finder = function(name){
            return $('.reg_form_ui').find('input[name="'+name+'"]');
        }

        var account = finder('account').val('');
        var password = finder('password').val('');
        var repeat = finder('repeat').val('');


        dom.find("input[name='subscibe']").removeAttr("checked");
        dom.find("input[name='agreement']").removeAttr("checked");

        var areaId = dom.find("select[name='areaId'] option:selected").removeAttr("selected");

        var captcha = finder('captcha').val('');
        $('#registCodeImg').attr('src',window.xoyoboxHeader.baseUrl+'resources/images/captcha.php?form_id=regist&amp;time='+(new Date()).getTime());
        thisDiv.show();

    },
    //隐藏所有UI
    "hideUI": function () {
        $('.inner_userpanel').hide();
    },
    query_key:function(){
        var obj=this
        if(!this.isLogin){
            this.xoyoboxHeader.showLogin();
            return false;
        }
        this.query_key_win();
        this.query_id(function(){
            obj.query_key_eventbind();
            obj.check_query();
        });

    },
    query_key_win:function(){
        $.blockUI({
            message: $('#new_gift'),
            css: { 'width': '700px','left':'50%','top':'10%','margin-left':"-350px","background":"none","border":"none" }
        });
        $('.win_close').on("click",function(){
            $.unblockUI({onUnblock:function(){
                $(".key_name").hide();
                $(".key").hide();
            }});
        });
    },
    query_key_eventbind:function(){
        var obj = this;
        $("#game_into").unbind("click").on("click",function(){
            $.unblockUI({onUnblock:function(){
                if(window.xoyoboxHeader.isLogin()){
                    window.xoyoboxHeader.showServerChoose('/api/api.php?action=getGameServerList');
                }else{
                    window.xoyoboxHeader.needLogin();
                }
            }});
        });
        $("#query_key").unbind("click").on("click",function(){

            if(window.xoyoboxHeader.isLogin()){
                obj.query_key_modle();
            }else{
                window.xoyoboxHeader.needLogin();
            }
        });
    },
    user_id:null,
    query_id:function($fn){
        var obj=this;
        if(this.user_id){
            if($fn){$fn();}
            return false;
        }
        $.ajax({
            url: "https://www.xoyobox.com/index.php?r=ExApi/GetEsessionId",
            dataType: 'jsonp',
            success: function($data){
                obj.user_id=$data.data;
                if($fn){$fn()}
            }
        });
    },
    check_query:function(){

        $.ajax({
            type: 'POST',
            url: "http://zt.xoyobox.com/20140416_yjm/index.php?r=Web/AjaxGetActivityState",
            dataType: 'json',
            data: {"esid":this.user_id},
            success: function($datas){
                // $datas={"code":-1,"data":{"id":"23","state":"1","userid":"20130910200000","account":"duzaizhe@163.com","cardid":"XSLB1714C4B8FDA5855F209F19F106A2","updatetime":"1397732604"}}
                //console.log($datas);
                if($datas.code==0 ){
                    $(".key_name").show();
                    $(".key").show().empty().append($datas.data.cardid);
                    $("#query_key").unbind("click").on("click",function(){

                        alert("你已參與過活動！")
                    });
                }
            }
        });
    },
    query_key_modle:function(){
        var obj=this;
        $.ajax({
            type: 'POST',
            url: "http://zt.xoyobox.com/20140416_yjm/index.php?r=Web/AjaxJoinActivity",
            dataType: 'json',
            data: {"esid":obj.user_id},
            success: function($datas){
                //$datas={"code":1,"data":{"id":"23","state":"1","userid":"20130910200000","account":"duzaizhe@163.com","cardid":"XSLB1714C4B8FDA5855F209F19F106A2","updatetime":"1397732604"}}
                if($datas.code>0 ||$datas.code==-2){
                    alert("領取成功！")
                    $(".key_name").show();
                    $(".key").show().empty().append($datas.data.cardid);
                    $("#query_key").unbind("click").on("click",function(){

                        alert("你已參與過活動！")
                    });
                }else{
                    alert($datas.msg);
                }

            }
        });
    }

}

$(function () {
    window.pageUI = new PageUI();
    /*$('#startGameBtn').click(function(){
        if(window.xoyoboxHeader.isLogin()){
            window.xoyoboxHeader.showServerChoose('/api/api.php?action=getGameServerList');
        }else{
            window.xoyoboxHeader.needLogin();
        }
    });*/
});



var _isShowServerChooseInit = false;
var _isShowServerChoose = false;
var _isFacebookLogin = false;
/*
function enterGameBtnClick() {
    if(null != window.xoyoboxHeader.information
        && "undefined" != typeof(window.xoyoboxHeader.information.account)
        && window.xoyoboxHeader.information.account != ''){
        //选择游戏服务器
        window.xoyoboxHeader.showServerChoose('/api/api.php?action=getGameServerList');
        return false;
    }else{
        if(window.xoyoboxHeader.isLogin()==false){
            window.xoyoboxHeader.showRegist();
            _showServerChoose();
        }
        //window.xoyoboxHeader.needLogin();
    }
    return false;

}
*/
function _showServerChoose(){
    _isShowServerChoose = true;
    if(_isShowServerChooseInit==false){
        _isShowServerChooseInit = true;
        window.xoyoboxHeader.onLoginSuccess(function(){
            setTimeout(function(){
                if(_isShowServerChoose==true && _isFacebookLogin==false){
                    window.xoyoboxHeader.showServerChoose('/api/api.php?action=getGameServerList');
                    _isShowServerChoose = false;
                }
            },100);
        });

        window.xoyoboxHeader.onThirdPartyLoginSuccess(function(){
            setTimeout(function(){
                if(_isShowServerChoose==true && _isFacebookLogin==true){
                    window.xoyoboxHeader.showServerChoose('/api/api.php?action=getGameServerList');
                    _isShowServerChoose = false;
                }
            },100);
        });
    }
}