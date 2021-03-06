package com.xywztech.bcrm.sales.service;

import java.util.Date;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.xywztech.bcrm.sales.model.OcrmFMmTask;
import com.xywztech.bob.common.CommonService;
import com.xywztech.bob.common.JPABaseDAO;
import com.xywztech.bob.vo.AuthUser;

@Service
@Transactional(value="postgreTransactionManager")
public class MarketAssuDetailInfoService extends CommonService{

	   public MarketAssuDetailInfoService(){
		   JPABaseDAO<OcrmFMmTask, Long>  baseDAO=new JPABaseDAO<OcrmFMmTask, Long>(OcrmFMmTask.class);  
		   super.setBaseDAO(baseDAO);
	   }	
	   
		 //根据ID是否为空进行新增或者修改并更新最近更新人，最近更新日期和最近更新机构等信息项
		@Override
		@SuppressWarnings("unchecked")
		public Object save(Object obj) {
			OcrmFMmTask ocrmFMmTask = (OcrmFMmTask) obj;
			AuthUser auth=(AuthUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
	        if (ocrmFMmTask.getTaskId() == null) {
	        	ocrmFMmTask.setCreateDate(new Date());
	        	ocrmFMmTask.setCreateOrgId(auth.getUnitId());
	        	ocrmFMmTask.setCreateOrgName(auth.getUnitName());
	        	ocrmFMmTask.setCreateUser(auth.getUserId());
	        	ocrmFMmTask.setCreateUserName(auth.getUsername());
	        	ocrmFMmTask.setRecentlyUpdateDate(new Date());
	        	ocrmFMmTask.setRecentlyUpdateId(auth.getUserId());
	        	ocrmFMmTask.setRecentlyUpdateName(auth.getUsername());
	        	ocrmFMmTask.setTaskStat("1");
				return baseDAO.save(ocrmFMmTask);
	        } else {
	        	ocrmFMmTask.setRecentlyUpdateDate(new Date());
	        	ocrmFMmTask.setRecentlyUpdateId(auth.getUserId());
	        	ocrmFMmTask.setRecentlyUpdateName(auth.getUsername());
	            //更新
	           return baseDAO.save(ocrmFMmTask);
	        }
		
		}

		public Object saveData(Object obj) {
			return baseDAO.save(obj);
		}
}
