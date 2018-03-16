<%@page language="java" contentType="text/html; charset=utf-8"%>
<%@ page import="java.lang.*"%>
<%@ page import="java.util.*"%>
<%@ page import="com.ecc.echain.workflow.engine.*" %>
<%
String orgid=(String)request.getSession().getAttribute("s_orgid");
if(orgid==null||orgid.equals("")||orgid.equals("null"))
	orgid="default";

CIBWorkFlowClient wfc = CIBWorkFlowClient.getInstance();
String instanceid = request.getParameter("instanceid");
String nodeid = request.getParameter("nodeid");
String currentuserid=request.getParameter("userid");
if(currentuserid==null||currentuserid.length()==0)
	currentuserid=(String)request.getSession().getAttribute("s_userid");	
EVO evo=new EVO();
evo.setOrgid(orgid);
evo.setInstanceID(instanceid);
evo.setNodeID(nodeid);
evo.setCurrentUserID(currentuserid);
String[] html=wfc.getNodeChangeHTML(evo);
String roleHTML = html[0];
String userHTML = html[1];
%>

<%@page import="com.ecc.echain.ebank.cib.CIBWorkFlowClient"%><HTML>
<HEAD>
<TITLE>下一办理人选择</TITLE>
<META http-equiv="Content-Type" content="text/html; charset=utf-8" />
<script type="text/javascript">
	function retSuc(){
		var retObj = [];
		retObj[0] = true;
		var user = document.getElementById("seluser").value;
		if(user==null||user==""){
			list = document.getElementsByName("userid");
			for(var i=0;i<list.length;i++){
				if(!list[i].checked)
					continue;
				if(user == null)
					user = list[i].value;
				else
					user = user + ";" + list[i].value;
			}
		}		
		retObj[1] = user;
		window.returnValue = retObj;
		window.close();
	};
	
	function retFail(){
		var retObj = [];
		retObj[0] = false;
		window.returnValue = retObj;
		window.close();
	};

	//点击角色出人员
	function showRoleDiv(){
		var nodeid = "<%=nodeid%>";
		var roleList = document.getElementsByName(nodeid+"roleid");
		for(var j=0;j<roleList.length;j++){
			var divid = nodeid+roleList[j].value + "RoleDiv";
			var divObj = document.getElementById(divid);
			if(divObj == null)
				continue;
			if(roleList[j].checked)
				divObj.style.display = "block";
			else
				divObj.style.display = "none";
		}
	}
	
	//选择用户
	function selUser(count){
		var contextPath="<%=request.getContextPath()%>";
		//打开选择处理人的界面
		var url = contextPath+"/echain/common/selectUser.jsp?&count="+count;
		var retObj = window.showModalDialog(url,'selectPage','dialogHeight:420px;dialogWidth:610px;help:no;resizable:no;status:no;');
			
		//返回数组:[状态:true/false;意见;下一节点;下一处理人];若没有返回值,或返回状态不为true,则表示取消
		if(retObj == null)
			return;
		var status = retObj[0];
		if(status != true)
			return;
		if(retObj[1] != null){
			if(retObj[1].indexOf(";")!=-1){//返回多值
				var list=retObj[1].split(";");
				var seluser="";
				for(var i=0;i<list.length;i++){
					if(i>0)
						seluser+=";U."+list[i];
					else
						seluser+="U."+list[i];
				}
				document.getElementById("seluser").value =seluser;
			}else{
				document.getElementById("seluser").value = "U."+retObj[1];
			}
		}
		if(retObj[2] != null){
			document.getElementById("userid").value = retObj[2];		
		}
	}
</script>

<style type="text/css">
A{font-size:9pt}
BODY{font-size:9pt}
.selectNextNodeStyle {
	margin: 20px;
}
.button
{
	BORDER-RIGHT:#A7A6AA 1px solid; 
	PADDING-RIGHT:1px;
	BORDER-TOP:#A7A6AA 1px solid;
	PADDING-LEFT:2px;
	FONT-SIZE:12px;
	FILTER:progid:DXImageTransform.Microsoft.Gradient(GradientType=0,StartColorStr=#ffffff, EndColorStr=#F0F0F0);
	BORDER-LEFT: #A7A6AA 1px solid; 
	CURSOR:hand;
	COLOR:#4B4B4B;
	PADDING-TOP:2px; 
    BORDER-BOTTOM: #A7A6AA 1px solid; 
	background:background-attachment
}
.tdtitle{
	font-weight:700;
	font-size: 9pt;
    color: #000000;
    padding: 5px 5px 5px 5px;
	background-color:#e3e4e3;    
    height: 20px;
	BORDER: #B7BAC1 0pt solid;
}
.td{
	font-size: 9pt;
    color: #000000;
    padding: 5px 5px 5px 5px;
	background-color:#FFFFFF;    
    height: 20px;
	BORDER: #B7BAC1 0pt solid;
}
</style>

</HEAD>
<BODY>
<input type="hidden" id="seluser" value=""/>
<div class="selectNextNodeStyle">
<table border="0" width="500px" cellspacing="1" cellpadding="0" bgcolor="000000">
	<tr>
		<td width="50%" class="tdtitle">请选择角色</td>
		<td width="50%" class="tdtitle">请选择办理人员</td>
	</tr>
	<tr>
		<td class="td"><%=roleHTML %></td>
		<td class="td"><%=userHTML %></td>
	</tr>
</table>
<br></div>
<center>
<input type="button" class="button" value="&nbsp;&nbsp;确&nbsp;&nbsp;&nbsp;&nbsp;定&nbsp;&nbsp;" onclick="retSuc()">&nbsp;&nbsp;
<input type="button" class="button" value="&nbsp;&nbsp;取&nbsp;&nbsp;&nbsp;&nbsp;消&nbsp;&nbsp;" onclick="retFail()"></center>
</BODY>
</HTML>
