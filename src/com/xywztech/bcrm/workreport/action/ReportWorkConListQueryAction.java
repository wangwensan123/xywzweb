package com.xywztech.bcrm.workreport.action;

import javax.servlet.http.HttpServletRequest;
import javax.sql.DataSource;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.StrutsStatics;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import com.opensymphony.xwork2.ActionContext;
import com.xywztech.bob.common.CommonAction;

@Action("/ReportWorkConListQueryAction")
@Results({
    @Result(name="success", type="redirectAction", params = {"actionName" , "ReportWorkConListQueryAction"})
})
public class ReportWorkConListQueryAction extends CommonAction 
{
	@Autowired
	@Qualifier("dsOracle")
	private DataSource ds;
	private HttpServletRequest request;
	
	@Override
	public void prepare() 
	{ 
		// TODO Auto-generated method stub
		ActionContext ctx = ActionContext.getContext();
		request = (HttpServletRequest)ctx.get(StrutsStatics.HTTP_REQUEST);
		String REPORT_ID = request.getParameter("REPORT_ID");
		
		StringBuilder sb = new StringBuilder("select wrw.workcon_id,wrw.report_id,wrw.work_content,wrw.comp_status from ocrm_f_wp_work_report_workcon wrw where 1=1");
		sb.append(" AND wrw.report_id = "+ REPORT_ID);
		SQL = sb.toString();
		datasource = ds;
	}
}
