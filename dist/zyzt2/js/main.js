'use strict';
$(function(){
	var flag = true,
		mobitip = '请输入您的手机号进行验证',
		mobile = '',
		sign = '';
	
	function setFlag(flg){
		flag = flg;
	}

	//图片预加载
	function loadImage(url, callback) {
		var img = new Image(); //创建一个Image对象，实现图片的预下载 
		img.src = url; 

		if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数 
			callback.call(img); 
			return; // 直接返回，不用再处理onload事件 
		} 

		img.onload = function () { //图片下载完毕时异步调用callback函数。 
			callback.call(img);//将回调函数的this替换为Image对象 
		};
	}

	function sendprz(mobile){
		$.ajax({
			type : 'GET',
			url : 'http://gameapi.feiliu.com/zyzn/zyactivity/sendGiftCode',	//发送获奖兑换码接口
			dataType : 'jsonp',
			data : {'mobile' : mobile},
			success : function(data){
				// data = { 'status' : 1, 'mobile' : '13800138000'}
				if(data.status === 1){
					alert('奖品兑换码已经发放到您的手机号，请稍后查收短信！');
				}else if(data.status === 0){
					alert('领取失败');
				}else if(data.status === -1){
					alert('该手机号码已领取');
				}
			}
		});
	}

	function checkcode(codenum, callback){
		$.ajax({
			type : 'GET',
			url : 'http://gameapi.feiliu.com/zyzn/zyactivity/checkVerify',	//验证短信接口
			dataType : 'jsonp',
			data : {'inputVerify' : codenum, 'sign' : sign},
			success : function(data){
				// data = { 'status' : 1, 'mobile' : '13800138000'}
				// if(data.status === 1){
				// 	callback(data.mobile);
				// }
				if(data.status === 1){
					callback();
				}else{
					alert('验证码有误');
				}
			}
		});
	}

	function getverifycode(mobi, callback){
		$.ajax({
			type : 'GET',
			url : 'http://gameapi.feiliu.com/zyzn/zyactivity/sendVerify',	//获取验证码接口
			dataType : 'jsonp',
			data : {'mobile' : mobi },
			success : function(data){
				// data = { 'success' : 1, }
				if(data.success){
					callback(false);
				}
				if(data.code === 1){
					sign = data.sign;
					mobile = mobi;
					callback(false);
				}
				
			}
		});
	}


	function vote(target, callback){
		target++;
		$.ajax({
			type : 'GET',
			url : 'http://gameapi.feiliu.com/zyzn/zyactivity/vote',	//投票接口，返回剩余次数
			dataType : 'jsonp',
			data : {'showgirlid' : target },
			success : function(data){
				// data = { 'timesleft' : 2}
				callback(data, target);
			}
		});
	}

	function showmsg(data, target){
		if(data.timesleft >= 0){
			$('#timesleft').text(data.timesleft);
			$('#gallery, .przpop').hide();
			$('.voteres, #popup, #overlay').show();
			var oldnum = parseInt($('#count_' + target).html());
			$('#count_' + target).html(oldnum + 1);
		}else{
			$('#gallery, .przpop, .voteres').hide();
			$('.no-vote, #popup, #overlay').show();
		}
		return false;
	}

	(function getNumOfVotes(){	//获取每个showgirl获得票数
		$.ajax({
			type : 'GET',
			url : 'http://gameapi.feiliu.com/zyzn/zyactivity/getNumOfVotes',
			dataType : 'jsonp',
			data : {},
			success : function(data){
				if(data.status === 1){
					var len = data.lists.length;
					for(var i=0;i<len;i++){
						$('#count_' + i).html(data.lists[i]);
					}
				}
			}
		});
	})();
	

	$('.yaoitem-img').hover(function(){
		$(this).find('.intro').show();
	},function(){
		$(this).find('.intro').hide();
	});

	$('.dload-btn a').mouseover(function(){
		var index = $(this).index();
		$(this).parent().next().children(':eq(' + index + ')').show().siblings().hide();
	});

	$('.follow .wx').hover(function(){
		$('.wxqr').show();
	},function(){
		$('.wxqr').hide();
	});

	$('.yaoitem-img').on('click', function(){

		$('#popup').hide();
		var html = '',
			num = $(this).attr('data-num'),
			index = $(this).parent().index() + 1;
		for(var i=1; i<=num; i++){
			//http://js.feiliu.com/static/zyzn/special/web/20150518/images/gallery-big/
			var src = 'images/400-600/' + index + '.jpg',
				url = src;

			loadImage(url, function(){});
			if(i===1){
				html += '<ul>';
			}
			html += '<li><img src=' + src + '></li>';
			if(i===num){
				html += '</ul>';
			}
		}
		$('.bd').html(html);
		/*
		setTimeout(function(){
			jQuery('#gallery').slide( { mainCell:'.bd ul', effect:'leftLoop',autoPlay:false });
		}, 500);
		*/
		$('#gallery, #overlay').show();
	});

	$('.votebtn').on('click', function(){
		var target = $(this).parent().parent().index();
		vote(target, showmsg);
	});

	$('#mobi').on('focus', function(){
		var val = $.trim($(this).val());
		if(val === mobitip){
			$(this).val('');
		}else{
			$(this).val(val);				
		}
	});

	function closePopup(){
		$('#popup, #overlay').hide();
	}

	function voteContinue(){
		var timesleft = $.trim($('#timesleft').text());
		if(timesleft > 0){
			$('.voteres, #popup, #overlay').hide();
		}else{
			alert('3次投票次数已用完，快去领奖吧~');
		}
	}

	function getPrz(){
		$('.voteres, .no-vote').hide();
		$('.przpop, #popup, #overlay').show();
	}

	function getVerifyCode(){
		var mobile = $.trim($('#mobi').val());
		
		if(mobile === mobitip || !mobile){
			alert('请输入手机号码');
			return false;
		}else if(!/^(13[0-9]|1[4578][0-9])\d{8}$/i.test(mobile)){
			alert('手机号码格式错误，请重新输入');
			return false;		
		}
		if(flag){
			getverifycode(mobile, setFlag);
		}else{
			alert('请勿重复发送，请耐心等待短信验证码短信');
		}
	}

	function confirmVerifyCode(){
		var mobile = $.trim($('#mobi').val());
		
		if(mobile === mobitip || !mobile){
			alert('请输入手机号码');
			return false;
		}else if(!/^(13[0-9]|1[4578][0-9])\d{8}$/i.test(mobile)){
			alert('手机号码格式错误，请重新输入');
			return false;		
		}
		var ccode = $.trim($('#ccode').val());
			if(!/^\d{4}$/i.test(ccode)){
			alert('验证码需要是4位数字，请重新输入');
			return false;		
		}
		checkcode(ccode, sendprz);
	}


/*
	$('#close').on('click', function(){
		$('#popup, #overlay').hide();
	});



	$(.voteres).on('click', '.continue', function(){
		var timesleft = $.trim($('#timesleft').text());
		if(timesleft > 0){
			$('.voteres, #popup, #overlay').hide();
		}else{
			alert('3次投票次数已用完，快去领奖吧~');
		}
	});

	$(.voteres ).on('click', '.getprz', function(){
		$('.voteres, .no-vote').hide();
		$('.przpop, #popup, #overlay').show();
	});

	

	
	$('#getcode').on('click', function(){
		var mobile = $.trim($('#mobi').val());
		
		if(mobile === mobitip || !mobile){
			alert('请输入手机号码');
			return false;
		}else if(!/^(13[0-9]|1[4578][0-9])\d{8}$/i.test(mobile)){
			alert('手机号码格式错误，请重新输入');
			return false;		
		}
		if(flag){
			getverifycode(mobile, setFlag);
		}else{
			alert('请勿重复发送，请耐心等待短信验证码短信');
		}
		

	});
	
	$('#confirm').on('click', function(){
		var mobile = $.trim($('#mobi').val());
		
		if(mobile === mobitip || !mobile){
			alert('请输入手机号码');
			return false;
		}else if(!/^(13[0-9]|1[4578][0-9])\d{8}$/i.test(mobile)){
			alert('手机号码格式错误，请重新输入');
			return false;		
		}
		var ccode = $.trim($('#ccode').val());
			if(!/^\d{4}$/i.test(ccode)){
			alert('验证码需要是4位数字，请重新输入');
			return false;		
		}
		checkcode(ccode, sendprz);
					
	});
*/
	$('#overlay').on('click', function(e){
		var target = e.target || window.event.srcElement;
		if(target === $(this)[0]){
			$(this).hide();
			$('#gallery').hide();
			return false;
		}else if(target === $('#close')[0]){
			closePopup();
		}else if(target === $('.continue')[0]){
			voteContinue();
		}else if(target.className === 'getprz'){
			getPrz();
		}else if(target === $('#getcode')[0]){
			getVerifyCode();
		}else if(target === $('#confirm')[0]){
			confirmVerifyCode();
		}
		
	});

});