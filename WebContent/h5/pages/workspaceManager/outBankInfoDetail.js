/***
 * 功能描述：行外资讯
 *  作者 ：lan
 *  时间 ：2015-03-03
 *  版本 ：v1.0.0
 */
var start = 1,limit = 9,
	generatedCount = 0;

function loadData(searchUrl) {
//loadStart('数据正在初始化...','b',false);
	$.ajax({
		type : "GET",
		url : searchUrl,
		cache: false, 
		dataType: 'json',
		async: false, 
		success : function(response){
			var aResult = response.data[0];
			var el = document.getElementById('botm');
			var li  = '<div class="btmContent" id="btmContent">'
							+'<div class="fmList fmlTitle">'+aResult.MESSAGE_TITLE+'</div>'
							+'<div class="fmList fmRemark"><span>发布时间：'+aResult.PUBLISH_DATE1+'</span><span>发布人：'+aResult.USERNAME+'</span></div>'
							+'<div class="fmList fmContent">'
							+'<p>'+aResult.MESSAGE_INTRODUCE+'</p>'
							+'</div>'
						+'</div>'
						;
		   $("#botm").append($(li));
		   
		},
		error:function(){
			//loadStop();
			//alert('数据初始化失败!!!!');
		}
	});

}

