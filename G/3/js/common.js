// //读取cookie
// function getCookie(name) {
//     return window.localStorage[name];
// }


// function loadData(id) {
//     return window.localStorage[id];
// }



// //写cookies 
// function setCookie(name, value) {
//     window.localStorage.setItem(name, value);
// }

// //删除cookies 
// function delCookie(name) {
//     window.localStorage.setItem(name, "");
// }
// //清除所有cookie函数
// function clearAllCookie() {
//     window.localStorage.clear();
// }

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function(fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function formatLessonType(t) {
    if (t == 2)
        return "每天重复请假";
    return "常规请假";
}

function outType() {
    if (loadData("outType") == 0) {
        return "收寄快递（1小时有效）";
    } else if (loadData("outType") == 1) {
        return "临时出校（一天仅一次）";
    } else if (loadData("outType") == 2) {
        return "出校超时（申请进校）";
    } else if (loadData("outType") == 3) {
        return "假期出行";
    } else if (loadData("outType") == 4) {
        return "实习";
    } else if (loadData("outType") == 5) {
        return "求职";
    } else if (loadData("outType") == 6) {
        return "探亲";
    } else if (loadData("outType") == 7) {
        return "就医";
    } else if (loadData("outType") == 8) {
        return "其他";
    }
}

function formatStatus() {
    if (outType() == "临时出校（一天仅一次）") {
        return "<font color=green>报备完成</font>";
    } else {
        return "<font color=green>审批通过</font>";
    }
}