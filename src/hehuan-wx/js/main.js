function addEvent(elm, evType, fn, useCapture) {
	if (elm.addEventListener) {
		elm.addEventListener(evType, fn, useCapture); //DOM2.0 capture/bubble: bool, True-capture, False-bubble(IE default).
		return true;
	} else if (elm.attachEvent) {
		var r = elm.attachEvent('on' + evType, fn); //IE5-8
		return r;
	} else {
		elm['on' + evType] = fn; //DOM 0
	}
}
var siblingElem = function(elem){
	var _nodes = []
		,_elem = elem;
	;
	while ((elem = elem.previousSibling)){
		if(elem.nodeType === 1){
			_nodes.push(elem);
		}
	}
	elem = _elem;
	while ((elem = elem.nextSibling)){
		if(elem.nodeType === 1){
			_nodes.push(elem);
		}
	}
	return _nodes;
}
function toggleTab(elem, index){
	var targetObj = document.getElementById('orderTab'+(index+1));
	var elements = siblingElem(elem),
		collec = siblingElem(targetObj);
	for(var i=0, len=collec.length; i<len; i++ ){
		collec[i].style.display = 'none';
		elements[i].className = 'list-nav-item';
	}
	targetObj.style.display = 'block';
	elem.className = 'list-nav-item selected';
	
}

/*
	获取元素索引值的方法，类似于jQuery的index方法
	获取元素的在其父元素中是第几个元素节点（注意，不包括文本节点或其它节点）
*/
function getIndex(ele){
	var a=[];
	if(ele&&ele.nodeType&&ele.nodeType==1)//1.有参数传进来，2.参数必须是DOM节点，3.参数必需是DOM的元素类型的节点
	{
		var oParent=ele.parentNode;//获取这个元素的父级节点
		var oChilds=oParent.children;//找这个元素的所有的元素类型的子节点 .childNodes
		for(var i=0;i<oChilds.length;i++){
			if(oChilds[i]==ele)//如果当前的这个子节点和ele一样，则表示当前这个节和ele一样，则i既为ele的索引号
			return i;
		}
	}else 
	{
		alert('arguments error！')	
		return;
	}	
}


function triggerTabEvt(elm, eventType){
	addEvent(elm, eventType, function(e){
		var index = getIndex(elm),
			target = e.target || window.event.srcElement;
		if(target === elm || target.parentNode === elm){
			toggleTab(elm, index);
		}
	}, false);
}

function triggerDetailEvt(elm, eventType){
	(function(elm, eventType){
		addEvent(elm, eventType, function(e){
			alert(elm.innerHTML);
			// var index = getIndex(elm);
			var	target = e.target || window.event.srcElement,
				first = elm.firstChild.nodeType === 3 ? elm.firstChild.nextSibling : elm.firstChild;
			if(target === first || target.parentNode === first){
				toggleDetail(elm);
			}
		}, false);	
	})(elm, eventType);

}

function toggleDetail(elm){
	var tit =elm.firstChild.nodeType === 3 ? elm.firstChild.nextSibling : elm.firstChild,
		con = tit.nextSibling.nodeType === 3 ? tit.nextSibling.nextSibling : tit.nextSibling,
		arrow = tit.lastChild.nodeType === 3 ? tit.lastChild.previousSibling : tit.lastChild;
	alert(tit.innerHTML);
	alert(con.innerHTML);
	arrow.className = arrow.className === 'toggle' ? 'shutdown' : 'toggle';
	con.style.display = con.style.display === 'none' ? 'block' : 'none';
}


var navObj = document.getElementById('orderNav') ? document.getElementById('orderNav').getElementsByTagName('div') : '',
	detailObj = document.getElementById('detaillist') ? document.getElementById('detaillist').getElementsByTagName('li') : '',
	eventType = ('touchstart' in document.documentElement) ? 'touchstart' : 'click';
if(navObj){
	for(var i=0, len=navObj.length; i<len; i++){
		triggerTabEvt(navObj[i], eventType);
	}	
}
if(detailObj){
	for(var i=0, len=detailObj.length; i<len; i++){
		triggerDetailEvt(detailObj[i], eventType);
	}	
}
/*
if (!document.querySelectorAll) {
  document.querySelectorAll = function (selectors) {
    var style = document.createElement('style'), elements = [], element;
    document.documentElement.firstChild.appendChild(style);
    document._qsa = [];
 
    style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
    window.scrollBy(0, 0);
    style.parentNode.removeChild(style);
 
    while (document._qsa.length) {
      element = document._qsa.shift();
      element.style.removeAttribute('x-qsa');
      elements.push(element);
    }
    document._qsa = null;
    return elements;
  };
}
 
if (!document.querySelector) {
  document.querySelector = function (selectors) {
    var elements = document.querySelectorAll(selectors);
    return (elements.length) ? elements[0] : null;
  };
}
*/
//https://gist.github.com/connrs/2724353
///http://www.codecouch.com/2012/05/adding-document-queryselectorall-support-to-ie-7/
// IE7 support for querySelectorAll. Supports multiple / grouped selectors and the attribute selector with a "for" attribute. http://www.codecouch.com/
if (!document.querySelectorAll) {
    document.querySelectorAll = function(selector) {
        var doc = document,
            head = doc.documentElement.firstChild,
            styleTag = doc.createElement('STYLE');
        head.appendChild(styleTag);
        doc.__qsaels = [];
 
        styleTag.styleSheet.cssText = selector + "{x:expression(document.__qsaels.push(this))}";
        window.scrollBy(0, 0);
 
        return doc.__qsaels;
    }
}

var rows = document.querySelectorAll('.list-row');//.list-tit

for(var i=0; i<rows.length; i++){
	(function(i){
		addEvent(rows[i], 'click', function(e){
			var url = rows[i].getAttribute('data-link');
			if(url){
				window.location.href = url;
			}
		}, false);
	})(i);
}

