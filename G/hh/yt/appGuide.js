;(function(){
  var ua = navigator.userAgent.toLowerCase();
  var coname = getQuery("coname"); // 第三方合作渠道
  var fromClient = getQuery("kdfrom") || getQuery("from"); // 内部产品
  var isWechat = ua.match(/MicroMessenger/i) == 'micromessenger'; // 微信环境下
  var isBaiduApp = ua.indexOf("baiduboxapp") !== -1;
  var isYzj = ua.match(/Qing\/.*;(iOS|iPhone|Android).*/i);
  var isWechatMini = isWechat && fromClient == 'miniProgram'; // 微信小程序无法使用ua，因为ios下，微信7.0版本下无标识信息
  var isBaiduMini = /swan\//.test(ua) || /^webswan-/.test(window.name) || fromClient == 'baiduMini';
  var isQuickApp = fromClient == 'quickApp';
  var isApp = ua.indexOf("kuaidi100") !== -1 || fromClient == 'kdios' || fromClient == 'kdandroid' || fromClient == 'app';
  var isBaiduWeb = /aladdin|alading|alading|openv|baidu_ala/.test(fromClient);
  var sys = /ipod|iphone|ipad|iwatch/i.test(ua) ? 'ios' : 'android';
  var isKdApp = isWechatMini || isYzj || isBaiduWeb || isQuickApp || isApp; //是否是内部产品
 
  // 初始化， AppGuide会暴露各种环境参数，可用于页面的逻辑判断
  var AppGuide = Object.create(null)
  setUserAgent();
  loadCss();
  AppGuide.nav = nav;
  AppGuide.dialog = dialog;
  AppGuide.modal = modal;
  AppGuide.show = show;
  AppGuide.jump = _jump;
  AppGuide.supportWxJump = !isWechat; //是否支持调起微信小程序，截止2021/03/26仅微信环境下不能调起
  if(isBaiduApp) {
    initBaiduApp();
  } else if(sys === 'android' && !isApp) {
    initQuickapp();
  }
  
  function loadCss() {
    var doc = document;
    var cssStr = ".appguide-mask{position:fixed !important;display: -webkit-box; -webkit-box-align: center;-webkit-box-pack: center;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.4);z-index:99;}.appguide_download-nav{display:-webkit-box;-webkit-box-align:center;height:3rem;background:#052336;color:#FFF;}.appguide_download-nav-close{width:2rem;height:2rem;background:url(https://cdn.kuaidi100.com/images/m/icons/download.png) 11px 10px no-repeat;background-size:50px auto;}.appguide_download-nav-text{-webkit-box-flex:1;padding:0 .8em;font-size:.75rem;}.appguide_download-nav-ico{width:2rem;height:2rem;background:url(https://cdn.kuaidi100.com/images/m/icons/download.png) -2px -26px no-repeat;background-size:48px auto;}.appguide_download-nav-bt{background:#4187e6;padding:0 1em;font-size:.75rem;border-radius:2em;line-height:2em;margin-right:1em;}.appguide_download-dialog{position:relative;width:90%;padding:1rem;padding-top:2.5rem;background:#FFF;box-sizing:border-box;text-align:center;border-radius:4px;}.appguide_download-dialog-ico{position:absolute;top:-1.5rem;left:50%;margin-left:-1.5rem;width:3rem;height:3rem;background:url(https://cdn.kuaidi100.com/images/m/icons/download.png) 0 -69px no-repeat;background-size:48px;border-radius:50%;border:3px solid rgba(0,0,0,.05);}.appguide_download-dialog-close,.appguide_download-modal-close{position:absolute;right:.1em;top:.3em;width:1.25rem;height:1.25rem;background:url(https://cdn.kuaidi100.com/images/m/icons/download.png?version=2) -34px -31px no-repeat;background-size:48px;}.appguide_download-dialog-text{padding-top:.3em;margin-bottom:30px;color:#888;font-size:.875rem;}.appguide_download-dialog-bt-txt{margin-top:1.3rem;color:#3581ea;}.appguide_download-dialog-bt-group{display:flex;}.appguide_download-dialog-bt{flex:1;background:#ff8106;margin-top:.5em;color:#FFF;line-height:2.8em;border:1px solid;border-radius:4px;}.appguide_download-dialog-bt.plain{color:#333;border:1px solid #c5c5c5;background:#FFF;}.appguide_download-dialog-bt + .appguide_download-dialog-bt{margin-left:20px;}.appguide_download-modal{position:relative;width:90%;max-width:296px;background:url(https://cdn.kuaidi100.com/images/m/appguide_download-modal.png) top center #fff no-repeat;background-size:100% auto;border-radius:5px;text-align:center;}.appguide_download-modal-text{margin-top:44.1%;padding-top:1em;color:#b2b2b2;font-size:1.25rem;}.appguide_download-modal-title{margin-bottom:1em;font-size:1.625rem;}.appguide_download-modal-bt{background:#ff8106;margin:1em 1.2em;color:#FFF;line-height:2.5em;}.appguide_download-modal-close{background-position:-28px 0;right:.5em;top:.5em;}";
    var style = doc.createElement("style"),cssText = doc.createTextNode(cssStr),heads = doc.getElementsByTagName("head");
    style.setAttribute("type", "text/css");
    style.appendChild(cssText);
    if(heads.length){
      heads[0].appendChild(style);
    } else{
      doc.documentElement.appendChild(style);
    }
  }

  function setUserAgent() {
    AppGuide.system = sys;
    if(isApp) {
      AppGuide.context = "app";
    } else if(isQuickApp) {
      AppGuide.context = 'quickapp';
    } else if(isWechatMini) {
      AppGuide.context = 'wechatmini';
    } else if(isBaiduMini) {
      AppGuide.context = 'baidumini';
    } else if(isWechat) {
      AppGuide.context = 'wechat';
    } else if (isBaiduApp) {
      AppGuide.context = 'baiduapp';
    } else if(isBaiduWeb) {
      AppGuide.context = 'baiduweb';
    } else if (isYzj) {
      AppGuide.context = 'yunzhijia';
    } else if(coname) {
      AppGuide.context = "open";
    } else {
      AppGuide.context = 'm';
    }

  }

  function loadScript(src, calllback) {
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = src
    document.head.appendChild(script)
    script.onload = function() {
      typeof calllback === 'function' && calllback()
    }
  }

  function initQuickapp() {
    return // 2021/6/4重新引导回app
    loadScript('//statres.quickapp.cn/quickapp/js/routerinline.min.js', function() {
      AppGuide.scriptLoaded = true;
      channelReady(function(v) {
        AppGuide.supportQuickapp = v;
        setStorage("supportQuickapp", v ? "1" : "0")
      })
    })
  }

  function initBaiduApp() {
    loadScript('https://b.bdstatic.com/searchbox/icms/searchbox/js/swanInvoke.js', function() {
      AppGuide.scriptLoaded = true;
    })
  }


  function getQuery(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return '';
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
      localStorage.setItem(name, JSON.stringify(value))
    } catch(e){}
  }

  function nav(opts) {
    return show('nav', opts || {});
  }

  function modal(opts) {
    return show('modal', opts || {});
  }

  function dialog(opts) {
    return show('dialog', opts || {});
  }

  function _dialog(opts) {
    var dom = $('<div class="appguide-mask flex center" role="container">\
                  <div class="appguide_download-dialog">\
                    <div class="appguide_download-dialog-ico"></div>\
                    <div class="appguide_download-dialog-close" role="close"></div>\
                    <div class="appguide_download-dialog-title">' + opts.title + '</div>\
                    <div class="appguide_download-dialog-text">' + opts.subtitle + '</div>\
                  </div>\
                </div>');
    var plainDom = null;
    if(opts.plainBtn && opts.plainBtn.text) { // 双按钮的情况，此按钮为取消操作使用
      plainDom = $('<div class="appguide_download-dialog-bt-txt" role="plain">' + opts.plainBtn.text + '</div>')
      dom.find('.appguide_download-dialog').append(plainDom);
      plainDom.on("click", function() {
        addlog("skip", opts);
        if(typeof opts.plainBtn.handle === 'function') {
          opts.plainBtn.handle({
            hide: function() {
              dom.remove()
            },
            target: dom
          }) && dom.find('[role=close]').click()// 回调函数return false将不会关闭弹窗
        } else {
          dom.find('[role=close]').click()
         } 
      })
    }
    dom.find('.appguide_download-dialog').append('<div class="appguide_download-dialog-bt-group"><div class="appguide_download-dialog-bt" role="download">' + opts.downloadText + '</div></div>');
    if(isBaiduApp && !isBaiduMini) {
      dom.find(".appguide_download-dialog-bt-group").prepend('<div class="appguide_download-dialog-bt plain" role="baiduapp">小程序打开</div>');
      dom.find("[role=baiduapp]").on("click", function() {
        baiduapp(opts, dom)
      });
    } else if(!AppGuide.supportWxJump && AppGuide.supportQuickapp && opts.showQuickApp !== false) {
      dom.find(".appguide_download-dialog-bt-group").prepend('<div class="appguide_download-dialog-bt plain" role="quickapp">快应用打开</div>');
      dom.find("[role=quickapp]").on("click", function() {
        quickapp(opts, dom)
      });
    }
    return dom;
  }

  function _nav(opts) {
    var dom = $('<div class="appguide_download-nav" role="container">\
      <div class="appguide_download-nav-close" role="close"></div>\
      <div class="appguide_download-nav-ico"></div>\
      <div class="appguide_download-nav-text">' + opts.title + '</div>\
      <div class="appguide_download-nav-bt" role="download">'+ opts.downloadText +'</div>\
    </div>');
    return dom;
  }

  function _jump(opts) {
    if(isBaiduApp && !isBaiduMini) {
      baiduapp(opts);
    } else if(AppGuide.supportWxJump && opts.wechatLink && opts.wxDisable !== true) {
      addlog("jump", opts, "wechatmini");
      location.href = opts.wechatLink;
    } else if(isApp) {
      addlog("jump", opts, "app");
      location.href = sys == 'ios' ? opts.iosLink : opts.andriodLink;
    }
  }

  function _modal(opts) {
    var dom = $('<div class="appguide-mask" role="container">\
              <div class="appguide_download-modal">\
                <div class="appguide_download-modal-close" role="close"></div>\
                <div class="appguide_download-modal-text">快递100 '+(AppGuide.supportWxJump? '小程序' : 'APP')+ '</div>\
                <div class="appguide_download-modal-title">' + opts.title + '</div>\
                <div class="appguide_download-modal-bt" role="download">' + opts.downloadText + '</div>\
              </div>\
            </div>');
    return dom;
  }

  function addlog(event, opts, client) {
    console.log(opts)
    $.ajax({
      url: "/data-report/data/report",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        et: "h5_to_app_miniprogram",
        t: (new Date()).getTime() , //客户端时间
        p:  location.href, // 页面标识
        s: "WAP", //平台
        d: {
          type: event, // 事件类型
          sys: AppGuide.sys, // 系统,
          client: client || (opts.type === 'dialog' && AppGuide.supportWxJump && opts.wxDisable !== true ? 'webchatmini' : 'app'), // 引导类型
          id: opts.logtype, // 弹窗唯一id
          token: typeof window.token ? window.token || "" : ""
        }
      })
    });
  }

  function isValid(id, type, hours) {
    var key = 'appguide_' + type + "_" + id
    var lasttime = +getStorage(key) || 0
    var now = Date.now()
    if(!id || !lasttime || !hours || now > lasttime + hours * 3600 * 1000) return true;
    return false;
  }

  function setOptions(opts, type) {
    opts = opts ||{}
    opts.wechat = opts.wechat || {}
    var wechat = opts.wechat
    if(AppGuide.supportWxJump && type === 'dialog' && opts.wxDisable !== true) {
      opts.downloadText = wechat.openText ||  "打开小程序"; // 打开小程序按钮文字
      opts.title = wechat.title || "快递100小程序，享受更好的服务体验"; //打开小程序标题
      opts.subtitle = wechat.hideSubtitle ? '' : (wechat.subtitle || "此功能需要访问快递100小程序才能使用"); // 打开小程序弹窗副标题
      wechat.link = wechat.link || "weixin://dl/business/?t=2iqSjsk4xjl"; // 小程序path
    } else {
      opts.title = opts.title || "快递100 APP，享受更好服务体验";
      opts.downloadText = opts.downloadText || "打开APP";
      opts.subtitle = opts.subtitle || '此功能需要访问客户端才能使用';
      opts.ct = opts.ct || opts.logtype || "mweb"; // ios下载的ct值
      opts.pt = opts.pt || "117859344"; //ios下载的pt值
      opts.ckey = opts.ckey || "CK1413979100250"; // android下载的ckey值
      opts.iosLink = opts.iosLink || ""; // ios 打开的deeplink
      opts.andriodLink = opts.andriodLink || ""; // android打开的deeplink
      opts.quickapp = opts.quickapp || {}; // 快应用对象
    }
    opts.logtype = opts.logtype || "normal"
    opts.type = type
   
    return opts;
  }

  /**
   * 下载核心方法
   * @param {String} type 展示类型，有nav,modal和dialog三种
   * @param {Object} opts 参数配置
   * -id: 唯一标识，会作为外层容器的id和过期的标识
   * -title: 展示的主文字
   * -subtitle: 展示的副文字，dialog类型有效
   * -downloadText: 跳转app的按钮文字
   * -expired: 过期时间，单位为小时，指定后结合id，指定时间内只会展示一次
   * -plainBtn: {text: 文字， handle: 点击回调}，dialog类型有效
   * -logtype：统计的名称
   */
  function show(type, opts) {
    // type, logtype, text, src, forceDownload
    opts = setOptions(opts, type)
    try { // 预防报错影响正常业务
      if(isKdApp || coname || !opts || !isValid(opts.id, type, opts.expired)) return;
      var dom = null, slot = $("#main").size() ? $("#main") : $("body");
      type = type || 'nav';
      if(type === 'nav') {// 顶部引导
        dom = _nav(opts);
      } else if(type === 'dialog'){ //弹窗引导
        dom = _dialog(opts); 
      } else if(type === 'modal') { // 压屏引导
        dom = _modal(opts);
      } else if(type === 'jump') {
        _jump(opts);
      } else {
        return;
      }
      if(type !== 'jump') {
        _initEvent(dom, opts, type);
        slot.prepend(dom);
      }
      addlog('show', opts); // 弹窗展示上报
    } catch(e){
      console.warn('app下载引导失败：', e)
    }
    return dom;
  }

  function _initEvent(dom, opts, type) {
    dom.on('click', '[role=close]', function(event) {
      event.preventDefault();
      if(opts.expired && opts.id) {
        setStorage('appguide_' + type + "_" + id, Date.now())
      }
      addlog("close", opts);
      dom.remove();
    }).on('click', '[role=download]', function(event) {
      event.preventDefault();
      if(AppGuide.supportWxJump && type === 'dialog' && opts.wxDisable !== true) {
        location.href = opts.wechat.link;
      } else {
        openApp(opts, dom);
      }
      addlog("open", opts);
      dom.remove()
    });
  }

  function download(opts) {
		//安卓区分短信和其他渠道
		var androidUrl = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.Kingdee.Express&ckey=' + opts.ckey;
		var iosUrl = 'https://itunes.apple.com/app/apple-store/id458270120?pt=' + opts.pt + '&ct=' + (opts.ct || opts.logtype) + '&mt=8';
		addlog("download", opts);
		location.href = sys === 'ios' ? iosUrl : androidUrl;
	}

	function openApp(opts, dom) {
    var timer = null;
    var ios  = sys === 'ios';
		var src = "kuaidi100://" + (ios ? opts.iosLink : opts.andriodLink);
		if(ios) {
			location.href = src;
			iosDownload();
		} else {  
			var iframe = document.createElement('iframe');
			var body = document.body;
			iframe.style.cssText='display:none;width=0;height=0';
			body.append(iframe)
			iframe.src = src;
			setTimeout(function() {
				body.removeChild(iframe)
			}, 500);
			androidDownload();
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
      var loadDateTime = Date.now(), timeOutDatetime = Date.now();
			timer = setInterval(function() {
				timeOutDatetime = Date.now()
				if(timeOutDatetime - loadDateTime > 2500) {//定时器超时2500ms内执行完毕认为唤醒失败
					download(opts);
          clearInterval(timer);
				}
			}, 20);
		}
		function iosDownload() {
			timer = setTimeout(function() {
				if(!(document.hidden || document.webkitHidden)) {
          download(opts)
				}    
			}, 2500);
		}
  }
  
  function quickapp(opts, dom) {
    opts.quickapp = opts.quickapp || {}
    addlog("jump", opts, 'quickapp');
    appRouter('com.application.kuaidi100', opts.quickapp.path, opts.quickapp.query || {});
    dom.remove()
  }

  function baiduapp(opts, dom) {
    opts.baiduapp = opts.baiduapp || {}
    opts.miniprogram = opts.miniprogram || {}
    addlog("jump", opts, "baidumini");
    try{
      window.swanInvoke({
        appKey: 'a437DMFSxRxbWjGhwDDYlpxqIjYI2goB',
        path: opts.baiduapp.path || opts.miniprogram.path || "pages/index/index",
        query: opts.baiduapp.query || opts.miniprogram.query || {}
      })
      dom.remove()
    } catch(e) {
      tips("小程序唤起失败，请稍后再试")
    }
   
  }

  
  if (typeof module !== 'undefined' && typeof exports === 'object') {
    module.exports = AppGuide;
  } else if (typeof define === 'function' && define.amd) {
    define(function() {
      return AppGuide; 
    });
  } else {
    window.AppGuide = AppGuide;
  }
})();