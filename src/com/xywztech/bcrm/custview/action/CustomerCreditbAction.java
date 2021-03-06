package com.xywztech.bcrm.custview.action;

import javax.sql.DataSource;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import com.xywztech.bob.action.BaseQueryAction;
/*
 * 
 * 
 *    mahcao  客户搜索
 * 
 */
@ParentPackage("json-default")
@Action(value="/customerCreditb", results={
    @Result(name="success", type="json"),
})
public class CustomerCreditbAction extends BaseQueryAction{
	@Autowired
	@Qualifier("dsOracle")	
	private DataSource dsOracle;   
 	@Override
	public void prepare() {
 		
		// TODO Auto-generated method stub
 		String s=this.getJson().get("custId").toString();
// 		AcrmFCiPerCustInfo asd=new AcrmFCiPerCustInfo();
//      AuthUser auth=(AuthUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();        
//      Long managerId = auth.getXtStaffId();
      
    	StringBuilder sb=new StringBuilder("select c.* from ACRM_F_CI_PRO_CE_STAN_BOOK c where 1>0 ");
    	
        sb.append(" and c.CUST_ID = '"+s+"'");
        addOracleLookup("LIMIT_STAT", "CDE0100009");
    	addOracleLookup("CE_STAN_BOOK_TYPE", "CDE0100029");
        setPrimaryKey("c.CUST_ID");
		SQL = sb.toString();
		datasource = dsOracle;
	}
}
