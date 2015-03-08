/*! web - christmas - v1.0.0 - fldevteam - 2015-03-06 */
function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

function createSnow() {
    container = document.createElement("div"), $("#page").append($(container)), $(container).addClass("snowFall"), 
    camera = new THREE.PerspectiveCamera(75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 1e4), 
    camera.position.z = 1e3, scene = new THREE.Scene(), scene.add(camera), renderer = new THREE.CanvasRenderer(), 
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    for (var material = new THREE.ParticleBasicMaterial({
        map: new THREE.Texture(particleImage)
    }), i = 0; 500 > i; i++) particle = new Particle3D(material), particle.position.x = 2e3 * Math.random() - 1e3, 
    particle.position.y = 2e3 * Math.random() - 1e3, particle.position.z = 2e3 * Math.random() - 1e3, 
    particle.scale.x = particle.scale.y = 1.4, scene.add(particle), particles.push(particle);
    container.appendChild(renderer.domElement), setInterval(loop, 50);
}

function loop() {
    for (var i = 0; i < particles.length; i++) {
        var particle = particles[i];
        with (particle.updatePhysics(), particle.position) y < -1e3 && (y += 2e3), x > 1e3 ? x -= 2e3 : x < -1e3 && (x += 2e3), 
        z > 1e3 ? z -= 2e3 : z < -1e3 && (z += 2e3);
    }
    camera.position.x += .05 * (mouseX - camera.position.x), camera.position.y += .05 * (-mouseY - camera.position.y), 
    camera.lookAt(scene.position), renderer.render(scene, camera);
}

