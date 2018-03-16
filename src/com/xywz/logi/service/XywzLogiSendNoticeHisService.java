package com.xywz.logi.service;


import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.xywz.logi.model.XywzLogiDelvMerchd;
import com.xywz.logi.model.XywzLogiSendNotice;
import com.xywztech.bob.common.CommonService;
import com.xywztech.bob.common.JPABaseDAO;
import com.xywztech.bob.vo.AuthUser;
import com.xywztech.crm.exception.BizException;


/**
 * 银行管理Service
 * @author 
 * @since 2012-10-08 
 */
@Service
public class XywzLogiSendNoticeHisService extends CommonService {
   
	public XywzLogiSendNoticeHisService(){
		JPABaseDAO<XywzLogiSendNotice, Long>  baseDAO = new JPABaseDAO<XywzLogiSendNotice, Long>();  
		super.setBaseDAO(baseDAO);
	}
	
	@Override
	public Object save(Object model){
		XywzLogiSendNotice xywzLogiSendNotice =(XywzLogiSendNotice) model;
		AuthUser auth=(AuthUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Date date = new Date();
		DateFormat format=new SimpleDateFormat("yyyyMMddHHmmss");
		DateFormat format1=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String lastModifyTime=format1.format(date);
		String sheetAdvsNum=format.format(date);
		//if(xywzLogiSendNotice.getSendSheetAdvsId()==null){//没有则新增
		if(xywzLogiSendNotice.getSendSheetAdvsNum()==null){//没有则新增
			xywzLogiSendNotice.setMkTabPersId(auth.getUserId());  //录入人ID
			xywzLogiSendNotice.setMkTabPersNm(auth.getUsername());  //录入人名称
			xywzLogiSendNotice.setMkTabDt(new Date());   //录入日期
			xywzLogiSendNotice.setSendSheetAdvsNum(sheetAdvsNum);
			xywzLogiSendNotice.setLastModifyTime(lastModifyTime);
		}else{//更新
			xywzLogiSendNotice.setMkTabPersId(auth.getUserId()); //最后一次修改人ID
			xywzLogiSendNotice.setMkTabPersNm(auth.getUsername()); //最后一次修改人ID
			xywzLogiSendNotice.setMkTabDt(new Date());  //录入日期
			xywzLogiSendNotice.setLastModifyTime(lastModifyTime);
		}
		System.out.print(xywzLogiSendNotice.getSendSheetAdvsNum());
		return super.save(xywzLogiSendNotice);
	}
	
	public List<XywzLogiSendNotice> findAllXywzLogiNoticeInfo(Long invId){
		List<XywzLogiSendNotice> sendNotice = new ArrayList<XywzLogiSendNotice>();
		XywzLogiSendNotice xywzLogiSendNotice = new XywzLogiSendNotice();
		sendNotice.add(xywzLogiSendNotice);
		sendNotice.add(xywzLogiSendNotice);
		return sendNotice;
	}
	
	@SuppressWarnings("unchecked")
	public Map findLogiNoticeInfo(String sql,String sheetID) {
		StringBuffer sb = new StringBuffer();
		Map map = new HashMap();
		List<Object[]> list = this.baseDAO.findByNativeSQLWithIndexParam(sql);
		if(list==null||!(list.size()>0)){
			 throw new BizException(1, 0, "0001", "未查询到发运通知单信息！");
		}
		if (list != null && list.size() > 0) {
			Object[] o = list.get(0);
			

			for (int i = 0; i < o.length; i++) {
				if (o[i] == null) {
					o[i] = "";
				}
			}
			map.put("ORDR_NUM", o[0]);
			map.put("SHIP_NAME", o[1]);
			map.put("LOAD_PORT", o[2]);
			map.put("UNLOAD_PORT", o[3]);
			map.put("EXPCT_TO_PORT_DAY", o[4].toString());
			map.put("CORP_NM", o[5]);
			map.put("SHIP_AGENT_CONTCR", o[6]);
			map.put("GDS_AGENT", o[7]);
			map.put("GDS_AGENT_CONTCR", o[8]);
			map.put("MAK_DOC_PERS_NM", o[9]);
			map.put("LAST_GDS_SITU", o[10]);
			map.put("QTY_POOR", o[11]);
			map.put("WEIGHT_NGTV_POOR",o[12]);
			map.put("SEND_GOODS_NOTICE", o[13]);
			map.put("IPE_DESC", o[14]);
			map.put("UPN_DESC", o[15]);
			map.put("DELV_ADDR", o[16]);
			map.put("DELV_PERS", o[17]);
			map.put("DELV_PERS_TEL", o[18]);
			map.put("MK_TAB_PERS_NM", o[19]);
			map.put("MK_TAB_DT", o[20].toString());
		}

		String searchJQL = "select a from XywzLogiDelvMerchd a where a.sendSheetAdvsId="+sheetID;
		Map<String,Object> values = new HashMap<String,Object>();

		List<XywzLogiDelvMerchd> invList = baseDAO.findWithNameParm(searchJQL, values);
		
		map.put("saleInvInfo", invList);
		return map;
	}
}


