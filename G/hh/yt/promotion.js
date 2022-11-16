/**
 * 使用方法，在页面需要投放广告的位置放入具有role-slot属性的标签，值为广告位名称，由各属性控制广告的属性
 * @single 只要有该属性，当同一个广告位有多条广告时，只会随机出现一条，默认为undefined
 * @distance 多个广告位进行轮播时，手指滑过后触发轮播的阈值，单位是px, 默认是50
 * @indicator 有轮播时是否展示轮播指示器， 0为不展示，默认1
 * @duration 轮播的时间，单位ms，默认3000
 * @close 是否可关闭，默认都是可关闭
 * 插槽：标签里的内容为初始化的内容，再请求以后如果没有广告会保留原有内容，否则替换为广告内容
 * 示例：
 * <div role-slot="m_index_topbanner" indicator="0" duration="4000" distance="20" single></div>
 */
 (function(){
  /** global allpos */
  var platform = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'm' : 'www'
  var from = GetQueryString("from") || GetQueryString("coname")
  var adList = [], adArr = [], sets = [], allList = {}
  var now = new Date(), today = [now.getFullYear(), now.getMonth(), now.getDate()].join("")

  $(function () {
    initAd();
    // events
  //   $("body").on('click', '[role-slot] a', function () {
  //     var parent = $(this).parent()
  //     statistic("click", parent.data("source"))
  //   }).on('click', '[role-slot] .close', function (event) {
  //     event.preventDefault()
  //     event.stopPropagation()
  //     var parent = $(this).parent()
  //     var refuseDate = JSON.parse(localStorage.getItem("adRefuseDate")) || {}
  //     var data = parent.data("source")
  //     refuseDate[data._id] = today
  //     localStorage.setItem('adRefuseDate', JSON.stringify(refuseDate))
  //     reset(parent)
  //     statistic("close", data)
  //   })
  })

  function initEvent(dom) {
   dom.on('click', 'a', function () {
      var parent = $(this).parent()
      statistic("click", parent.data("source"))
    }).on('click', '.close', function (event) {
      event.preventDefault()
      event.stopPropagation()
      var parent = $(this).parent()
      var refuseDate = JSON.parse(localStorage.getItem("adRefuseDate")) || {}
      var data = parent.data("source")
      if(data) {
        refuseDate[data._id] = today
        localStorage.setItem('adRefuseDate', JSON.stringify(refuseDate))
        statistic("close", data)
        reset(parent)
      }
    })
  }


  function initAd() {
    //新增了全局压屏广告，为不影响原有的广告，使用合并的方式处理
    adList.push("m_index_important")
    $("[role-slot]").each(function (index, el) {
      var id = $(el).attr("role-slot")
      $(el).attr("id", id); //用于处理百度广告位注入的兼容
      adList.push(id)
    });
    if (!adList.length || !$("[role-slot]").size()) {
      $("[role-slot]").remove();
      return false;
    } else {
      loadAds(adList.join(","));
    }
  }

  function removeAd(key) { //移除广告位
    var dom = null
    if (key) {
      dom = $("[role-slot=" + key + "]")
      if(!dom.children().size()) dom.remove()
    } else {
      $("[role-slot]").each(function(index, el) {
        !$(el).children().size() && $(el).remove()
      })
    }
  }

  function filterAds() { // 过滤还在关闭有效期或者已失效的广告，按照自然日计算
    // 已经关闭过的名单
    var refuseDate = JSON.parse(localStorage.getItem("adRefuseDate")) || {};
    console.log(refuseDate)
    var lists = [], key = ''
    for(var i = 0; i < adArr.length; i++) {
      key = adArr[i]._id
      if(refuseDate[key] !== today) {
        lists.push(adArr[i])
      }
    } 
    
    adArr = lists
  }

  function sortAds() { // 分组
    for (var i = 0, l = adArr.length; i < l; i++) {
      (allList[adArr[i].pos] || (allList[adArr[i].pos] = [])).push(adArr[i])
    }
  }

  function loadAds(pos) { // 获取广告
    var params = {
      platform: platform,
      pos: pos,
      coname: from || ""
    }
    if (getcookie('TOKEN') || sessionStorage.getItem("TOKEN")) {
      params.token = getcookie('TOKEN')
    }
    function doCallback(res) { // 广告请求结束的回调
      $("[role-slot]").css("opacity", 1)
      typeof window.showAdCallback === 'function' && setTimeout(function(){
        window.showAdCallback(res)
      }, 0)
    }
    $.ajax({
      type: 'get',
      url: '/doughnut/multi/terminal', //旧接口 `/assets/ext?method=mainprofile`   post
      data: params,
      success: function (res) {
        if (+res.status === 200 && res.data.list.length > 0) {
          for (var i = 0; i < res.data.list.length; i++) {
            sets.indexOf(res.data.list[i].pos) === -1 && sets.push(res.data.list[i].pos)
            adArr.push(res.data.list[i])
          }
          filterAds() // 过滤
          sortAds() // 按位置分组
          showAds()   // 展示
        } else {
          removeAd()
        }
        doCallback(res)
      },
      error: function () {
        doCallback()
        removeAd()
      },
      fail: function() {
        doCallback()
      }
    })
  }

  function showAds() { //显示广告 
    if (!allList) return removeAd()
    for (var k = 0; k < adList.length; k++) {
      if ($.inArray(adList[k], sets) == -1) { // 处理没有数据的广告位
        !$('[role-slot=' + adList[k] + ']').children().size() && removeAd(adList[k])
      }
    }
    for (var i = 0, len = sets.length; i < len; i++) { // 生成广告结构
      var pos = sets[i]
      if(allList[pos] && allList[pos].length) {
        setAds(pos, allList[pos])
      } else {
        removeAd(pos)
      }
    }
  }

  function setAds(pos, data) {
    var count = data ? data.length : 0
    var dom = $("[role-slot=" + pos + "]");
    if (!dom.size()) return //说明页面上不存在该广告位对应的dom容器（可能移除、可能原本就没有）
    if(count > 1 && dom.attr("single") === undefined && pos !== 'm_index_important') { // 多条广告可轮播（2021.8新增能力）
     showList(dom, data)
    } else {//随机产生一条广告来填充（旧逻辑）
      count && showOne(dom.eq(0), data[Math.floor(Math.random() * count)])
    }
  }

  // 删除后重置广告
  function reset(dom) {
    var data = dom.data("source"), pos = data.pos, id = data._id, list = [], temp = allList[pos]
    dom.remove()
    for(var i = 0; i < temp.length; i++) {
      if(temp[i]._id !== id) {
        list.push(temp[i])
      }
    }
    allList[pos] = list
    setAds(pos, list)
  }

  // 展示单条广告
  function showOne(dom, data) {
    var notShow = data.showType == '活动' && (isWechat || isBaiduApp) // 百度和微信上不展示的广告
    if (!data || notShow) {
      return dom.remove()
    }
    dom.data("source", data)
    dom.data('preDisplay',dom.css("display"))
    dom.hide() //图片类型先隐藏，防止弹窗类型影响页面交互
    dom.css("opacity", 1).empty().html(getItem(data, dom))
    if (data.type == "img" || data.type == "imgJavascript") {//图片类型加载后恢复到原有的展示水平
      dom.find("img").on("load", function() {
        dom.css("display", dom.data("preDisplay"))
      }).on("error", function() {
        dom.remove();
      })
    }
    !data.statistic && statistic('show', data)
    data.statistic = true
    initEvent(dom)
  }

  // 展示轮播广告
  function showList(dom, data) {
    var swiper = $('<ul class="kd-swiper"></ul>'), li = null, len = data.length
    for(var i = 0; i < len; i++) {
      li = $('<li class="kd-swiper__item"></li>')
      li.html(getItem(data[i], dom)).data('source', data[i])
      swiper.append(li).css("width", (100 * len) + "%")
      !data[i].statistic  && statistic('show',data[i])
      data[i].statistic = true
    }
    dom.empty().html(swiper).css("opacity", 1)
    initEvent(dom)
    if(data.length > 1) {
      initSwiper(dom)
    }
  }

  function getItem(data, dom) { // 获取单调广告的dom结构
    var str = '', close = getOptions(dom, 'close') !== '0'
    if (data.type == "img") {
      //ios下body代理事件无效，需要指定cursor属性
      if(data.url) {
        str = '<a href="' + data.url + '" style="cursor:pointer"><img src="' + data.bgimage + '"></a>'
      } else {
        str = '<img src="' + data.bgimage + '">'
      }
      if(close) {
        str += '<div class="close" style="cursor:pointer">关闭</div>'
      }
    } else if (data.type == 'imgJavascript') {
      //广电通广告针对没有指定container_id的广告代码，将会获取script标签的id
      //而jq动态运行jq时其实是没有将script插入文档的，会造成脚本报错，广告无法正常加载
      //因此发布广点通广告时必须指定container_id,值与广告位的值一致
      str = '<img src="' + data.bgimage + '">' + data.content.replace("${id}", data.pos)
    } else {
      str = data.content
    }
    return str
  }

  function getOptions(dom, key, def) {
    var val = dom.attr(key)
    return typeof val === 'undefined' ? def : val
  }


  function initSwiper(dom) {
    var swiperContainer = dom.find(".kd-swiper");
    var swipers = swiperContainer.find(".kd-swiper__item")
    var size = swipers.size();
    var total = size + 2;
    swiperContainer.append(swipers.eq(0).clone(true).show());
    swiperContainer.prepend(swipers.eq(size - 1).clone(true).show());
    swiperContainer.css({
      width: 100 * total + "%"
    });
    new Swiper();
    function Swiper() { 
      var current = 1 ,timer = null, duration = +getOptions(dom, 'duration', 4000);
      var quque = false, indicator = null, showIndicator = +getOptions(dom, 'indicator', 1)
      if(showIndicator) {
        indicator = $('<div class="kd-swiper__indicator"></div>')
        for(var i = 0; i < size; i++) {
          indicator.append("<span></span>");
        }
        dom.append(indicator)
        indicator.find("span").eq(0).addClass("active")
      }
      swiperContainer.css("marginLeft", '-100%')

      // animate()
      event()
      timer = setInterval(animate, duration);
      function animate(swiper){
        quque = true
        !swiper && current++
        swiperContainer.stop(true, true).animate({
          marginLeft: (-current * 100) + "%"
        }, function() {
          quque = false
          if(current == size + 1) {
            current = 1;
            swiperContainer.css("margin-left", '-100%')
          } else if(current === 0) {
            current = size
            swiperContainer.css("margin-left", (-100 * size) + "%")
          }
          showIndicator && indicator.find('span').eq(current - 1).addClass('active').siblings("span").removeClass("active");
        });

      }

      function event() {
        var cacheX = 0, startX = 0, moveX = 0, distance = +getOptions(dom, 'distance', 50)
        dom.on("touchstart", function(event) {
          clearInterval(timer);
          if(quque) return
          var e = event.originalEvent;
          var pointer = e.touches ? e.touches[0] : e
          startX = moveX = pointer.pageX
          cacheX = parseInt(swiperContainer.css("marginLeft"));
          time = Date.now();
        })
        swiperContainer.on("touchmove", function(event) {
          var e = event.originalEvent
          var pointer = e.touches ? e.touches[0] : e
          moveX = pointer.pageX
          if(quque) return
          event.preventDefault()
          swiperContainer.css("margin-left", cacheX + moveX - startX)
        })
        swiperContainer.on("touchend touchcancel", function() {
          if(quque) return
          var diff = moveX - startX
          if(diff > distance) {
            current--
          } else if(diff < -distance) {
            current++
          }
          animate(true)
          timer = setInterval(animate, duration);
        })
      }
    }
  }
  function statistic(type, data) {
     //统计show
     $.post('/mainapi.do?method=vieweventads', {
      source: platform,
      adlocation: data.pos,
      adurl: encodeURIComponent(data.url) || 'UNKNOWN',
      showorlink: type, // show
      _id: data._id
    })
  }

  // 有些方法在被其他页面作为全局方法引用了
  window.loadAds = loadAds
})()