$(function() {
    $(".pack").css("minHeight", $(window).height()), $(".giftevent .view").on("click", function() {
        var val = $(this).attr("data-val");
        if ($(".codetext").hide(), $(".prz-ico").attr("class", "prz-ico").addClass("prz-gift" + val), 
        $(".giftshow .name").html($(this).siblings(".przname").val()), 4 == val || 5 == val) return $(".giftshow .text").hide(), 
        $("#overlay").show(), !1;
        var general = $(this).siblings(".general").text();
        if ($(".codetext .code").text(""), general) $(".generalc .code").text(general), 
        $(".generalc, #overlay").show(); else {
            var appcode = $(this).siblings(".appcode").text(), ipacode = $(this).siblings(".ipacode").text();
            $(".appc .code").text(appcode), $(".ipac .code").text(ipacode), $(".appc, .ipac, #overlay").show();
        }
    }), $(".giftshow .confirm, .giftclose").on("click", function() {
        $("#overlay").hide();
    }), $(".popup .confirm").on("click", function() {
        $("#overlay").hide(), $(".creditsleft .cred").text() > 0 && ("确定" == $(".popup-inner .confirm").text() ? $("#overlay").hide() : $(".slotbtn").trigger("click"));
    });
}), $(function() {
    $(".lot").css("minHeight", $(window).height()), $(window).resize(function() {
        $(".lot").css("minHeight", $(window).height());
    });
    var sign = !1;
    $(".giftshow .confirm, .giftclose").on("click", function() {
        $("#overlay").hide();
    }), $(".popup .confirm").on("click", function() {
        $("#overlay").hide(), $(".creditsleft .cred").text() > 0 && ("确定" == $(".popup-inner .confirm").text() ? $("#overlay").hide() : (sign = !0, 
        $(".slotbtn").trigger("click")));
    });
    var flag = !0;
    $("#slotbtn").click(function() {
        function onComplete($el, active) {
            switch ($el[0].id) {
              case "machine1":
                $("#machine1Result").text("Index: " + active.index);
                break;

              case "machine2":
                $("#machine2Result").text("Index: " + active.index);
                break;

              case "machine3":
                $("#machine3Result").text("Index: " + active.index);
            }
        }
        if (flag) {
            flag = !1;
            var responseData = {
                stat: -1,
                result: [ 1, 3, 8 ],
                prizeCode: "A003",
                prizeName: "",
                creditsleft: 180,
                timesleft: 0,
                prizeTotalCount: 3,
                tips: "很遗憾",
                creditsConsume: 20,
                creditsTips: "今天赠送的抽奖机会已用完<br>花20积分再来一次吗？"
            };
            if (!responseData.timesleft && !sign) return $(".popup .tipstxt").html(responseData.creditsTips), 
            $("#overlay").show(), flag = !0, responseData.creditsleft < responseData.creditsConsume ? ("确定" == $(".popup-inner .confirm").text() && $("#overlay").hide(), 
            $(".popup .tipstxt").html("本次抽奖需要消耗" + responseData.creditsConsume + "积分<br>快去赚积分吧~"), 
            $(".popup-inner .confirm").text("确定"), $("#overlay").show(), flag = !0, !1) : !1;
            responseData.prizeTotalCount || $(".lot-pack").html('<img class="lot-btm-img" src="images/backpack_small.png" alt="我的背包">');
            var machine1 = $("#machine1").slotMachine({
                active: 0,
                delay: 500,
                stopIndex: responseData.result[0]
            }), machine2 = $("#machine2").slotMachine({
                active: 1,
                delay: 500,
                stopIndex: responseData.result[1]
            }), machine3 = $("#machine3").slotMachine({
                active: 2,
                delay: 500,
                stopIndex: responseData.result[2]
            });
            machine1.shuffle(3, onComplete), setTimeout(function() {
                machine2.shuffle(3, onComplete);
            }, 500), setTimeout(function() {
                machine3.shuffle(3, onComplete);
            }, 1e3), $(".creditsleft .cred").html(responseData.creditsleft), $(".timesleft").html(responseData.timesleft), 
            setTimeout(function() {
                -1 == responseData.stat ? ($(".stat").hide(), $(".stat-failure").show()) : 0 == responseData.stat ? ($("#prizename").html(responseData.prizeName), 
                $(".stat").hide(), $(".stat-success").show()) : (alert(responseData.tips), $(".stat").hide(), 
                $(".stat-default").show()), flag = !0, sign = !1;
            }, 3e3);
        }
    });
}), Particle3D = function(material) {
    THREE.Particle.call(this, material), this.velocity = new THREE.Vector3(0, -8, 0), 
    this.velocity.rotateX(randomRange(-45, 45)), this.velocity.rotateY(randomRange(0, 360)), 
    this.gravity = new THREE.Vector3(0, 0, 0), this.drag = 1;
}, Particle3D.prototype = new THREE.Particle(), Particle3D.prototype.constructor = Particle3D, 
Particle3D.prototype.updatePhysics = function() {
    this.velocity.multiplyScalar(this.drag), this.velocity.addSelf(this.gravity), this.position.addSelf(this.velocity);
};

var TO_RADIANS = Math.PI / 180;

THREE.Vector3.prototype.rotateY = function(angle) {
    cosRY = Math.cos(angle * TO_RADIANS), sinRY = Math.sin(angle * TO_RADIANS);
    var tempz = this.z, tempx = this.x;
    this.x = tempx * cosRY + tempz * sinRY, this.z = tempx * -sinRY + tempz * cosRY;
}, THREE.Vector3.prototype.rotateX = function(angle) {
    cosRY = Math.cos(angle * TO_RADIANS), sinRY = Math.sin(angle * TO_RADIANS);
    var tempz = this.z, tempy = this.y;
    this.y = tempy * cosRY + tempz * sinRY, this.z = tempy * -sinRY + tempz * cosRY;
}, THREE.Vector3.prototype.rotateZ = function(angle) {
    cosRY = Math.cos(angle * TO_RADIANS), sinRY = Math.sin(angle * TO_RADIANS);
    var tempx = this.x, tempy = this.y;
    this.y = tempy * cosRY + tempx * sinRY, this.x = tempy * -sinRY + tempx * cosRY;
};

var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = parseInt(94 * window.innerWidth / 75) + 30, container, particle, camera, scene, renderer, mouseX = 0, mouseY = 0, windowHalfX = window.innerWidth / 2, windowHalfY = window.innerHeight / 2, particles = [], particleImage = new Image();

particleImage.src = "images/snow.png", $(document).ready(function() {
    particleImage.onload = function() {
        createSnow();
    };
});