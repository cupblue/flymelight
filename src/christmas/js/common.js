//jsonp自定义
var $jsonp = (function(){
	var that = {};
	that.send = function(src, options) {
		var callback_name = options.callbackName || 'callback',
			onSuccess = options.onSuccess || function(){},
			onTimeout = options.onTimeout || function(){},
			timeout = options.timeout || 10; // sec

		var timeout_trigger = window.setTimeout(function(){
			window[callback_name] = function(){};
			onTimeout();
		}, timeout * 1000);

		window[callback_name] = function(data){
			window.clearTimeout(timeout_trigger);
			onSuccess(data);
			script.parentNode.removeChild(script);
			window[callback_name] = null;		
		}
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.async = true;
		script.src = src + '&callback=' + callback_name;
		document.getElementsByTagName('head')[0].appendChild(script);
	
	}
	return that;
})();

var $$ = {
	//jsonp自定义2
    getJSON: function(url, params, callbackFuncName, callback){
    	url += '&' + callbackFuncName + '=jsonp' + Math.floor(Math.random()*1000000);
        var paramsUrl = "",
            jsonp = this.getQueryString(url)[callbackFuncName];
        for(var key in params){
            paramsUrl += "&" + key + "=" + encodeURIComponent(params[key]);
        }
        url += paramsUrl;
        window[jsonp] = function(data) {
            window[jsonp] = undefined;
            try {
                delete window[jsonp];
            } catch(e) {}
            if (head) {
                head.removeChild(script);
            }
            callback(data);
        };
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.charset = "UTF-8";
        script.src = url;
        script.async = true;
        head.appendChild(script);
        return true;
    },
    getQueryString: function(url) {
        var result = {}, queryString = (url && url.indexOf("?")!=-1 && url.split("?")[1]) || location.search.substring(1),
            re = /([^&=]+)=([^&]*)/g, m;
        while (m = re.exec(queryString)) {
            result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        }
        return result;
    }
};

//判断某个值是否在数组中
Array.prototype.in_array = function (e) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == e)
            return true;
    }
    return false;
}

//判断某个值在数组中的位置
Array.prototype.indexOf = function (e) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == e)
            return i;
    }
    return -1;
}

/**
 * 对String对象扩展
 */
String.prototype.format = function(){
	if( arguments.length == 0 ){
		return null;
	}
	var str = arguments[0];
    for(var i=1;i<arguments.length;i++) {
        var re = new RegExp('\\{' + (i-1) + '\\}','gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
}
/*
返回字符串的实际长度, 一个汉字算2个长度 
\xn 匹配 n，其中 n 为十六进制转义值。十六进制转义值必须为确定的两个数字长。例如， '\x41' 匹配 "A"。'\x041' 则等价于 '\x04' & "1"。正则表达式中可以使用 ASCII 编码。 
[^\x00-\xff]即ASCII 编码不在0-255的字符
 */
String.prototype.strlen = function () {
    return this.replace(/[^\x00-\xff]/g, "**").length;
}

//字符串超出省略，以...结尾
String.prototype.cutstr = function (len) {
    var restr = this;
    var wlength = this.replace(/[^\x00-\xff]/g, "**").length;
    if (wlength > len) {
        for (var k = len / 2; k < this.length; k++) {
            if (this.substr(0, k).replace(/[^\x00-\xff]/g, "**").length >= len) {
                restr = this.substr(0, k) + "...";
                break;
            }
        }
    }
    return restr;
}

//替换全部
String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2)
}
//字符串去首尾空格
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
String.prototype.trimAll = function () {
    return this.replace(/\s+/g, "");
}
String.prototype.lTrim = function () {
    return this.replace(/(^\s*)/g, "");
}
String.prototype.rTrim = function () {
    return this.replace(/(\s*$)/g, "");
}
//判断是否以某个字符串开头
String.prototype.startWith = function (s) {
    return this.indexOf(s) == 0
}
//判断是否以某个字符串结束
String.prototype.endWith = function (s) {
    var d = this.length - s.length;
    return (d >= 0 && this.lastIndexOf(s) == d)
}

/**
 * 创建一个String对象的实例
 */
var FlymeStr = new String();

