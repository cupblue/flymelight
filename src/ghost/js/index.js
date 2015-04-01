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

	var popupObj =document.getElementById('popup'),
		overlayObj = document.getElementById('overlay'),
		shareLayer = overlayObj.lastElementChild || overlayObj.lastChild;	

	//积分购买，更新抽奖次数
	function lotChance(url, udata, callback){
		$$.getJSON(url, udata, 'callback', function(data){
		    if(data === null){
				data = {};
			}
			data.uid = udata.uid;
			if(callback) {
				callback(data);
			} 
		});
	}

	//购买回调函数，无刷新更新页面状态
	function setPageInfo(data){
		document.getElementById('timesleft').innerHTML = data.timesleft;
		document.getElementById('shareval').innerHTML = data.shareDone;
	}	

	function showmsg(data){
		var titwords ='',
			tipwords = '';
		if(data.timesleft <= 0){
			titwords = '免费抽奖次数已用完';
			if(data.shareDone === 1){
				if(data.creditsTotal < data.creditsConsume){
					tipwords = '积分不足，赶快去社区发帖赚积分吧~';
				}else{
					tipwords = '使用积分还能增加抽奖机会哦';
				}
				
			}else{
				tipwords = '分享活动还能获得一次抽奖机会哦';
			}
		}else{
			location.href = 'play.html';
		}
		var html = '';
			html += '<div class="cont">' +
						'<div class="res tc"><img class="res-ico" src="images/fail.png" alt=""><span class="res-words">' + titwords + '</span></div>' + 
						'<div class="tips">' +
							'<p class="row">' + tipwords + '</p>' +
							'<p class="row">我的积分：<b class="credits">' + data.creditsTotal + '</b></p>' +
						'</div>' +
					'</div>' +
					'<div class="cbtn"><a href="javascript:;" class="cbtn-a cbtn-lft';
		if(data.creditsTotal < data.creditsConsume){
			html += ' disabled';
		}
		html += '">' + data.creditsConsume + '积分抽奖</a><a href="javascript:;" class="cbtn-a cbtn-rgt';
		if(data.shareDone === 1){
			html += ' disabled';
		}
		html += '" id="sbtn">分享活动</a></div>';
		html += '<span class="close" id="close"><b>×</b></span>';
		popupObj.innerHTML = html;
		popupObj.style.display = 'block';
		// overlayObj.style.display = 'block';
	}

	function gotoPlay(){
		// var initData = {'status' : 1, 'result' : '', 'creditsTotal' : 22, 'creditsConsume' : 40, 'suc' : 0, 'przCont' : '差一点就抽到了！', 'tips' : ''};
		var initData = {'status' : 1, 'result' : '', 'creditsTotal' : 122, 'creditsConsume' : 40, 'suc' : 0, 'przCont' : '差一点就抽到了！', 'tips' : ''};

		var uid = document.getElementById('uid').value,
			sign = document.getElementById('sign').value,
			sharedone = document.getElementById('shareval').value,
			timesleft = document.getElementById('timesleft').innerHTML;

		initData.timesleft = timesleft;
		initData.shareDone = sharedone;
		/*测试数据 start*/
		// initData.timesleft = 0;
		// initData.shareDone = 0;
		/*测试数据 end*/

		if(initData.timesleft <= 0){
			showmsg(initData);
			var jsonData = {'uid' : uid ,'timesleft' : timesleft, 'sign' : sign, 'sharedone' : sharedone};
			lotChance('http://', jsonData, setPageInfo);
		}else{
			location.href='play.html';
		}

	}

	function overlayHandler(event){
		var x = event.target;
		if(x.className === 'sharelayer' || x.className === 'shareimg'){
			var aval = shareLayer.style.display === 'block' ? 'none' : 'block';
			shareLayer.style.display = aval;
			overlayObj.style.display = aval;
		}
	}

	function popupHandler(event){
		var x = event.target;
		if(x.nodeName.toLowerCase() === 'b'){
			popupObj.style.display = 'none';
			overlayObj.style.display = 'none';
			return;	
		}
		if(x.id === 'sbtn'){
			var val = shareLayer.style.display === 'block' ? 'none' : 'block';
			shareLayer.style.display = val;
			overlayObj.style.display = val;
			return;	
		}
	}

	var evtType = 'ontouchstart' in document.documentElement ? 'touchstart' : 'click';
	document.getElementById('playbtn').addEventListener(evtType, gotoPlay, false);
	overlayObj.addEventListener(evtType, overlayHandler, false);
	popupObj.addEventListener(evtType, popupHandler, false);

