<%@page contentType="text/html; charset=gb2312" %>
<%@ page import="java.util.*" %>
<html>
<head>
<title>eChain流程管理</title>
<link href="<%=request.getContextPath()%>/echain/common/default.css" rel="stylesheet" type="text/css" />
<script type="text/javascript">
//提交
function doSubmit(){
	var orgid = document.getElementById("orgid").value;
	var appid = document.getElementById("appid").value;
	var wfsign = document.getElementById("wfsign").value;
	if(orgid==null||orgid==""||appid==null||appid==""||wfsign==null||wfsign==""){
		alert("请输入完整信息");
		return;
	}
	document.forms[0].submit();
}
//选择机构
function selOrg(){
	var contextPath="<%=request.getContextPath()%>";
	//打开选择处理人的界面
	var url = contextPath+"/echain/common/selectOrg.jsp?&count=1";
	var retObj = window.showModalDialog(url,'selectPage','dialogHeight:500px;dialogWidth:350px;help:no;resizable:no;status:no;');
		
	//返回数组:[状态:true/false;意见;下一节点;下一处理人];若没有返回值,或返回状态不为true,则表示取消
	if(retObj == null)
		return;
	var status = retObj[0];
	if(status != true)
		return;
	if(retObj[1] != null)
		document.getElementById("orgid").value = retObj[1];		
	if(retObj[2] != null)
		document.getElementById("orgname").value = retObj[2];	
}
//选择流程
function selWF(){
	var contextPath="<%=request.getContextPath()%>";
	//打开选择处理人的界面
	var url = contextPath+"/echain/common/selectWF.jsp?&count=1";
	var retObj = window.showModalDialog(url,'selectPage','dialogHeight:500px;dialogWidth:350px;help:no;resizable:no;status:no;');
		
	//返回数组:[状态:true/false;意见;下一节点;下一处理人];若没有返回值,或返回状态不为true,则表示取消
	if(retObj == null)
		return;
	var status = retObj[0];
	if(status != true)
		return;
	if(retObj[1] != null)
		document.getElementById("wfsign").value = retObj[1];
	if(retObj[2] != null)
		document.getElementById("wfname").value = retObj[2];
		
}
//选择业务品种
function selApp(){
	var contextPath="<%=request.getContextPath()%>";
	//打开选择处理人的界面
	var url = contextPath+"/echain/common/selectApp.jsp?&count=1";
	var retObj = window.showModalDialog(url,'selectPage','dialogHeight:500px;dialogWidth:350px;help:no;resizable:no;status:no;');
		
	//返回数组:[状态:true/false;意见;下一节点;下一处理人];若没有返回值,或返回状态不为true,则表示取消
	if(retObj == null)
		return;
	var status = retObj[0];
	if(status != true)
		return;
	if(retObj[1] != null)
		document.getElementById("appid").value = retObj[1];
	if(retObj[2] != null)
		document.getElementById("appname").value = retObj[2];
		
}
</script>
</head>
<body>
<form action="<%=request.getContextPath()%>/echaincommonservlet">
<input type="hidden" name="method" value="echainflowmanage">
<input type="hidden" name="actionType" value="orgWFLink">
<input type="hidden" name="subType" value="add">
<input type="hidden" id="orgid" name="orgid">
<input type="hidden" id="appid" name="appid">
<input type="hidden" id="wfsign" name="wfsign">
<fieldset style="background-color:#fafafa;"><legend>机构流程关连</legend>
<br>
<table width="80%">
<tr><td width="40%" align="right">所属机构</td>
<td><input type="text" id="orgname" name="orgname" value="" readonly="true" size="30">&nbsp;<a href=# onclick="selOrg()">选择</a></td></tr>
<tr><td width="40%" align="right">业务品种</td>
<td><input type="text" id="appname" name="appname" value="" readonly="true" size="30">&nbsp;<a href=# onclick="selApp()">选择</a></td></tr>
<tr><td width="40%" align="right">子类扩展1</td>
<td><input type="text" id="subtype1" name="subtype1" value="" size="30"></td></tr>
<tr><td width="40%" align="right">子类扩展2</td>
<td><input type="text" id="subtype2" name="subtype2" value="" size="30"></td></tr>
<tr><td width="40%" align="right">子类扩展3</td>
<td><input type="text" id="subtype3" name="subtype3" value="" size="30"></td></tr>
<tr><td width="40%" align="right">所属流程</td>
<td><input type="text" id="wfname" name="wfname" value="" readonly="true" size="30">&nbsp;<a href=# onclick="selWF()">选择</a></td></tr>
</table>
<br>
</fieldset>
<br>
<div align="center">	
<input type="button" class="button" value="&nbsp;提&nbsp;交&nbsp;" onclick="doSubmit()">	
<input type="reset" class="button" value="&nbsp;重&nbsp;置&nbsp;">	
</div>	  
</form>
</body></html>
