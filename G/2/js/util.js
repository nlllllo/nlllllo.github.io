function loadData(id) {
    var info = new Object();
    var strs = location.search.substr(1).split("&");
    for (var i = 0; i < strs.length; i++) {
        info[strs[i].match(/^.*(?=(=))/g)] = strs[i].match(/(?<=(=)).*/g);
    };
    return decodeURI(info[id]);
}

function verify() {
    // if (window.localStorage.stauts != 0) {
    var url = location.search;
    if (url.indexOf("?") != -1) {
        if (url.replace("?", "").length != 0) {
            str = url.substr(1).split("&");
            var strs = str.map(function(current, index, array) {
                return str[index].replace(str[index].match(/(?<=(=)).*/g), "").replace("=", "");
            });
            tempArr = ['studentName', 'studentId', 'studentSex', 'className', 'specialty', 'departmentName', 'auditName', 'outType', 'outAddress', 'color'];
            var tempTestNum;
            for (var i = 0; i < tempArr.length; i++) {
                if (strs.includes(tempArr[i])) {
                    tempTestNum = i;
                } else {
                    break;
                };
            };
            if (tempTestNum == tempArr.length - 1) {
                var strs = location.search.substr(1).split("&");
                // for (var i = 0; i < strs.length; i++) {
                //     window.localStorage.setItem(strs[i].match(/^.*(?=(=))/g), strs[i].match(/(?<=(=)).*/g))
                // };
                // alert("可在出入凭证页面点“出”或“入”更改颜色");
                // window.localStorage.stauts = 0;
                // mui.toast("已为你保存信息，下次将会自动加载！")
            } else {
                alert("参数错误，请重新生成！");
                window.location.href = "index.html";
            };
        } else {
            alert("参数错误，请重新生成！");
            window.location.href = "index.html";
        };
    } else {
        alert("参数错误，请重新生成！");
        window.location.href = "index.html";
    }
    // } else {
    //     console.log("存在本地缓存，无需加载参数！")
    //     mui.toast("已自动为你加载上次所填信息！")
    // };
}

function getMoble() {
    var prefixArray = new Array("130", "131", "132", "133", "135", "137", "138", "170", "187", "189");
    var i = parseInt(10 * Math.random());
    var prefix = prefixArray[i];
    for (var j = 0; j < 8; j++) {
        prefix = prefix + Math.floor(Math.random() * 10);
    };
    return prefix
}

function randomOutSchoolID() {
    var randomNum = '';
    for (var i = 0; i < 5; i++) {
        randomNum += Math.floor(Math.random() * 10);
    };
    return new Date().Format("yyyyMMdd" + randomNum)
}

function outAddress() {
    if (loadData("outAddress") == 0) {
        return "广东省广州市天河区"
    } else if (loadData("outAddress") == 1) {
        return "广东省肇庆市端州区"
    } else if (loadData("outAddress") == 2) {
        return "广东省清远市清城区"
    }
}

function getColorNum() {
    var ColorArr = ['greenyellow', 'green', 'cyan', 'cadetblue', 'blue', 'blueviolet', 'purple', 'black'];
    for (var i = 0; i < ColorArr.length; i++) {
        if (ColorArr[i] == loadData("color")) {
            return i
        }
    }
}

function changeColor() {
    var ColorArr = ['greenyellow', 'green', 'cyan', 'cadetblue', 'blue', 'blueviolet', 'purple', 'black'];
    if (getColorNum() == ColorArr.length - 1) {
        window.localStorage['color'] = ColorArr[0]
        $("body").css("background", loadData("color"));
    } else {
        window.localStorage['color'] = ColorArr[getColorNum() + 1]
        $("body").css("background", loadData("color"));
    }
}