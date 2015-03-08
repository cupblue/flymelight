/*! web - christmas - v1.0.0 - fldevteam - 2015-03-06 */
$(function(){
/*
	alert($(this).width());
	alert(window.innerWidth);
	alert(window.devicePixelRatio);
	
*/	$('.pack').css('minHeight', $(window).height());
	$(".giftevent .view").on('click', function(e){
		var val = $(this).attr('data-val');
		$(".codetext").hide();
		$(".prz-ico").attr('class', "prz-ico").addClass("prz-gift" + val);
		$(".giftshow .name").html($(this).siblings(".przname").val());
		if(val == 4 || val == 5){
			$(".giftshow .text").hide();
			$("#overlay").show();
			return false;
		}
		var general = $(this).siblings(".general").text();
		$(".codetext .code").text("");
		if(general){
			$(".generalc .code").text(general);
			$(".generalc, #overlay").show();
		}else{
			var appcode = $(this).siblings(".appcode").text(),
				ipacode = $(this).siblings(".ipacode").text();
			$(".appc .code").text(appcode);
			$(".ipac .code").text(ipacode);
			$(".appc, .ipac, #overlay").show();
		}
	});
	$(".giftshow .confirm, .giftclose").on('click', function(){
		$("#overlay").hide();
	});
	$(".popup .confirm").on('click', function(){
		$("#overlay").hide();
		if($(".creditsleft .cred").text() > 0){
			if($(".popup-inner .confirm").text() == '确定'){
				$("#overlay").hide();
			}else{
				$(".slotbtn").trigger('click');
			}
			
		}
	});
});



$(function(){
/*
	alert($(this).width());
	alert(window.innerWidth);
	alert(window.devicePixelRatio);	*/	
	$('.lot').css('minHeight', $(window).height());
	$(window).resize(function(){
		$('.lot').css('minHeight', $(window).height());
	});

	var sign = false;

	$(".giftshow .confirm, .giftclose").on('click', function(){
		$("#overlay").hide();
	});
	$(".popup .confirm").on('click', function(){
		$("#overlay").hide();
		if($(".creditsleft .cred").text() > 0){
			if($(".popup-inner .confirm").text() == '确定'){
				$("#overlay").hide();
			}else{
			//	alert('aasd');
				sign = true;
				$(".slotbtn").trigger('click');
			}
			
		}
	});
	
	var flag = true;

	$("#slotbtn").click(function(){
		if(flag){	
			flag = false;

			// 在此添加ajax请求函数，获取抽奖结果数据

			//模拟返回json数据格式：
			//var responseData = {"stat" : 0, "result" : [3, 3, 3], "prizeCode" : "A001", "prizeName" : "三国艳义游戏大礼包", "creditsleft": 350, "timesleft" : 2, "prizeTotalCount" : 3, "tips" : "恭喜获奖"};
			var responseData = {"stat" : -1, "result" : [1, 3, 8], "prizeCode" : "A003", "prizeName" : "", "creditsleft": 180, "timesleft" : 0, "prizeTotalCount" : 3, "tips" : "很遗憾", "creditsConsume" : 20, "creditsTips" :"今天赠送的抽奖机会已用完<br>花20积分再来一次吗？"}

			if(!responseData.timesleft){
				//alert("今天的抽奖机会用完了！");
				if (!sign) {
					$(".popup .tipstxt").html(responseData.creditsTips);
					$("#overlay").show();
					flag = true;
					//return false;
					if(responseData.creditsleft  < responseData.creditsConsume){
						if($(".popup-inner .confirm").text() == '确定'){
							$("#overlay").hide();
						}
						$(".popup .tipstxt").html("本次抽奖需要消耗" + responseData.creditsConsume + "积分<br>快去赚积分吧~");
						$(".popup-inner .confirm").text("确定");
						$("#overlay").show();
						flag = true;
						return false;
					}
					return false;	
				}
				
			}


			if(!responseData.prizeTotalCount){
				$(".lot-pack").html("<img class=\"lot-btm-img\" src=\"images/backpack_small.png\" alt=\"我的背包\">");
			}

			// 下面的为ajax回调函数内容。
			var machine1 = $("#machine1").slotMachine({
				active	: 0,
				delay	: 500,
				stopIndex: responseData.result[0]
			});
			
			var machine2 = $("#machine2").slotMachine({
				active	: 1,
				delay	: 500,
				stopIndex: responseData.result[1]
			});
			
			var machine3 = $("#machine3").slotMachine({
				active	: 2,
				delay	: 500,
				stopIndex: responseData.result[2]
			});
			
			function onComplete($el, active){
				switch($el[0].id){
					case 'machine1':
						$("#machine1Result").text("Index: "+active.index);
						break;
					case 'machine2':
						$("#machine2Result").text("Index: "+active.index);
						break;
					case 'machine3':
						$("#machine3Result").text("Index: "+active.index);
						break;
				}
			}
			machine1.shuffle(3, onComplete);
			
			setTimeout(function(){
				machine2.shuffle(3, onComplete);
			}, 500);
			
			setTimeout(function(){
				machine3.shuffle(3, onComplete);

			}, 1000);
			
			$(".creditsleft .cred").html(responseData.creditsleft);
			$(".timesleft").html(responseData.timesleft);
			setTimeout(function(){
				if(responseData.stat == -1){
					//未中奖
					$(".stat").hide();
					$(".stat-failure").show();
				}else if(responseData.stat == 0){
					//中奖
					$("#prizename").html(responseData.prizeName);
					$(".stat").hide();
					$(".stat-success").show();
				}else{
					//其他状态，如非法，重复，等。
					alert(responseData.tips);
					$(".stat").hide();
					$(".stat-default").show();
					
				}

				flag = true;
				sign = false;
			}, 3000);
		}
		
	})
});