var Flyme = window.Flyme || {
	timer: undefined,
	execTime: 0,
	timerCallback: undefined,

	//跨浏览器绑定事件
	addEvent: function(obj, evt, fn) {
	    if (!obj) { return; }
	    if (obj.addEventListener) {
	        obj.addEventListener(evt, fn, false);
	    } else if (obj.attachEvent) {
	        obj.attachEvent('on' + evt, fn);
	    } else {
	        obj["on" + evt] = fn;
	    }
	},

	//跨浏览器取消事件绑定
	delEvt: function(obj, evt, fn) {
	    if (!obj) { return; }
	    if (obj.removeEventListener) {
	        obj.removeEventListener(evt, fn, false);
	    } else if (obj.detachEvent) {
	        obj.detachEvent("on" + evt, fn);
	    }
	},

	//完美判断是否为网址
	isURL: function(strUrl) {
	    var regular = /^\b(((https?|http):\/\/)?[-a-z0-9]+(\.[-a-z0-9]+)*\.(?:com|edu|gov|int|mil|net|org|biz|info|name|museum|asia|coop|aero|[a-z][a-z]|((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))\b(\/[-a-z0-9_:\@&?=+,.!\/~%\$]*)?)$/i
	    if (regular.test(strUrl)) {
	        return true;
	    } else {
	        return false;
	    }
	},

	// 判断输入是否是有效的电子邮件 
	isEmail: function(str) {
	    var result = str.match(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/);
	    if (result == null) {
	    	return false;
	    }
	    return true;
	},

	// 判断输入是否是一个由 0-9 / A-Z / a-z 组成的字符串 
	isAlphaNumber: function(str) {
	    var result = str.match(/^[a-zA-Z0-9]+$/);
	    if (result == null) {
	    	return false;
	    }
	    return true;
	},

	//移动电话
	checkMobile: function(str) {
	    if (!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(str))) {
	        return false;
	    }
	    return true;
	},

	//判断是否移动设备访问
	isMobileUserAgent: function() {
	    return (/iphone|ipod|android.*mobile|windows.*phone|blackberry.*mobile/i.test(window.navigator.userAgent.toLowerCase()));
	},

	//获取url参数
	getUrlArgs: function (url) {
	    if (!url) {
	        url = location.search.substring(1);
	    } else {
	        url = url.substr(url.indexOf('?') + 1);
	    }
	    var args = new Object();   // 声明并初始化一个 "类"
	    // 获得地址(URL)"?"后面的字符串.
	    var query = decodeURI(url);
	    var pairs = query.split("&");  // 分割URL(别忘了'&'是用来连接下一个参数)
	    for (var i = 0; i < pairs.length; i++) {
	        var pos = pairs[i].indexOf('=');
	        if (pos == -1) continue; // 它在找有等号的 数组[i]
	        var argname = pairs[i].substring(0, pos); // 参数名字
	        var value = pairs[i].substring(pos + 1);  // 参数值
	        // 以键值对的形式存放到"args"对象中
	        args[argname] = decodeURI(value);
	    }
	    return args;
	},

	//判断对象是否为空
	isEmptyObj: function(obj){
		if(obj === undefined){
			return true;
		}
		for(v in obj){
			if(obj.hasOwnProperty(v)){
				return false;
			}
		}
		return true;
	},
	
	//判断字符串是否为空
	isNull: function(val){
		if(val === undefined || this.trim(val) === ''){
			return true;
		}
		return false;
	},
	
	//去除所有空格
	trim: function(val){
		if(val === undefined){
			return val;
		}
		return val.replace(/[ ]/g,'');
	},
	
	showMsg: function(msg){
		alert(msg);
	},
	
	logJson: function(json){
		if(this.isDebug()){
			console.log(JSON.stringify(json));
		}
	},
	
	/** 是否是debug模式*/
	isDebug: function(){
		var hf = location.href;
		
		if(hf.indexOf("feiliu.com") != -1){
			return false;
		}
		return true;
	},
	
	//日期格式化
	formatDate: function(timestamp){
		var date = new Date(timestamp);
		
		var year = date.getFullYear();
		var month = (date.getMonth()+1) < 10 ? "0"+(date.getMonth()+1) : (date.getMonth()+1);
		var day = date.getDate();
		
		return year+"-"+month+"-"+day;
	},
	
	//验证手机号码
	validatePhone: function(val,nullTips){
		val = this.trim(val);
		var phonegi = /^(13|14|15|17|18)[0-9]{9}$/; 
		if(nullTips && this.isNull(val)){
			this.showMsg('请输入手机号码');
			return false;
		}
		if(!this.isNull(val) && !phonegi.test(val)){
			this.showMsg('请输入正确的手机号码');
			return false;
		}
		return true;
	},
	
	/**
	 * 执行倒计时操作(所有单位 秒)
	 * execTime 持续时间
	 * delay 间隔时间
	 * timerCallback 回调事件
	 */
	newScheduledTask: function(execTime,delay,timerCallback){
		this.execTime = execTime;
		this.timerCallback = timerCallback;
		this.timer = window.setInterval('Flyme.timeDownSelector()',delay*1000);
	},
	
	timeDownSelector: function(){
		if(this.execTime > 1){
			this.execTime--;
			this.timerCallback && this.timerCallback(this.execTime);
			return;
		}
		window.clearInterval(this.timer);
		this.timer = undefined;
	},
	
	//验证动态码
	validateDynamicCode: function(val){
		if(this.isNull(val)){
			this.showErrorMsg('请输入手机动态码');
			return false;
		}
		if(!(/[0-9]{6}/).test(val)){
			this.showErrorMsg('手机动态码必须为6位数字');
			return false;
		}
		return true;
	},
	

	//验证姓名
	validateUserName : function(name) {
		if (Flyme.isNull(name)) {
			Flyme.showMsg("名称不能为空");
			return false;
		}
		var numreg = /[\d\(\)]/g;
		var rs = name.replace(numreg, "");
		var ch = /^([\u4e00-\u9fa5\s])*$/;
		var chflag = ch.test(rs);
		var reg = /^([\u4e00-\u9fa5\s]{1}|[A-Z]{1})+([\u4e00-\u9fa5\s]{0,37}|[? ]{0,37}|[· ]{0,37}|[. ]{0,37}|[． ]{0,37}|[A-Z]{0,37})*$/;
		var len = 0;
		if (chflag || rs.indexOf('?') != -1 || rs.indexOf('·') != -1) {
			var chreg = /\s+/g;
			rs = rs.replace(chreg, "");
			var defreg = /[\?\·]+/g;
			rs = rs.replace(defreg, "·")
		} else {
			var enreg = /\s+/g;
			rs = rs.replace(enreg, " ");
			rs = rs.replace(". ", ".");
			rs = rs.replace(" .", ".");
			var defreg = /\.+/g;
			rs = rs.replace(defreg, ".")
			rs = rs.replace(/\．+/g, "．")
			rs = rs.replace("． ", "．").replace(" ．", "．")
		}
		if (name == '不详' || name == '不祥' || name == '未知'
				|| name == '不知道') {
			Flyme.showMsg("非法的名称");
			return false;
		}
		if (!reg.test(name)) {
			Flyme.showMsg("名字长度在2到10个中文");
			return false;
		}
		for ( var i = 0; i < rs.length; i++) {
			if (rs[i].match(/[^\x00-\xff]/ig)) //全角 
				len += 2;
			else
				len += 1;
		}
		if (len > 20 || len < 4) {
			Flyme.showMsg("名字长度在2到10个中文");
			return false;
		}
		return true;
	},
	
	// 微信分享
	wxShareInit: function(appid,wxchntype,pid,actid,openid){
		alert("33");
		if(window.wx){
			alert('0');
			if(Flyme.isNull(wxchntype)){
				Flyme.logJson("wxchntype is NULL");
				return null;
			}
			//微信公众号会员活动
			if(wxchntype.trim() === 'C1'){
				if(Flyme.isNull(openid)){
					Flyme.logJson("openid is NULL");
					return;
				}			
			}
			if(Flyme.isNull(pid) || Flyme.isNull(actid)){
				Flyme.logJson("pid or actid is NULL");
				return;
			}
			Flyme.loadSignAPI(appid, wxchntype, pid, actid, openid, Flyme.signAPICallback);
		}else{
			if(Flyme.isDebug()){
				alert("请引入依赖的微信js代码库");
			}
		}
	},
	
	/** 加载签名信息*/
	loadSignAPI: function(appid,wxchntype,pid,actid,openid,callback){		
		$$.getJSON(FlymeStr.format(Flyme.signAPIUrl(), wxchntype, pid, actid, openid), {}, "callback", function(data){
		    console.log(data);
		    if(data == null){
				data = {};
			}
			data.appid = appid;
			callback && callback(data);
		});

		/*
		
		// 带超时回调 jsonp 
		$jsonp.send(FlymeStr.format(Flyme.signAPIUrl(), wxchntype, pid, actid, openid), {
		    callbackName: 'callback',
		    onSuccess: function(json){
		        console.log('success!', json);
		    },
		    onTimeout: function(){
		        console.log('timeout!');
		    },
		    timeout: 5
		});

		*/
	
		/*
		
		//jQuery jsonp
		var ajaxBody = {
			url: FlymeStr.format(Flyme.signAPIUrl(),wxchntype,pid,actid,openid),
			dataType: "jsonp",
			jsonp: "callback",
			success: function(json){
				if(json == null){
					json = {};
				}
				json.appid = appid;
				callback && callback(json);
			}
		}
		$.ajax(ajaxBody);
		*/
	},
	
	/** 加签回调*/
	signAPICallback: function(json){
		Flyme.logJson(json);
		Flyme.wxObjConfigInit(json);
	},
	
	/** 配置信息*/
	wxObjConfigInit: function(json){
		wx.config({
		    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		    appId: json.appid, // 必填，公众号的唯一标识
		    timestamp: json.timestamp,// 必填，生成签名的时间戳
		    nonceStr: json.nonceStr, // 必填，生成签名的随机串
		    signature: json.signature,// 必填，签名，见附录1
		    jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo",
		                "startRecord", "stopRecord", "onVoiceRecordEnd", "playVoice", "pauseVoice",
		                "stopVoice", "onVoicePlayEnd", "uploadVoice", "downloadVoice", "chooseImage", 
		                "previewImage", "uploadImage", "downloadImage", "translateVoice", "getNetworkType",
		                "openLocation", "getLocation", "hideOptionMenu", "showOptionMenu", "hideMenuItems",
		                "showMenuItems", "hideAllNonBaseMenuItem", "showAllNonBaseMenuItem", "closeWindow",
		                "scanQRCode", "chooseWXPay", "openProductSpecificView", "addCard", "chooseCard", "openCard"
		                ]// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		});
	},
	
	/** 获取加签地址*/
	signAPIUrl: function(){
		return "http://admin-weixin.feiliu.com/demo/getSignature?wxchntype={0}&pid={1}&actid={2}&openid={3}";
	},


	//删除数组中存在重复的元素
	getArrElemUnique: function(someArray) {
	    var tempArray = someArray.slice(0); //复制数组到临时数组
	    for (var i = 0; i < tempArray.length; i++) {
	        for (var j = i + 1; j < tempArray.length;) {
	            if (tempArray[j] == tempArray[i])
	                //后面的元素若和待比较的相同，则删除并计数；
	                //删除后，后面的元素会自动提前，所以指针j不移动
	            {
	                tempArray.splice(j, 1);
	            }
	            else {
	                j++;
	            }
	            //不同，则指针移动
	        }
	    }
	    return tempArray;
	},

	//判断数组中是否存在重复的元素
	confirmArrElemRepeat: function(someArray) {
	    var tempArray = someArray.slice(0); //复制数组到临时数组
	    for (var i = 0; i < tempArray.length; i++) {
	        for (var j = i + 1; j < tempArray.length;) {
	            if (tempArray[j] == tempArray[i])
	                //后面的元素若和待比较的相同，则删除并计数；
	                //删除后，后面的元素会自动提前，所以指针j不移动
	            {
	                return true;
	            }
	            else {
	                j++;
	            }
	            //不同，则指针移动
	        }
	    }
	    return false;
	},

	//转义html标签
	htmlEncode: function(text) {
	    return text.replace(/&/g, '&').replace(/\"/g, '"').replace(/</g, '<').replace(/>/g, '>');
	},
	 
	//格式化日期 DateFormat('yyyy_MM_dd hh:mm:ss:SS 星期w 第q季度')
	dateFormat: function(format, date) {
	    if (!date) {
	        date = new Date();
	    }
	    var Week = ['日', '一', '二', '三', '四', '五', '六'];
	    var o = {
	        "y+": date.getYear(), //year
	        "M+": date.getMonth() + 1, //month 
	        "d+": date.getDate(), //day 
	        "h+": date.getHours(), //hour 
	        "H+": date.getHours(), //hour
	        "m+": date.getMinutes(), //minute 
	        "s+": date.getSeconds(), //second 
	        "q+": Math.floor((date.getMonth() + 3) / 3), //quarter 
	        "S": date.getMilliseconds(), //millisecond 
	        "w": Week[date.getDay()]
	    }
	    if (/(y+)/.test(format)) {
	        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	    }
	    for (var k in o) {
	        if (new RegExp("(" + k + ")").test(format)) {
	            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
	        }
	    }
	    return format;
	},
	 
	//设置cookie值
	setCookie: function(name, value, Hours) {
	    var d = new Date();
	    var offset = 8;
	    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
	    var nd = utc + (3600000 * offset);
	    var exp = new Date(nd);
	    exp.setTime(exp.getTime() + Hours * 60 * 60 * 1000);
	    document.cookie = name + "=" + escape(value) + ";path=/;expires=" + exp.toGMTString() + ";domain=feiliu.com;"
	},

	//获取cookie值
	getCookie: function(name) {
	    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
	    if (arr != null) return unescape(arr[2]);
	    return null
	},
	 
	//加入收藏夹
	addFavorite: function(sURL, sTitle) {
	    try {
	        window.external.addFavorite(sURL, sTitle)
	    } catch (e) {
	        try {
	            window.sidebar.addPanel(sTitle, sURL, "")
	        } catch (e) {
	            alert("加入收藏失败，请使用Ctrl+D进行添加")
	        }
	    }
	},

	//设为首页
	setHomepage: function(homeurl) {
	    if (document.all) {
	        document.body.style.behavior = 'url(#default#homepage)';
	        document.body.setHomePage(homeurl)
	    } else if (window.sidebar) {
	        if (window.netscape) {
	            try {
	                netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect")
	            } catch (e) {
	                alert("该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入about:config,然后将项 signed.applets.codebase_principal_support 值该为true");
	            }
	        }
	        var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
	        prefs.setCharPref('browser.startup.homepage', homeurl)
	    }
	},

	//获取页面高度
	getPageHeight: function() {
	    var g = document, a = g.body, f = g.documentElement, d = g.compatMode == "BackCompat" ? a : g.documentElement;
	    return Math.max(f.scrollHeight, a.scrollHeight, d.clientHeight);
	},

	//获取页面宽度
	getPageWidth: function() {
	    var g = document, a = g.body, f = g.documentElement, d = g.compatMode == "BackCompat" ? a : g.documentElement;
	    return Math.max(f.scrollWidth, a.scrollWidth, d.clientWidth);
	},
	 
	//获取页面可视宽度
	getPageViewWidth: function() {
	    var d = document, a = d.compatMode == "BackCompat"
	                    ? d.body
	                    : d.documentElement;
	    return a.clientWidth;
	},

	//获取页面可视高度
	getPageViewHeight: function() {
	    var d = document, a = d.compatMode == "BackCompat"
	                    ? d.body
	                    : d.documentElement;
	    return a.clientHeight;
	},
	 
	//获取页面scrollLeft
	getPageScrollLeft: function() {
	    var a = document;
	    return a.documentElement.scrollLeft || a.body.scrollLeft;
	},

	//获取页面scrollTop
	getPageScrollTop: function() {
	    var a = document;
	    return a.documentElement.scrollTop || a.body.scrollTop;
	},

	//获取窗体可见范围的宽与高
	getViewSize: function() {
	    var de = document.documentElement;
	    var db = document.body;
	    var viewW = de.clientWidth == 0 ? db.clientWidth : de.clientWidth;
	    var viewH = de.clientHeight == 0 ? db.clientHeight : de.clientHeight;
	    return Array(viewW, viewH);
	},

	//获取网页被卷去的位置
	getScrollXY: function() {
	    return document.body.scrollTop ? {
	        x: document.body.scrollLeft,
	        y: document.body.scrollTop
	    } : {
	        x: document.documentElement.scrollLeft,
	        y: document.documentElement.scrollTop
	    }
	},

	//随机数时间戳
	uniqueId: function() {
	    var a = Math.random, b = parseInt;
	    return Number(new Date()).toString() + b(10 * a()) + b(10 * a()) + b(10 * a());
	},

	//匹配国内电话号码(0511-4405222 或 021-87888822) 
	istell: function(str) {
	    var result = str.match(/\d{3}-\d{8}|\d{4}-\d{7}/);
	    if (result == null) return false;
	    return true;
	},

	//匹配身份证(15位或18位) 
	isIdCard: function(str) {
	    var result = str.match(/\d{15}|\d{18}/);
	    if (result == null) return false;
	    return true;
	},

	//金额大写转换函数 transformVal('123431233132.23')
	transformVal: function(tranvalue) {
	    try {
	        var i = 1;
	        var dw2 = new Array("", "万", "亿"); //大单位
	        var dw1 = new Array("拾", "佰", "仟"); //小单位
	        var dw = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); //整数部分用
	        //以下是小写转换成大写显示在合计大写的文本框中     
	        //分离整数与小数
	        var source = Flyme.decimalSplits(tranvalue);
	        var num = source[0];
	        var dig = source[1];
	        //转换整数部分
	        var k1 = 0; //计小单位
	        var k2 = 0; //计大单位
	        var sum = 0;
	        var str = "";
	        var len = source[0].length; //整数的长度
	        for (i = 1; i <= len; i++) {
	            var n = source[0].charAt(len - i); //取得某个位数上的数字
	            var bn = 0;
	            if (len - i - 1 >= 0) {
	                bn = source[0].charAt(len - i - 1); //取得某个位数前一位上的数字
	            }
	            sum = sum + Number(n);
	            if (sum != 0) {
	                str = dw[Number(n)].concat(str); //取得该数字对应的大写数字，并插入到str字符串的前面
	                if (n == '0') sum = 0;
	            }
	            if (len - i - 1 >= 0) { //在数字范围内
	                if (k1 != 3) { //加小单位
	                    if (bn != 0) {
	                        str = dw1[k1].concat(str);
	                    }
	                    k1++;
	                } else { //不加小单位，加大单位
	                    k1 = 0;
	                    var temp = str.charAt(0);
	                    if (temp == "万" || temp == "亿") //若大单位前没有数字则舍去大单位
	                        str = str.substr(1, str.length - 1);
	                    str = dw2[k2].concat(str);
	                    sum = 0;
	                }
	            }
	            if (k1 == 3) { //小单位到千则大单位进一
	                k2++;
	            }
	        }
	        //转换小数部分
	        var strdig = "";
	        if (dig != "") {
	            var n = dig.charAt(0);
	            if (n != 0) {
	                strdig += dw[Number(n)] + "角"; //加数字
	            }
	            var n = dig.charAt(1);
	            if (n != 0) {
	                strdig += dw[Number(n)] + "分"; //加数字
	            }
	        }
	        str += "元" + strdig;
	    } catch (e) {
	        return "0元";
	    }
	    return str;
	},

	//拆分整数与小数
	decimalSplits: function(tranvalue) {
	    var value = new Array('', '');
	    temp = tranvalue.split(".");
	    for (var i = 0; i < temp.length; i++) {
	        value = temp;
	    }
	    return value;
	},
	 
	//格式化数字
	numberFormat: function(number, decimals, dec_point, thousands_sep) {
	    /*
	    * 参数说明：
	    * number：要格式化的数字
	    * decimals：保留几位小数
	    * dec_point：小数点符号
	    * thousands_sep：千分位符号
	    * */
	    number = (number + '').replace(/[^0-9+-Ee.]/g, '');
	    var n = !isFinite(+number) ? 0 : +number,
	        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
	        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
	        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
	        s = '',
	        toFixedFix = function (n, prec) {
	            var k = Math.pow(10, prec);
	            return '' + Math.ceil(n * k) / k;
	        };
	 
	    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
	    var re = /(-?\d+)(\d{3})/;
	    while (re.test(s[0])) {
	        s[0] = s[0].replace(re, "$1" + sep + "$2");
	    }
	 
	    if ((s[1] || '').length < prec) {
	        s[1] = s[1] || '';
	        s[1] += new Array(prec - s[1].length + 1).join('0');
	    }
	    return s.join(dec);
	}


}