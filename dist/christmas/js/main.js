/*! web - christmas - v1.0.0 - fldevteam - 2015-03-07 12:18:38 */
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



Particle3D=function(material){
	THREE.Particle.call(this,material);
	this.velocity=new THREE.Vector3(0,-8,0);
	this.velocity.rotateX(randomRange(-45,45));
	this.velocity.rotateY(randomRange(0,360));
	this.gravity=new THREE.Vector3(0,0,0);
	this.drag=1;
};
Particle3D.prototype=new THREE.Particle();
Particle3D.prototype.constructor=Particle3D;
Particle3D.prototype.updatePhysics=function(){
	this.velocity.multiplyScalar(this.drag);
	this.velocity.addSelf(this.gravity);
	this.position.addSelf(this.velocity);
}
var TO_RADIANS=Math.PI/180;
THREE.Vector3.prototype.rotateY=function(angle){
	cosRY=Math.cos(angle*TO_RADIANS);
	sinRY=Math.sin(angle*TO_RADIANS);
	var tempz=this.z;;
	var tempx=this.x;
	this.x=(tempx*cosRY)+(tempz*sinRY);
	this.z=(tempx*-sinRY)+(tempz*cosRY);
}
THREE.Vector3.prototype.rotateX=function(angle){
	cosRY=Math.cos(angle*TO_RADIANS);
	sinRY=Math.sin(angle*TO_RADIANS);
	var tempz=this.z;;
	var tempy=this.y;
	this.y=(tempy*cosRY)+(tempz*sinRY);
	this.z=(tempy*-sinRY)+(tempz*cosRY);
}
THREE.Vector3.prototype.rotateZ=function(angle){
	cosRY=Math.cos(angle*TO_RADIANS);
	sinRY=Math.sin(angle*TO_RADIANS);
	var tempx=this.x;;
	var tempy=this.y;
	this.y=(tempy*cosRY)+(tempx*sinRY);
	this.x=(tempy*-sinRY)+(tempx*cosRY);
}
function randomRange(min,max){
	return((Math.random()*(max-min))+ min);
}

var SCREEN_WIDTH = window.innerWidth;
//var SCREEN_HEIGHT = window.innerHeight;
var SCREEN_HEIGHT = parseInt(window.innerWidth * 94 / 75) + 30;

var container;

var particle;

var camera;
var scene;
var renderer;

var mouseX = 0;
var mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var particles = []; 
var particleImage = new Image();//THREE.ImageUtils.loadTexture( "img/ParticleSmoke.png" );
	particleImage.src = 'images/snow.png';
$(document).ready(function(){
	particleImage.onload = function(){
		createSnow();
	}
});

function createSnow() {
	container = document.createElement('div');
	$('#page').append($(container));
	$(container).addClass('snowFall');
	camera = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
	camera.position.z = 1000;

	scene = new THREE.Scene();
	scene.add(camera);
		
	renderer = new THREE.CanvasRenderer();
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	var material = new THREE.ParticleBasicMaterial( { map: new THREE.Texture(particleImage) } );
		
	for (var i = 0; i < 500; i++) {

		particle = new Particle3D( material);
		particle.position.x = Math.random() * 2000 - 1000;
		particle.position.y = Math.random() * 2000 - 1000;
		particle.position.z = Math.random() * 2000 - 1000;
		particle.scale.x = particle.scale.y =  1.4;
		scene.add( particle );
		
		particles.push(particle); 
	}

	container.appendChild( renderer.domElement );

	setInterval( loop, 50 );	
}


//

function loop() {

for(var i = 0; i<particles.length; i++)
	{
		var particle = particles[i]; 
		particle.updatePhysics(); 

		with(particle.position)
		{
			if(y<-1000) y+=2000; 
			if(x>1000) x-=2000; 
			else if(x<-1000) x+=2000; 
			if(z>1000) z-=2000; 
			else if(z<-1000) z+=2000; 
		}				
	}

	camera.position.x += ( mouseX - camera.position.x ) * 0.05;
	camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
	camera.lookAt(scene.position); 

	renderer.render( scene, camera );

	
}