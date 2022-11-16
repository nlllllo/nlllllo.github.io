/* eslint-disable */
// 该文件涉及部分授权的内容（后台没实现，由前端实现），发布时务必做压缩和代码混淆
var appid = GetQueryString('appid'),openid = GetQueryString('openid').replace(/%3D/g,''),unionid = GetQueryString('unionid'),token = sessionStorage.getItem("TOKEN") || '';
//有些合作的大企业落地页为定制开发，无需传coname参数，直接定义在落地页的全局变量
var coname = typeof coname != 'undefined' && coname ? coname : GetQueryString('coname'),hdisplay = GetQueryString('hdisplay'),nonce = GetQueryString('nonce'),timeStamp = GetQueryString('timeStamp'),kd100sign = GetQueryString('kd100sign');
var PLATFORM = 'MWWW',query = '',queryArr = ['coname','hdisplay','nonce','timeStamp','kd100sign','appid','openid',"unionid"];
var ua = window.navigator.userAgent.toLowerCase();
var fromClient = GetQueryString("kdfrom") || GetQueryString("from");
var isWechat = ua.match(/MicroMessenger/i) == 'micromessenger';
var isBaiduApp = ua.indexOf("baiduboxapp") != -1
var isYzj = ua.match(/Qing\/.*;(iOS|iPhone|Android).*/i);
var isMiniProgram = fromClient == 'miniProgram';
var isBaiduMini = /swan\//.test(window.navigator.userAgent) || /^webswan-/.test(window.name);
var isAlipayMini = ua.indexOf("aliapp") > -1 && ua.indexOf('miniprogram');
var isQuickApp = fromClient == 'quickApp';
var isApp = fromClient == 'kdios' || fromClient == 'kdandroid' || fromClient == 'app' || ua.indexOf("kuaidi100") > -1;
var isBaidu = /aladdin|alading|alading|openv|baidu_ala/.test(fromClient);
var _sg = false; //是否忽略各种下载引导，供第三方接入使用
var isToutiaoMini = ua.indexOf("toutiaomicroapp") > -1
rqWxAuth();
for(var i in queryArr) {
  window[queryArr[i]] && (query += i == 0 ? queryArr[i] + '=' + window[queryArr[i]] : '&' + queryArr[i] + '=' + window[queryArr[i]]);
}
if(fromClient) {
  query +=  query ? "&from=" + fromClient : "from=" + fromClient;
}
// if(isMiniProgram) {
//   query += query ? "&from=miniProgram" : "from=miniProgram";
// }
// if(isQuickApp) {
//   query += query ? "&from=quickApp" : "from=quickApp";
// }
// if(isApp && fromClient) {
//   query += query ? "&from=" + fromClient : "from=" + fromClient;
// }
setHref();
setSkipGuide();
function getcookie(cookieName) {
  var cookieValue = "";
  if (document.cookie && document.cookie != '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].replace(/(^\s*)|(\s*$)/g, "");
      if (cookie.substring(0, cookieName.length + 1) == (cookieName + '=')) {
        cookieValue = unescape(cookie.substring(cookieName.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
function setcookie(cookieName, cookieValue) {
  var expires = new Date();
  var now = parseInt(expires.getTime());
  var et = (86400 - expires.getHours() * 3600 - expires.getMinutes() * 60 - expires.getSeconds());
  expires.setTime(now + 1000000 * (et - expires.getTimezoneOffset() * 60));
  document.cookie = escape(cookieName) + "=" + escape(cookieValue) + ";expires=" + expires.toGMTString() + "; domain=.kuaidi100.com;path=/";
}
function delcookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getcookie(name);
  document.cookie = escape(name) + "=" + escape(cval) + "; expires=" + exp.toGMTString() + "; path=/";
}
function resetcookie(name) {
  setcookie(name, '');
}
function getStorage(name) {
  var value = null;
  try{
    value = JSON.parse(localStorage.getItem(name))
  } catch(e){}
  return value;
}
function setStorage(name,value){
  try{
    localStorage.setItem(name,JSON.stringify(value))
  } catch(e){}
}
function getSession(name) {
  var value = null
  try{
    value = JSON.parse(sessionStorage.getItem(name))
  } catch(e) {}
  return value
}
function setSession(name,value) {
  try{
    sessionStorage.setItem(name,JSON.stringify(value))
  }catch(e){}
}
function addlog(type) {
  $.ajax({url:"/apicenter/courier.do?method=addlog&logtype=" + type})
}
function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURIComponent(r[2]);
  return '';
}
function appLogin(callback,fail){
  // update 2018-12-14
  // 更改授权的方式，对第三方和微信提供退出的功能，如果后续有问题，可以回滚到当前之前的授权方式
  var sessionToken = getSession("TOKEN");
  var cookieToken = getcookie("TOKEN");
  if(sessionToken || cookieToken){//官方页面或者其他存了TOKEN的合作页面
    token = sessionToken || cookieToken;
    isFunc(callback) && callback();
  } else if(coname && appid && openid || openid && isWechat && !isMiniProgram){//第三方合作app或者微信登录
    var data =  appid ? {
      openid: openid,
      appid: appid,
      nonce: nonce,
      timeStamp: timeStamp,
      kd100sign: kd100sign
    } : {openid: openid}
    $.ajax({
      url: '/apicenter/xcx.do?method=getTokenByOpenid',
      data: data,
      success: function(result){
        if(result.status == 200 && result.data){
          token = result.data;
          if(coname && appid && openid || !coname) {//第三方接入用户和快递100公众号登录，则记录会话的本地存储
            setSession("TOKEN",token)
          } else {//第三方公众号接入且没有接入用户信息的，则记录长期的TOKEN，在个人中心提供退出登录功能供用户自行退出
            setcookie('TOKEN', token);
          }
          isFunc(callback) && callback();
        } else {//登录失败
          isFunc(fail) && fail();
        }
      },
      error: function(){
        isFunc(fail) && fail();
      }
    });
  } else if(isYzj){
    $.ajax({
      url: '/apicenter/xcx.do?method=getTokenByYZJTicket',
      data: {ticket:GetQueryString('ticket')},
      success: function(result){
        if(result.status == 200 && result.token){
          token = result.token;
          setcookie("TOKEN",token);//在云之家入口处会清除该token
          isFunc(callback) && callback();
        } else {//登录失败
          isFunc(fail) && fail();
        }
      },
      error: function(){
        isFunc(fail) && fail();
      }
    });
  } else {//没有任何可登录的条件
    isFunc(fail) && fail();
  }
}
function setSkipGuide() {
  var sg = getSession("coname_sg") || GetQueryString("_sg"), conameKeys = getConameKeys();
  var doms = document.querySelectorAll("[sg-slot]");
  if(isApp || sg && conameKeys.indexOf(sg) > -1) {
    _sg = true;
    setSession("coname_sg", sg);
    doms.forEach(function(item) {
      item.parentNode.removeChild(item)
    });
  } else {
    doms.forEach(function(item) {
      item.removeAttribute("sg-slot")
    })
  }
}
function request(url,opts,upload){
  var options = opts || {};
  var data = options.data || {};
  var requestData = {
    url: url,
    type: options.method || 'POST',
    dataType: 'json',
    timeout: options.timeout || 10000,
    beforeSend: isFunc(options.before) ? options.before : function(){},
    success: function(result) {
      if(result.status == 200){
        isFunc(options.success) && options.success(result);
      } else if(result.status == 403) {
        if(options.handleLogin === false) return;
        if(coname && appid && openid || openid && isWechat) {//尝试再登录一次
          appLogin(function(){
            request(url,options,upload)
          },function(){//尝试登录失败
            typeof goLogin !== 'undefined' && isFunc(goLogin) ? goLogin() : login();
          })
        } else {//登录失败
          typeof goLogin !== 'undefined' && isFunc(goLogin) ? goLogin() : login();
        }
      } else {
        if(options.handleFail !== false){
          // 2021/8/10 兼容 options.error和options.fail
          //原：isFunc(options.fail) ? options.fail(result) : tips(result.message);
          if(isFunc(options.fail)) {
            options.fail(result)
          } else if(options.error(result)) {
            options.error(result)
          } else {
            tips(result.message)
          }
        }
      }
    },
    error: function(e,r){
      if(options.handleError === true || isFunc(options.error)){
        isFunc(options.error) ? options.error(e,r) : tips('网络错误，请检查您的网络设置');
      }
    },
    complete: function(result){
      isFunc(options.complete) && options.complete(result);
    }
  }
  !data.token && (data.token = token);
  !data.openid && openid && (data.openid = openid);
  !data.appid && appid && (data.appid = appid);
  data.platform = PLATFORM;
  !data.nonce && nonce && (data.nonce = nonce);
  !data.coname && coname && (data.coname = coname);
  !data.timeStamp && timeStamp && (data.timeStamp = timeStamp);
  !data.kd100sign && kd100sign && (data.kd100sign = kd100sign);
  requestData.data = data;
  if(upload) {
    requestData.cache = false;
    requestData.contentType = false;
    requestData.processData = false;
  }
  if(url){
    return $.ajax(requestData);
  }
}
function login(){
  var url = isWechat || coname ? "https://m.kuaidi100.com/sso/login.jsp?" + query : "https://sso.kuaidi100.com/user/"
  location.href = url
}
function rqWxAuth() {
  var rq = null,rurl = '';
  if(!isWechat || isMiniProgram || (kd100sign && coname && appid && openid)) return false; //微信和小程序都同属于微信平台，需区分处理
  if(typeof weixinredirect != "undefined" && weixinredirect === false) return false;//APP部分嵌入页面由于参数过长超过微信限制的处理
  try{
    //针对微信上，有些人会直接将带有openid的链接分享与人，打开后将直接拿到openid获取用户信心，为避免这种情况，需要特殊处理
    //这里不可以用sessionStorage来处理，因为微信浏览器sessionStorage的实现机制与标准不一致，sessionStorage无法保持，问题已反馈给微信官方，待修复后可切换为sessionStorage更为方便
    // 暂时借助document.referrer来处理
    // 2018-12-12微信已修复该问题，换回sessionStorage，如果有测试到其它机型还有问题需要重新切换为referrer
    rq = sessionStorage.getItem("wxSign");
    sessionStorage.setItem("wxSign",Date.now());
    // if(!openid || !document.referrer){//如果是直接点击链接进入的，认为是分享后的openid
    if(!openid || !rq){
      //该url为使用sessionStorage时
      rurl = location.href.replace(/^http:/,"https:").replace(/&?(openid|unionid|subscribe)=[^&]*/g,'')
      //该url为使用referrer时
      // rurl = "https://m.kuaidi100.com/wxauth.jsp?authuri="+encodeURIComponent(location.href.replace('http:',"https:").replace(/&?(openid|unionid|subscribe)=[^&]*/g,''));
      $.ajax({
        url: "/weixin/mapping.do?method=buildMapping",
        method: "POST",
        dataType: "json",
        async: false,
        data: {
          url: rurl
        },
        success:function(r) {
          if(r.status == '200') {
            location.replace('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx567c983270be6319&redirect_uri=http%3A%2F%2Fwx.kuaidi100.com%2Foauth.do&response_type=code&scope=snsapi_base&state=' + r.key + '#wechat_redirect');
          } else {
            location.replace('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx567c983270be6319&redirect_uri=http%3A%2F%2Fwx.kuaidi100.com%2Foauth.do&response_type=code&scope=snsapi_base&state=' + rurl + '#wechat_redirect');
          }
        },
        error: function(){
          location.replace('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx567c983270be6319&redirect_uri=http%3A%2F%2Fwx.kuaidi100.com%2Foauth.do&response_type=code&scope=snsapi_base&state=' + rurl + '#wechat_redirect');
        }
      })

    }
  } catch(e){}
}
function isFunc(obj){
  return typeof obj === 'function';
}
function tips(content, time){
  if(content){
    var html  = $('<div style="position:fixed;width:100%;top:0;bottom:0;text-align:center;z-index:99999;transition:all .3s;padding:0 3.625rem;box-sizing:border-box;"><div style="display:inline-block;vertical-align:middle;background: rgba(0,0,0,.8);color:#FFF;border-radius: 4px;font-size: .875rem;padding: .5rem 1rem;line-height: 1.5em;box-sizing:border-box;">' + content + '</div><span style="display:inline-block;height: 100%;vertical-align:middle;"></span></div>');
    $('body').append(html);
    var hide = function() {
      html.css('opacity',0)
      setTimeout(function(){
        html.remove();
      },500);
    }
    html.click(function() {
      hide();
    });
    setTimeout(function(){
      hide()
    },time || (1000 + (content.length - 10) / 10 * 1000))
  }
}
function dialog(option,confirm,cancel){
  // haveDialog = true;
  function hide(){
    html.hide();
    setTimeout(function(){
      html.remove()
      // haveDialog = false;
    },100)
  }
  var html = $('\
    <div class="global-dialog">\
      <div class="dialog-body"' + (option.autoWidth === true ? '' : ' style="width:70%;"') + '>\
        <div class="dialog-head">提示</div>\
        <div class="dialog-content">' + (option.content || '') + '</div>\
        <div class="dialog-foot">\
          <div class="dialog-btn" handle="confirm">' + (option.confirmText || '确定') + '</div>\
        </div>\
      </div>\
    </div>');
  if(option.type != 'confirm'){
    if(option.reverse){
      html.find('.dialog-foot').append('<div class="dialog-btn" handle="cancel">' + (option.cancelText || "取消") + '</div>');
    } else {
      html.find('.dialog-foot').prepend('<div class="dialog-btn" handle="cancel">' + (option.cancelText || "取消") + '</div>');
    }
  }
  html.appendTo($('body'));
  html.on('click', '.dialog-btn', function(event) {
    event.preventDefault();
    var isConfirm = $(this).is('[handle=confirm]');
    var isCancel = $(this).is('[handle=cancel]');
    option.autoHide !== false && hide();
    isConfirm && typeof confirm == 'function' && confirm();
    isCancel && typeof cancel == 'function' && cancel();
  })
  return {hide: hide};
}
function cominfo(com, callback) {
  var comJson = localStorage.getItem("com_" + com);
  if (comJson == null || comJson == "") {
    $.ajax({
      type: "post",
      url: "/company.do",
      data: "method=companyjs&number=" + com,
      dataType: "json",
      success: function (jsoncom) {
        localStorage.setItem("com_" + com, JSON.stringify(jsoncom));
        isFunc(callback) && callback(jsoncom);
      },
    })
  } else {
    isFunc(callback) && callback(JSON.parse(comJson))
  }
}
// ct,mt: ios下载统计渠道参数
function downApp(ct, mt){
  !ct && (ct = 'mweb')
  !mt && (mt = '8')
  if(ua.indexOf("micromessenger") != -1){//安卓和微信跳到应用宝
    location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.Kingdee.Express&ckey=CK1413979100250";
  } else if(ua.indexOf("iphone") != -1 || ua.indexOf("ipad") != -1){
    location.href = 'https://itunes.apple.com/app/apple-store/id458270120?pt=117859344&ct=' + ct + '&mt=' + mt;
  } else{
    location.href = "//m.kuaidi100.com/app/appDownload.html?source=message_mpage";
  }
}
function openApp(src, type, forceDownload) {
  var isIOS = ua.indexOf("iphone") != -1 || ua.indexOf("ipad") != -1;
  if(!src) src = {android: 'kuaidi100://', ios: 'kuaidi100://'}
  if(typeof src == 'string') src = {android: src, ios: src}//旧逻辑兼容
  src = isIOS ? src.ios : src.android;
  var timer = null
  if (ua.indexOf("micromessenger") != -1) {
    location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.Kingdee.Express&ckey=CK1413979100250&" + (isIOS ? "ios_scheme=" : "android_schema=") + encodeURIComponent(src);
  } else if(isIOS) {
    location.href = src;
    if(forceDownload !== false) {
      iosDownload();
    }
  } else {  
    var iframe = document.createElement('iframe');
    var body = document.body;
    iframe.style.cssText='display:none;width=0;height=0';
    body.append(iframe)
    iframe.src = src;
    setTimeout(function() {
      body.removeChild(iframe)
    }, 500);
    if(forceDownload !== false) {
      androidDownload();
    }
  }
  document.addEventListener('visibilitychange webkitvisibilitychange', function () {
    if (document.hidden || document.webkitHidden) {
      clearTimeout(timer);
    }
  });
  window.addEventListener('pagehide', function() {
    clearTimeout(timer);
  });
  function androidDownload() {//安卓为多任务执行
    var count = 0, loadDateTime = Date.now(), timeOutDatetime = Date.now()
    timer = setInterval(function() {
      count++; 
      if(timeOutDatetime - loadDateTime < 2500) {//定时器超时500ms内执行完毕认为唤醒失败
        downApp(type, 8);
        clearInterval(timer);
      }
      if(count < 100)  return ;
    }, 20);
  }
  function iosDownload() {
    timer = setTimeout(function() {
      if(!(document.hidden || document.webkitHidden)) {
        location.href = "https://m.kuaidi100.com/app/appDownload.html?source=message_mpage_" + type + "&ct=" + type;
      }    
    }, 2000);
  }
}
function getConameKeys() {
  return ['a18d1ccf26e169a8960150ca64d62085']
}
function setHref() {
  var links = document.querySelectorAll('a');
  var len = links.length,link = '',linkArr = [],hash = "";
  if(len) {
    for(var i = 0; i < len; i++) {
      link = links[i].getAttribute("href")
      if(link) {
        if(link.indexOf('#') === 0 || link.indexOf("tel:") === 0) continue;//锚点链接不处理
        linkArr = link.split("?");
        hash = link.split("#")[1] || '';
        linkArr[1] = linkArr[1] ? linkArr[1].replace("#" + hash,"") : "";
        link = (linkArr[0] + "?" + query).replace(/&+$/,'') + (linkArr[1] ? "&" + linkArr[1] : "") + (hash ? "#" + hash : "");
        links[i].setAttribute("href",link.replace(/\?$/,''));
      }
    }
  }
}
function to(url) {
  location.href = url + (query ? (url.indexOf('?') !== -1 ? "&" : "?") + query : "");
}
function badge(mesCallback,siginCallback) {
  var now = new Date();
  var today = now.getFullYear() + '_' + now.getMonth() + '_' + now.getDate(),
    last = localStorage.getItem(token + '_lastSignin'),
    ismess  = location.pathname.indexOf('/message') == 0,
    newflag = localStorage.getItem(token + '_newflag');
  if(newflag == 'unread' || !token) {//已经标记了未读或者未登录，就不需要再去调接口检测了
    isFunc(mesCallback) && mesCallback();
    if(ismess) localStorage.removeItem(token + '_newflag');
  } else {
    request('/mobile/messageapi.do?method=checkNewMessage',{
      data: {applicationType: 'H5',version: 1},
      handleFail:false,
      handleLogin: false,
      handleError: false,
      success: function(result){
        if(result.status == 200 && result.newestflag) {
          isFunc(mesCallback) && mesCallback();
          !ismess && localStorage.setItem(token + '_newflag','unread');
        }
      }
    });
  }
  if(today == last) return;//已经签到过了就不需要再去调接口检测了
  if(!token) {//未登录认为未签到，引导去登录
    isFunc(siginCallback) && siginCallback();
    return;
  }
  request('/apicenter/creditmall.do?method=checksignin',{
    handleFail:false,
    handleLogin: false,
    handleError: false,
    success: function(result) {
      if(result.status == 201) {//未签到
        siginCallback();
      } else if(result.status == 200) {
        localStorage.setItem(token + "_lastSignin",today);
      }
    }
  })
}
function goBack() {
  if(document.referrer) {
    history.back()
  } else {
    coname ? to("/app/") : to("/");
  }
}
function tglMenu(hide) {
  var tglItem = document.getElementById("menuList");
  if(tglItem) {
    if(!hide) {
      tglItem.style.display = "block";
      setTimeout(function(){
        tglItem.querySelector("ul").classList.add("down");
      },1);
    } else {
      tglItem.querySelector("ul").classList.remove("down");
      setTimeout(function(){
        tglItem.style.display = "none";
      },300)
    }
  }
}
function jumpQuickApp(path) {
  var isAndroid = /Android/i.test(ua),
    isHuawei = ua.indexOf("build/huawei") >= 0,
    dom = null;
  var quickAppTime = +getStorage("quickAppTime")
  if(quickAppTime && +quickAppTime + 24 * 3600 * 1000 > Date.now()) return;
  setStorage("quickAppTime",Date.now())
  if(!isBaidu && isAndroid && !isApp && !isWechat && !isYzj && !isQuickApp && !isMiniProgram && !(appid && coname)) {
    try{
      dom = document.createElement("script");
      dom.type = "text/javascript";
      dom.src = isHuawei ? "//appimg.dbankcdn.com/hwmarket/files/fastapp/router.fastapp.js" : "//statres.quickapp.cn/quickapp/js/routerinline.min.js";
      dom.onload = dom.onreadystatechange = function() {
        if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete"){
          appRouter('com.application.kuaidi100', (path ? path : '/index') + "?channel=H5",{channel: "H5"},"快递100小助手");
          dom.onload = dom.onreadystatechange = null;
        }
      }
      document.getElementsByTagName('head')[0].appendChild(dom);
    } catch(e){}
  }
}
function showDownload(type, logtype, text, src, forceDownload) {
  var date = new Date();
  try{
    if(isMiniProgram || isApp || isQuickApp || coname) return;
    var dom = null,slot = $("#main").size() ? $("#main") : $("body");
    type = type || 'nav';
    text = typeof text == 'undefined' ? "快递100 APP，查询寄件更轻松" : text;
    if(type == 'nav') {
      if(getStorage("nav_download_time") == '' + date.getFullYear() + date.getMonth() + date.getDate()) return;
      dom = $('<div class="download-nav" role="container">\
                <div class="close" role="close"></div>\
                <div class="ico"></div>\
                <div class="text">' + text + '</div>\
                <div class="bt" role="download">打开APP</div>\
              </div>');
    } else if(type == 'dialog'){
      dom = $('<div class="m-mask flex center" role="container">\
                <div class="download-dialog">\
                  <div class="ico"></div>\
                  <div class="close" role="close"></div>\
                  <div class="title">' + text + '</div>\
                  <div class="text">此功能需要访问客户端才能使用</div>\
                  <div class="bt-txt" role="close">继续使用</div>\
                  <div class="bt" role="download">使用APP打开</div>\
                </div>\
              </div>')
    } else if(type == 'modal') {
      dom = $('<div class="m-mask flex center" role="container">\
                <div class="download-modal">\
                  <div class="close" role="close"></div>\
                  <div class="text">快递100 APP</div>\
                  <div class="title">在线寄件更方便</div>\
                  <div class="bt" role="download">打开APP</div>\
                </div>\
              </div>');
    } else {
      return;
    }
    dom.on('click', '[role=close]', function(event) {
      var date = new Date();
      event.preventDefault();
      if($(this).closest('.download-nav').size()) {
        setStorage("nav_download_time", '' + date.getFullYear() + date.getMonth() + date.getDate())
      }
      dom.remove();
    }).on('click', '[role=download]', function(event) {
      event.preventDefault();
      addlog('m_download_click_' + (logtype || 'normal'));
      openApp(src || '', logtype, forceDownload);
    });
    slot.prepend(dom);
    addlog('m_download_view_' + (logtype || 'normal'));
  } catch(e){}
}
function gloadCss(cssStr) {
  var doc = document;
  var style = doc.createElement("style"),cssText = doc.createTextNode(cssStr),heads = doc.getElementsByTagName("head");
  style.setAttribute("type", "text/css");
  style.appendChild(cssText);
  if(heads.length){
    heads[0].appendChild(style);
  } else{
    doc.documentElement.appendChild(style);
  }
}
//ios下，回退不执行js，会保留原有的页面状态。同时由于微信授权后会重定向到同链接带openid的链接，点击返回后会回到没有openid页面，这时候就会引起页面不执行的情况
//因此需要在此处针对微信下的页面缓存做多一层处理
window.addEventListener("pageshow", function(e){
  if (e.persisted && isWechat && (!openid || !document.referrer)) { //针对ios页面来自缓存
    location.reload();
  }
})
//百度小程序、微信小程序引导弹窗
function showMiniProgramModal(opts) {
  //opts: {wechatCode, baiduCode, wechatBackground, baiduBackground, wechatPath, wechatParams, key:用来记录过期时间}
  var date = new Date()
  var today = ('0' + date.getDate()).slice(-2)
  var key = ""
  var html = $('\
    <div class="wxloading" style="opacity: 1">\
      <div class="wxloading-white" role="close"></div>\
      <div class="wxloading-main">\
        <img class="wxloading-main-code">\
        <div class="wxloading-main-bottom">\
          <img src="https://cdn.kuaidi100.com/images/m/dispatch/hand.png">\
          <span>长按识别二维码</span><br><span>前往</span><span style="color:#ff7f02">『快递100』小程序</span>\
        </div>\
      </div>\
    </div>\
  ')
  opts = opts || {}
  key = "minipramGuideModal" + (opts.key ? "_" + opts.key : "")
  html.find("[role=close]").click(function() {
    !opts.force && setStorage(key, today)
    html.remove()
  })
  var url
  if(!opts.force && (isMiniProgram || isQuickApp || coname || isApp || getStorage(key) === today)) return
  if(isWechat || opts.force) { // 是微信
    url = opts.wechatCode ? opts.wechatCode : 'https://wx.kuaidi100.com/wxbuss.do?method=getWXACodeUnLimit&pagePath=' + (opts.wechatPath || 'pages/index/index') + '&scene=' + (opts.wechatParams || 'source=weixinKuaidi100')
    html.find(".wxloading-main-code").attr("src", url)
    $("body").append(html)
  } else if (isBaiduApp) { // 百度
    /* html.find('.wxloading-main').css({
      backgroundImage: 'url(' + ( opts.baiduBackground || "https://cdn.kuaidi100.com/images/m/dispatch/bg_bd.png") + ')'
    })
    url = opts.baiduCode ? opts.baiduCode : "https://www.kuaidi100.com/twoCode.do?h=300&w=300&code=baiduboxapp://swan/a437DMFSxRxbWjGhwDDYlpxqIjYI2goB/pages/index/index/?channel=badiduH5&_baiduboxapp=%7B%22from%22%3A%22%22%2C%22ext%22%3A%7B%7D%7D&callback=_bdbox_js_275&upgrade=0"
    html.find(".wxloading-main-code").attr("src", url)
    $("body").append(html) */
  } else {
    html = null
  }
}
function featureModal(opts) {
  //{show: false, title, code, desc, featureText: 扫码后功能文案, expire: 关闭后过期时间，单位小时，默认不过期, key: 用于标记过期时间的标识}
  //desc: {type: row(按行输出)|span(按列输出), text: Array} | String
  var html = $('\
  <div class="m-mask" style="">\
    <div class="global-poster">\
      <div class="body">\
        <div class="code">\
          <img src="' + opts.code+ '"> \
          <div class="text"></div>\
        </div> \
        <div class="content">\
          <h2>'+ opts.title +'</h2>\
        </div>\
      </div> \
      <div class="line"></div> \
      <div class="close"></div>\
    </div>\
  </div>')
  opts = opts || {}
  var key = 'featureModal_' + opts.key;
  if(typeof opts.expire !== 'undefined' && opts.expire > 0) {//弹窗在关闭时间内
    if(+getStorage(key) + opts.expire * 3600 * 1000 > Date.now()) return
  }
  if(isWechat) {
    html.find(".text").html("<p><strong>长按识别二维码</strong>后" + (opts.featureText || "立即下单" ) + "</p>")
  } else {
    html.find(".text").html('<p>截图或保存图片</p><p><strong>微信扫一扫</strong>识别二维码后' + (opts.featureText || "立即下单" ) + '</p>')
  }
  html.find(".close").click(function() {
    html.hide(opts.expire)
    typeof opts.expire !== 'undefined' && opts.expire > 0 && setStorage(key, Date.now())
  })
  opts.desc = opts.desc || ""
  var desc = ""
  if(typeof opts.desc === 'string') {
    html.find(".content").append('<div class="text">' + opts.desc + '</div>')
  } else {
    opts.text = opts.text || []
    if(opts.desc.type === 'span') {
      desc = $('<div class="content-flex"></div>')
      opts.desc.text.map(function(item) {
        desc.append('<div class="text">'+ item +'</div>')
      })
      html.find(".content").append(desc)
    } else {
      desc = html.find(".content")
      opts.desc.text.map(function(item) {
        desc.append('<div class="item"><div class="text"><p>'+ item +'</p></div></div>')
      })
    }
  }
  opts.show ? html.show() : html.hide()
  $("body").append(html)
  return html // 用于show和hide
}

function report(eventName, data) {
  $.ajax({
    url: "/data-report/data/report",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      et: eventName,
      t: (new Date()).getTime() , //客户端时间
      p:  location.href, // 页面标识
      s: "WAP", //平台
      d: data || {}
    })
  });
}
function kdreport(eventName, targetName = '', extData = {}) {
  if(!eventName) return;
  $.ajax({
    url: "/data-report/data/report/multi",
    method: "POST",
    contentType: "application/x-www-form-urlencoded",
    data: {
      et: eventName, // 事件名称
      t: Date.now() , //客户端时间
      u: getcookie("TOKEN") || openid || '', //用户标识
      p: location.href, // 页面标识，启动时可能获取不到，默认为entry
      s: "WAP", //平台
      e: targetName, //上报元素，如“领取按钮”
      data: JSON.stringify(extData) // 上报的信息体
    },
    handleFail: false
  });
}