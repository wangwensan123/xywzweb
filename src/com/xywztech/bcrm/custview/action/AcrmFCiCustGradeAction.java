package com.xywztech.bcrm.custview.action;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.StrutsStatics;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.rest.HttpHeaders;
import org.springframework.beans.factory.annotation.Autowired;

import com.opensymphony.xwork2.ActionContext;
import com.xywztech.bcrm.custview.model.AcrmFCiCustGrade;
import com.xywztech.bcrm.custview.service.AcrmFCiCustGradeService;
import com.xywztech.bob.common.CommonAction;

/**
 * 
 * @author huwei
 * 客户评级信息
 * 
 *
 */
@SuppressWarnings("serial")
@Action("/acrmFCiCustGrade-info")
public class AcrmFCiCustGradeAction  extends CommonAction{
	
	@Autowired
	private  AcrmFCiCustGradeService service;

	@Autowired
	public void init() {
		model = new AcrmFCiCustGrade();
		setCommonService(service);
	}
	
	public HttpHeaders indexPage() throws Exception {
		try {
			StringBuilder sb = new StringBuilder("select c from AcrmFCiCustGrade c where 1=1 ");
			Map<String, Object> values = new HashMap<String, Object>();
			ActionContext ctx = ActionContext.getContext();
			request = (HttpServletRequest) ctx
					.get(StrutsStatics.HTTP_REQUEST);
			// if(request.getParameter("start")!=null)
			// start = new Integer(request.getParameter("start")).intValue();
			// if(request.getParameter("limit")!=null)
			// limit = new Integer(request.getParameter("limit")).intValue();
			this.setJson(request.getParameter("condition"));
			// 获取客户号
			if (request.getParameter("cust_id") != null) {
				sb.append(" and c.custId = '" + request.getParameter("cust_id")+"'");
			}
			for (String key : this.getJson().keySet()) {
				if (null != this.getJson().get(key)
						&& !this.getJson().get(key).equals("")) {
					sb.append(" and c." + key + " = :" + key);
					values.put(key, this.getJson().get(key));
				}
			}
			return super.indexPageByJql(sb.toString(), values);
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
	}
}
