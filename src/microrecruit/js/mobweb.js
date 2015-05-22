$(function(){
	$(".closeAlert").bind("click", closeAlert);
	$("#mWinAlertOK").bind("click", closeAlert);
    $(".sel_btn").bind("click", doLocation);
});


/**
 * 去2边的空字符串
 * @param inStr
 * @returns
 */
function trimStr(inStr){
	return $.trim(inStr);
}

/**
 * 显示“loading”窗口
 */
function showLoading() {
    $(".mWin").hide();
    $("#mloading").show();
}

var _t_load ;

/**
 * 关闭"loading"窗口
 */
function closeLoading() {
    clearTimeout(_t_load);
    //停止地址的变化
    document.execCommand('stop');
    $("#mloading").hide();
}

/**
 * 重写alert方法
 */
var old_alert = alert;

alert = function (msg){
	//console.log(msg);
    var msg2 = msg ;
    if(msg && msg.replace){
        msg2 = msg.replace("\r\n", "<br/>").replace("\n", "<br/>");
        $("#mAlertMsg").html(msg2);
        $("#mWinAlert").show();
    }else{
    	old_alert(msg);	
    }
}

showAlgMsg = function (msg){
    // $(".mWin").hide();
    var msg2 = msg ;
    if(msg && msg.replace){
        msg2 = msg.replace("\r\n", "<br/>").replace("\n", "<br/>");
        $("#mAlertMsg").html(msg2);
        $("#mWinAlert").show();
    }else{
    	old_alert(msg);	
    }
}

//jquery 淡入淡出
function alertToggle(content,timeShow){
	if(content==null || !content.replace || fTrim(content)==''){
		console.log('淡入淡出的输入信息有误！');
		return;
	}
	$("#mAlertMsg").html(fTrim(content));
	
	 if(timeShow==null || timeShow==undefined || timeShow==''){
		 //默认淡出淡入1s
		 timeShow=1000;
	 }
	 $("#mWinAlert").fadeToggle(timeShow,function(timeShow){
			$(this).fadeToggle(timeShow);
		});
}

function fTrim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 * 关闭窗口
 */
function closeAlert(){
	 //_this = $(this);
	 //_this.parentsUntil(".mWinAlert").parent().hide();
	$("#mWinAlert").hide();
}

function hiddenSelectDiv(){
	$("#selectDiv").css("display","none");
}



function chooseInput(_this) {

    var inputCss = $(_this).attr('class');
    if (inputCss == 'icon_chosen') {
        $(_this).attr('class', 'icon_chooseNormal');
    } else {
        $(_this).attr('class', 'icon_chosen');
    }
}

function toDetailPostUrl(postId, recruitType) {
    //判断该职位是不是已投递
    var postCanApply = $("#canApply_" + postId).val() - 0;
    if (postCanApply != 1) {
        postCanApply = 0;
    }
    var toDetailUrl = 'detail.htm?brandCode=1&safe=Y&canBack=true&recruitType=' + recruitType + '&postIdsAry=' + postId + '&postCanApply=' + postCanApply + '';
    window.location.href = toDetailUrl;

}

function searchSelect() {
    var action = 'list.htm?brandCode=1';
    $("#searchForm").attr("action", action);
    $("#searchForm").submit();
}


function doBatchFavorate() {
    var webUserIdToken = $("#webUserIdToken").val();
    webUserIdToken = $.trim(webUserIdToken)
    if (webUserIdToken == '') {
        alert('没有登录,请登录后再收藏!');
        return;
    }

    var postIdsAry = getSelectedPostIds();

    if (postIdsAry == null || postIdsAry.length == 0) {
        return;
    }
    //alert(postIdsAry);
    //ajax收藏职位    userIdToken
    var ajaxUrl = '/wt/kunlun/mobweb/position/ajaxDoFavorate?brandCode=1&recruitType=2';
    $.ajax({

        //请求的路径
        url: ajaxUrl,
        //这是参数
        data: {
            postIdsAry: postIdsAry,
            webUserIdToken: webUserIdToken
        },
        //是否异步
        async: false,
        //请求的方法
        type: "post",
        timeout: 3000,
        //请求成功时调用
        success: function (msg) {
            //alert(msg);
            if (msg == 'ok') {
                alert('收藏成功!');
            } else if (msg == 'notLogin') {
                alert('未登录!');
            } else {
                alert('收藏失败!');
            }

        },
        //请求失败时调用
        error: function () {
            alert("网络可能有问题,不能联网!");
        }

    });
}

