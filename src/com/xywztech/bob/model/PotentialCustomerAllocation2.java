package com.xywztech.bob.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

/**
 * 潜在客户表
 */
@Entity
@Table(name = "OCRM_F_CI_RELATION_USERS")

public class PotentialCustomerAllocation2 implements Serializable {
    private static final long serialVersionUID = -3802673719403650829L;

    @Id
    @GeneratedValue(generator = "CommonSequnce", strategy = GenerationType.SEQUENCE)
    @Column(name = "id")
    private Long id;
    /** 潜在客户ID */
    @Column(name = "BID", length = 20)
    private String BID;

	/** 被分配客户经理id */
    @Column(name = "USER_ID", length = 20)
    private String USER_ID;
    /** 被分配机构id */
    @Column(name = "UNIT_ID", length = 20)
    private String UNIT_ID;

    /** 创建人 */
    @Column(name = "CREATE_NAME", length = 20)
    private String CREATE_NAME ;

    /** 创建日期*/
	@Temporal(TemporalType.DATE)
    @Column(name = "CREATE_DATE")
    private Date CREATE_DATE ;
    
  
	public String getUNIT_ID() {
		return UNIT_ID;
	}


	public void setUNIT_ID(String uNIT_ID) {
		UNIT_ID = uNIT_ID;
	}


	public Long getId() {
		return id;
	}


	public void setId(Long id) {
		this.id = id;
	}


	public String getBID() {
		return BID;
	}


	public void setBID(String bID) {
		BID = bID;
	}


	public String getUSER_ID() {
		return USER_ID;
	}


	public void setUSER_ID(String uSER_ID) {
		USER_ID = uSER_ID;
	}


	public String getCREATE_NAME() {
		return CREATE_NAME;
	}


	public void setCREATE_NAME(String cREATE_NAME) {
		CREATE_NAME = cREATE_NAME;
	}


	public Date getCREATE_DATE() {
		return CREATE_DATE;
	}


	public void setCREATE_DATE(Date cREATE_DATE) {
		CREATE_DATE = cREATE_DATE;
	}


	public static long getSerialversionuid() {
        return serialVersionUID;
    }

}
