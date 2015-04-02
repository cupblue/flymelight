'use strict';
	var $$ = {
		//jsonp自定义
	    getJSON: function(url, params, callbackFuncName, callback){
	    	// url += '&' + callbackFuncName + '=jsonpfunc';
	    	url += '&' + callbackFuncName + '=jsonp' + Math.floor(Math.random()*1000000);
	        var paramsUrl = '',
	            jsonp = this.getQueryString(url)[callbackFuncName];
	        for(var key in params){
	            paramsUrl += '&' + key + '=' + encodeURIComponent(params[key]);
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
	        script.charset = 'UTF-8';
	        script.src = url;
	        script.async = true;
	        head.appendChild(script);
	        return true;
	    },
	    getQueryString: function(url) {
	        var result = {}, queryString = (url && url.indexOf('?')!==-1 && url.split('?')[1]) || location.search.substring(1),
	            re = /([^&=]+)=([^&]*)/g, m;
	        while (m = re.exec(queryString)) {
	            result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
	        }
	        return result;
	    }
	};

/*
	function whichTransitionEvent(){
       var t;
       var el = document.createElement('fakeelement');
       var transitions = {
         'transition':'transitionend',
         'OTransition':'oTransitionEnd',
         'MozTransition':'transitionend',
         'WebkitTransition':'webkitTransitionEnd'
       };
       for(t in transitions){
           if( el.style[t] !== undefined ){
               return transitions[t];
           }
       }
	}
*/
	function whichAnimationEvent(){
       var t;
       var el = document.createElement('animelem');
       var animations = {
         'transition':'animationend',
         'OTransition':'oanimationend',
         'MozTransition':'mozAnimationEnd',
         'MSAnimation':'MSAnimationEnd',
         'WebkitTransition':'webkitAnimationEnd'
       };
       for(t in animations){
           if( el.style[t] !== undefined ){
               return animations[t];
           }
       }
	}

/*
	function getOffset(node, offset) {
	    if (!offset) {
	        offset = {};
	        offset.top = 0;
	        offset.left = 0;
	    }

	    if (node === document.body) {//当该节点为body节点时，结束递归
	        return offset;
	    }

	    offset.top += node.offsetTop;
	    offset.left += node.offsetLeft;

	    return getOffset(node.parentNode, offset);//向上累加offset里的值
	}

*/

	var flag = true,
		total = 0,
		timer = null,
		milliseconds = 0,
		k_index,
		storage = window.localStorage,
		animationEvent = whichAnimationEvent();
		
	var obj_item = document.getElementById('ghost-list').getElementsByTagName('li'),
		totalObj = document.getElementById('totalcount'),
		overlayObj = document.getElementById('overlay'),
		popupObj = document.getElementById('popup'),
		popupRes = popupObj.firstElementChild || popupObj.firstChild,
		shareLayer = overlayObj.lastElementChild || overlayObj.lastChild,
		w = document.getElementById('wrap').clientWidth,
		h_window = document.documentElement.clientHeight,
		h_wrap = document.documentElement.clientWidth >= 640 ? 1080 : h_window,
		w_item = Math.floor(w/3),
		h_item = Math.floor(w_item*248/235 * 1.3),
		top_area = Math.floor(w*370/720);

	for(var i=0, len = obj_item.length; i<len; i++){
		obj_item[i].setAttribute('style', 'height:' + h_item + 'px');
	}
	document.getElementById('ghost-area').setAttribute('style', 'top:' + top_area + 'px');
	document.getElementById('wrap').setAttribute('style', 'height:' + h_wrap + 'px');




	function index(current, obj){
		for (var i = 0, length = obj.length; i<length; i++) {
			if (obj[i] === current) {
				return i;
			}
		}
	}

	function setCookie(c_name, value, expiredays){
		var exdate=new Date();
		exdate.setDate(exdate.getDate() + expiredays);
		document.cookie = c_name + '=' + encodeURIComponent(value) + ((expiredays === null) ? '' : ';expires=' + exdate.toGMTString());
	}

	function getCookie(c_name){
		var c_start, c_end;
　　　　if (document.cookie.length > 0){　　//先查询cookie是否为空，为空就return ''
　　　　　　c_start = document.cookie.indexOf(c_name + '=');　　//通过String对象的indexOf()来检查这个cookie是否存在，不存在就为 -1　　
　　　　　　if (c_start !== -1){ 
　　　　　　　　c_start = c_start + c_name.length + 1;　//+1其实就是表示'='号,获取cookie值开始位置
　　　　　　　　c_end = document.cookie.indexOf(';', c_start);　　//indexOf()第二个参数表示指定的开始索引的位置.这句是为了得到值的结束位置。因为需考虑是否是最后一项，所以通过';'号是否存在来判断
　　　　　　　　if (c_end === -1){
					c_end = document.cookie.length;
				}　　
　　　　　　　　return decodeURIComponent(document.cookie.substring(c_start, c_end));　　//通过substring()得到了值。在输入cookie信息时不能包含空格，分号，逗号等特殊符号,escape后可避免因特殊符号导致的报错，get时再unescape()
　　　　　　} 
　　　　}
　　　　return '';
　　}

	function getStorge(l_name){
		if(storage){
			if(storage.getItem(l_name) !== null){ 
				return storage.getItem(l_name); 
			}
		}else if(document.cookie.length > 0){
			var dd = getCookie(l_name);
			return dd;
		}
		return;
	}

	function setStorge(l_name, val, expire){
		if(storage){ 
			storage.setItem(l_name, val);   
		}else{ 
			setCookie(l_name, val, expire);
		}
	}

	//ajax抽奖
	function getPrz(uid, sign, total, callback){
		var url = '';
		$$.getJSON(url, {'uid':uid, 'sign':sign}, 'callback', function(data){
		    if(data == null){
				data = {};
			}
			data.total = total;
			if(callback) {
				callback(data);
			} 
		});
	}

	//弹窗显示抽奖结果
	function showRes(data){
		Flyme && Flyme.wxShareInit('wx4739efbb76920078','C2', 1, '', {
			'id': '1',
			'link': 'http://game.feiliu.com/protest/qm/index.html',
			'imgUrl': 'http://game.feiliu.com/protest/christmas/images/share.png',
			'title': '30秒内我打了' + data.total + '个怪兽，敢不敢来挑战？！- 全职高手',
			'desc': '全职高手手游，玩游戏拿大奖，还不赶紧行动！！！'
		});
		data = {'status' : 5, 'total' : data.total, 'timesleft' : 0, 'result' : '', 'percent' : '12.7', 'creditsTotal' : 0, 'creditsConsume' : 0, 'shareDone' : 0, 'suc' : 0, 'przTit': '很遗憾~', 'przCont' : '', 'tips' : ''};
		data = {'status' : 2, 'total' : data.total, 'timesleft' : 0, 'result' : '', 'percent' : '52.7', 'creditsTotal' : 100, 'creditsConsume' : 20, 'shareDone' : 0, 'suc' : 1, 'przTit':'很遗憾~', 'przCont' : '', 'tips' : '' };
		var pophtml = '<div class="popup-tit">游戏结束</div>' +
					  '<div class="popup-cont">你打了 <i>' + data.total + '</i> 个僵尸，<br>战胜全宇宙 <i>' + data.percent + '%</i> 的小伙伴~<br>';
		if(data.przCont){
			pophtml += '同时还获得了：<br><img src="images/gift01.png" alt=""><br><span class="gift-name">' + data.przCont +  '</span></div>';
		}else{
			pophtml += '本次未获奖，再接再厉哦！' +  '</span></div>';
		}
					 
		pophtml += '<div class="popup-btn tc"><a href="javascript:;" class="btn-item"><img class="btn-showoff" src="images/show.png" alt="炫耀一下"></a><a href="index.html" class="btn-item"><img class="btn-back" src="images/back.png" alt="返回首页"></a></div>';
		
		setTimeout(function(){
			popupRes.innerHTML = pophtml;
			popupObj.style.display = 'block';
			// overlayObj.style.display = 'block';
		}, 1000);
		
		

	}

	function setFlag(flagval){
		flag = flagval;
	}

	// 倒计时
	function countdown(container, seconds){
		setFlag(false);
		var secstr = '';
		var itimer = setInterval(function(){
			seconds--;
			secstr = seconds<10 ?　'0'+seconds : seconds;
			container.innerHTML = '00:' + secstr;
			if(seconds <= 0){
				clearInterval(itimer);
				clearInterval(timer);
				setFlag(true);
				var totalCount = getStorge('total');
				var uid = document.getElementById('uid'),
					sign = document.getElementById('sign');
				/*测试代码 start*/
				// showPlayMsg(totalCount, obj_playres);
				setTimeout(function(){
					// hidePlayMsg(obj_playres);
					
					showRes({'total' : totalCount});
				}, 2000);
				/*测试代码 end*/
				getPrz(uid, sign, totalCount, showRes);
			}
		},1000);		
	}



	function ghostPlay(collection, arr, time){
		var len =arr.length;
		for(var i=0; i<len; i++){
			var j = arr[i] - 1;
			collection[j].className = 'ghost-item ghost-live';
		}
		setTimeout(function(){
			for(var i=0; i<len; i++){
				var j = arr[i] - 1;
				collection[j].className = 'ghost-item';
			}
		}, time/2);
	}
	function generateRadom(collection){
		var len = collection.length,
			arr = [];
		if(len > 0){
			var	rdmNum = Math.floor(Math.random()*len/2 + 1);	//随机出现个数
			for(var j=1; j<=len; j++){
				arr.push(j);
			}
			arr = arr.sort(function(){ return Math.random() - 0.5;});	//打乱顺序
			arr.splice(0, len-rdmNum);
		}
		return arr;
	}


	function playStart(obj){
		var chance = document.getElementById('chance');
		if(!chance){
			alert('没有机会了');
		}
		if(flag){
			var parent = obj.parentNode;
			parent.style.display = 'none';
			overlayObj.style.display = 'none';
			document.getElementById('total').className = 'total bounce animated';
			document.getElementById('time').className = 'time bounce animated';
			total = 0;
			setStorge('total', total, 1);
			countdown(document.getElementById('countdown'), 30);
			timer =setInterval(function(){
				var resArray = generateRadom(obj_item);
				ghostPlay(obj_item, resArray, 1500);
			},1000);
		}
		
	}

	function startCountAnimation(animObj, total, clsName){
		animObj.innerHTML = total;
		animObj.className = clsName;
	}

	function stopCountAnimation(animObj, clsName, timeout){
		if(animationEvent && !('ontouchstart' in document.documentElement)){
			animObj.addEventListener(animationEvent, function() {
				this.className = clsName;
			});
		}else{
			setTimeout(function(){
				animObj.className = clsName;
			}, timeout);
		}

	}

	function kill(e){
		if(!flag){
			if(e.target.className === 'ghost-item ghost-live'){
				var msec = new Date().getTime();
				var this_index = index(e.target, obj_item);
				// console.log(this_index + ':' + k_index);
				if(msec - milliseconds < 100 && this_index === k_index){	//连点检测
					console.log(msec + '-' + milliseconds);
				}
				if(msec - milliseconds >= 100){
					e.target.className = 'ghost-item ghost-dead';
					total++;
					startCountAnimation(totalObj, total, 'totalcount slidedown count-animated');
					stopCountAnimation(totalObj, 'totalcount', 500);
					setStorge('total', total, 1);
					k_index = this_index;
				}
				milliseconds = msec;
			}
		}
	}


	function layerHandler(e){
		var x = e.target;		
		if(x.className === 'sharelayer' || x.className === 'shareimg'){
			var aval = shareLayer.style.display === 'block' ? 'none' : 'block';
			shareLayer.style.display = aval;
			overlayObj.style.display = aval;
		}

		if(x.className.toLowerCase() === 'startbtn'){
			playStart(x);
			overlayObj.style.display = 'none';
		}		

	}

	function popupHandler(e){
		var x = e.target;
		if(x.className.toLowerCase() === 'btn-showoff'){ 
			var val = shareLayer.style.display === 'block' ? 'none' : 'block';
			shareLayer.style.display = val;
			overlayObj.style.display = 'block';	
		}
	}

	var evtType = 'ontouchstart' in document.documentElement ? 'touchstart' : 'click';
	for(var k=0, klen = obj_item.length; k<klen; k++){
		obj_item[k].addEventListener(evtType, kill, false);
	}
	overlayObj.addEventListener(evtType, layerHandler, false);
	popupObj.addEventListener(evtType, popupHandler, false);

