package com.xywz.asst.action;

import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.apache.struts2.ServletActionContext;
import org.apache.struts2.StrutsStatics;
import org.apache.struts2.convention.annotation.Action;
import org.springframework.beans.factory.annotation.Autowired;
import com.opensymphony.xwork2.ActionContext;
import com.xywz.asst.model.XywzAsstMachgContractMgmt;
import com.xywz.asst.service.XywzAsstMachgContractMgmtService;
import com.xywztech.bob.common.CommonAction;



/*
 * 外协加工合同信息Action
 * @author 
 * @since 
 */

@SuppressWarnings("serial")
@Action("/XywzAsstMachgContractMgmtAction")
public class XywzAsstMachgContractMgmtAction extends CommonAction {
	
	@Autowired
	private XywzAsstMachgContractMgmtService service;//定义XywzAsstMachgContractMgmt属性
	

	
	@Autowired
	public void init() {
		model = new XywzAsstMachgContractMgmt();
		setCommonService(service);

	}

    @Override
	public String batchDestroy(){
	   	ActionContext ctx = ActionContext.getContext();
        request = (HttpServletRequest)ctx.get(StrutsStatics.HTTP_REQUEST);
		String idStr = request.getParameter("idStr");
		String jql="DELETE FROM XywzAsstMachgContractMgmt C WHERE C.asstContrId IN ("+idStr+")";
		Map<String,Object> values=new HashMap<String,Object>();
		service.batchUpdateByName(jql, values);
		addActionMessage("batch removed successfully");
		
        return "success";
    }
}