//进行批量应聘
function doBatchApply() {
    var webUserIdToken = $("#webUserIdToken").val();
    webUserIdToken = $.trim(webUserIdToken)
    if (webUserIdToken == '') {
        alert('没有登录,请登录后再投递简历!');
        return;
    }
    var postIdsAry = getSelectedPostIds();
    if (postIdsAry == null || postIdsAry.length == 0) {
        return;
    }
    //alert(postIdsAry);mobweb/security/applyFlow/listApplyResume
    var toChooseResumeUrl = '/wt/kunlun/mobweb/security/applyFlow/listApplyResume?brandCode=1&recruitType=2&urlCorpEdition=null&operational=F7CEA15A053298196834A7D138F9677C0CED1A8AB79F27D12C9B9ACEE8D041B988E9E352FCAF6150499EA1B7E062FFD33D3ED77F1D4CFBC8FCFD419E12D1B1A93C32F7302C31290C1387C981A2586A952C3E2D5CED82B05FAEC1D50122B44D17EE9EDADF1FA34B6ECE9DD18FFC69862F7D43DA9C13D817B26463C3E7F605795A&fromBatchPost=true&postIdsAry=' + postIdsAry;
    window.location.href = toChooseResumeUrl;

}

//获得选中的职位所有的id
function getSelectedPostIds() {
    var objs = $(".icon_chosen");
    if (objs == null || objs.length == 0) {
        //'请选中至少一项!
        alert('请至少选择一项！');
        return "";
    }
    var retPostIdsAry = '';
    objs.each(function (i) {
        retPostIdsAry += $(this).attr('data-val') + ',';
    });
    retPostIdsAry = retPostIdsAry.substring(0, retPostIdsAry.length - 1)
    return retPostIdsAry;
}




// 详情页
function goBackUrl() {
    window.history.back(-1);
}

function deleteFavorate() {
    var webUserIdToken = $("#webUserIdToken").val();
    webUserIdToken = $.trim(webUserIdToken)
    if (webUserIdToken == '') {
        alert('没有登录,请登录后再收藏!');
        return;
    }
    //ajax 取消收藏职位    
    var ajaxUrl = '/wt/kunlun/mobweb/position/ajaxDeleteFavorate?brandCode=1&recruitType=2&postIdsAry=1794416864';
    $.ajax({
        //请求的路径
        url: ajaxUrl,
        //这是参数
        data: {
            webUserIdToken: webUserIdToken
        },
        //是否异步
        async: false,
        //请求的方法
        type: "post",
        timeout: 10000,
        //请求成功时调用
        success: function (msg) {
            //alert(msg);
            if (msg == 'ok') {
                alert('取消收藏成功!');
                $("#deleteFavorate").css("display", "none");
                $("#doFavorate").css("display", "block");
            } else if (msg == 'notLogin') {
                alert('未登录!');
            } else {
                alert('收藏失败!');
            }
        },
        //请求失败时调用
        error: function () {
            alert("网络可能有问题,不能联网!");
        }
    });
}

function doFavorate() {
    var webUserIdToken = $("#webUserIdToken").val();
    webUserIdToken = $.trim(webUserIdToken)
    if (webUserIdToken == '') {
        alert('没有登录,请登录后再收藏!');
        return;
    }

    //alert(postIdsAry);
    //ajax收藏职位    userIdToken
    var ajaxUrl = '/wt/kunlun/mobweb/position/ajaxDoFavorate?brandCode=1&recruitType=2&postIdsAry=1794416864';
    $.ajax({
        //请求的路径
        url: ajaxUrl,
        //这是参数
        data: {
            webUserIdToken: webUserIdToken
        },
        //是否异步
        async: false,
        //请求的方法
        type: "post",
        timeout: 10000,
        //请求成功时调用
        success: function (msg) {
            //alert(msg);
            if (msg == 'ok') {
                alert('收藏成功!');
                $("#deleteFavorate").css("display", "block");
                $("#doFavorate").css("display", "none");
            } else if (msg == 'notLogin') {
                alert('未登录!');
            } else {
                alert('收藏失败!');
            }
        },
        //请求失败时调用
        error: function () {
            alert("网络可能有问题,不能联网!");
        }
    });
}

function applyPosition() {
    var toResumesUrl = '/wt/kunlun/mobweb/security/applyFlow/listApplyResume?brandCode=1&recruitType=2&currentPostType=2&postIdsAry=1794416864&postCanApply=0&urlCorpEdition=null&operational=DB5D5ED86B3FC6051015FB94549566D0E10C950E2226A4ACC538F82F0B142AC527164A292754C37C81AA06C58DEC9D78E9A667A1E0B9242D0556C90FCA8C0E20196DC95BFA80B851D7D01497853229E6A20E10E12B66A3299859D449EEB5495251A4903AC7BC00701150C2C34CE930DE5BBB34E299F584CA4FF1CB921B1EC2EF4AD5865B2244C478E038AEFFA5DAA142168B20B4C9E79F8BF59B60230D7D2D5F99EDA22488299ABDD770E9FDD6CF70A7';
    window.location.href = toResumesUrl;
}

function doLocation(){
    var val = $("input[name=apply_type]:checked").val();
    window.location.href = val + ".htm";
}