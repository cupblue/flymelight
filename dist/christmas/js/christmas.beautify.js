"use strict";

jQuery(function() {
    $(".pack").css("minHeight", $(window).height()), $(".giftevent .view").on("click", function() {
        var val = $(this).attr("data-val");
        if ($(".codetext").hide(), $(".prz-ico").attr("class", "prz-ico").addClass("prz-gift" + val), 
        $(".giftshow .name").html($(this).siblings(".przname").val()), 4 === val || 5 === val) return $(".giftshow .text").hide(), 
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
        $("#overlay").hide(), $(".creditsleft .cred").text() > 0 && ("确定" === $(".popup-inner .confirm").text() ? $("#overlay").hide() : $(".slotbtn").trigger("click"));
    });
}), jQuery(function() {
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
    $(".lot").css("minHeight", $(window).height()), $(window).resize(function() {
        $(".lot").css("minHeight", $(window).height());
    });
    var sign = !1;
    $(".giftshow .confirm, .giftclose").on("click", function() {
        $("#overlay").hide();
    }), $(".popup .confirm").on("click", function() {
        $("#overlay").hide(), $(".creditsleft .cred").text() > 0 && ("确定" === $(".popup-inner .confirm").text() ? $("#overlay").hide() : (sign = !0, 
        $(".slotbtn").trigger("click")));
    });
    var flag = !0;
    $("#slotbtn").click(function() {
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
            $("#overlay").show(), flag = !0, responseData.creditsleft < responseData.creditsConsume ? ("确定" === $(".popup-inner .confirm").text() && $("#overlay").hide(), 
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
                -1 === responseData.stat ? ($(".stat").hide(), $(".stat-failure").show()) : 0 === responseData.stat ? ($("#prizename").html(responseData.prizeName), 
                $(".stat").hide(), $(".stat-success").show()) : (alert(responseData.tips), $(".stat").hide(), 
                $(".stat-default").show()), flag = !0, sign = !1;
            }, 3e3);
        }
    });
});