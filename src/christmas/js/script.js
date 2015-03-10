'use strict';
$(function(){

	alert($(this).width());
	alert(window.innerWidth);
	alert(window.devicePixelRatio);
	

	$('.pack').css('minHeight', $(window).height());
	$('.giftevent .view').on('click', function(){
		var val = parseInt($(this).attr('data-val'));
		$('.codetext').hide();
		$('.prz-ico').attr('class', 'prz-ico').addClass('prz-gift' + val);
		$('.giftshow .name').html($(this).siblings('.przname').val());
		if(val === 4 || val === 5){
			$('.giftshow .text').hide();
			$('#overlay').show();
			return false;
		}
		var general = $(this).siblings('.general').text();
		$('.codetext .code').text('');
		if(general){
			$('.generalc .code').text(general);
			$('.generalc, #overlay').show();
		}else{
			var appcode = $(this).siblings('.appcode').text(),
				ipacode = $(this).siblings('.ipacode').text();
			$('.appc .code').text(appcode);
			$('.ipac .code').text(ipacode);
			$('.appc, .ipac, #overlay').show();
		}
	});
	$('.giftshow .confirm, .giftclose').on('click', function(){
		$('#overlay').hide();
	});
	$('.popup .confirm').on('click', function(){
		$('#overlay').hide();
		if($('.creditsleft .cred').text() > 0){
			if($('.popup-inner .confirm').text() === '确定'){
				$('#overlay').hide();
			}else{
				$('.slotbtn').trigger('click');
			}
			
		}
	});
});

