Ext.ns('Com.xywz.common');
/**
 * 客户选择放大镜
 * @author ZM
 * @since 2012-11-08
 */
 Com.xywz.common.UserQuery = Ext.extend(Ext.form.TwinTriggerField, {
    initComponent : function(){
        Ext.ux.form.SearchField.superclass.initComponent.call(this);
        this.on('specialkey', function(f, e){
            if(e.getKey() == e.ENTER){
                this.onTrigger2Click();
            }
        }, this);
    },
    onRender : function(ct, position){
    	Com.xywz.common.UserQuery.superclass.onRender.call(this, ct, position);
		if(this.hiddenName){
			var ownerForm = this;
			while(ownerForm.ownerCt && !Ext.instanceOf(ownerForm.ownerCt,'form')){				//根据条件查询放大镜控件的最外层容器
				ownerForm = ownerForm.ownerCt;
			};
			if(Ext.instanceOf(ownerForm.ownerCt,'form')){										//判断父容器是否为form类型
				ownerForm = ownerForm.ownerCt;
				if(ownerForm.getForm().findField(this.hiddenName)){								//如果已经创建隐藏域
					this.hiddenField = ownerForm.getForm().findField(this.hiddenName);
				}else {		//如果未创建隐藏域，则根据hiddenName属性创建隐藏域
					
					this.hiddenField = ownerForm.add({
						
						xtype : 'hidden',
						id:this.hiddenName,
						name: this.hiddenName
					});
				}
			}
		}
	},
	autoLoadFlag: false,
    singleSelected:false,//记录标志 true单选,false多选
    callback:false,
    bizMem:'',
    userName:'',
//    custtype :'',//客户类型：  1：对私, 2:对公
//    custStat:'',//客户状态: 1:正式 2：潜在
//    certType:'',//证件类型
//    certNum:'',//证件号码
//    mobileNum:'',//联系电话
//    mgrId:'',//主办客户经理ID
//    mgrName:'',//主办客户经理姓名
//    instCode:'',//主办机构代码
//    instName:'',//主办机构名称
//    linkUser:'',//客户联系人,wzy,add,20130227
    validationEvent:false,
    validateOnBlur:false,
    trigger1Class:'x-form-clear-trigger',
    trigger2Class:'x-form-search-trigger',
    hideTrigger1:true,
    width:180,
    hasSearch : false,
    paramName : 'query',
    hiddenName:false, //用于存隐藏ID字段
    oCustomerQueryWindow : false,

    onTrigger2Click : function(){
    	var _this=this;
    	if(_this.oCustomerQueryWindow){
    		_this.oCustomerQueryWindow.show();
    		return;
    	}
    	if(this.disabled){
    		return;
    	}
    	var oThisSearchField=_this;
    	
    	_this.boxstore = new Ext.data.Store({  
    		restful:true,   
    		autoLoad :true,
    		proxy : new Ext.data.HttpProxy({
    				url :basepath+'/lookup.json?name=XYWZ_CUST_TYPE'
    		}),
    		reader : new Ext.data.JsonReader({
    			root : 'JSON'
    		}, [ 'key', 'value' ])
    	});
    	_this.boxstore8 = new Ext.data.Store({  
    		sortInfo: {
	    	    field: 'key',
	    	    direction: 'ASC' // or 'DESC' (case sensitive for local sorting)
	    	},
    		restful:true,   
    		autoLoad :true,
    		proxy : new Ext.data.HttpProxy({
    				url :basepath+'/lookup.json?name=XYWZ_CUST_GRADE_LVL'
    		}),
    		reader : new Ext.data.JsonReader({
    			root : 'JSON'
    		}, [ 'key', 'value' ])
    	});
    	//客户状态
    	_this.boxstore9 = new Ext.data.Store({  
    		sortInfo: {
	    	    field: 'key',
	    	    direction: 'ASC' // or 'DESC' (case sensitive for local sorting)
	    	},
    		restful:true,   
    		autoLoad :true,
    		proxy : new Ext.data.HttpProxy({
    				url :basepath+'/lookup.json?name=XYWZ_BIZ_CATE'
    		}),
    		reader : new Ext.data.JsonReader({
    			root : 'JSON'
    		}, [ 'key', 'value' ])
    	});
  	
    	_this.oCustomerQueryForm = new Ext.form.FormPanel({
			frame : true, //是否渲染表单面板背景色
			labelAlign : 'middle', // 标签对齐方式
			buttonAlign : 'center',
			region:'north',
			height : 97,
			width : 1000,
			items : [{
				layout : 'column',
				border : false,
				items : [{
					columnWidth : .25,
					layout : 'form',
					labelWidth: 100, // 标签宽度
					defaultType : 'textfield',
					border : false,
					items : [{
						fieldLabel : '用户名称',
						name : 'userName',
						xtype : 'textfield', // 设置为数字输入框类型
						labelStyle: 'text-align:right;',
						anchor : '90%'
					}]
				}]
			}],
			
			buttons : [{
				text : '查询',
				handler : function() {
					_this.oCustomerQueryStore.on('beforeload', function() {
						var conditionStr =  _this.oCustomerQueryForm.getForm().getValues(false);
						this.baseParams = {
								"condition":Ext.encode(conditionStr)
						};
					});
					_this.oCustomerQueryStore.reload({
						params : {
//							start : 0,
//							limit : _this.oCustomerQueryBbar.pageSize
						}
					});
				}
			},{
				text : '重置',
				handler : function() {
					_this.oCustomerQueryForm.getForm().reset();  
//					_this.oCustomerQueryForm.getForm().findField('CUST_MANAGER').setValue('');
//					_this.oCustomerQueryForm.getForm().findField('CUST_ORG').setValue('');
				}
			}]
		});
    	_this.sm = new Ext.grid.CheckboxSelectionModel({singleSelect:oThisSearchField.singleSelected});

    	// 定义自动当前页行号
    	_this.rownum = new Ext.grid.RowNumberer({
    		header : 'No.',
    		width : 28
    	});
    	// 定义列模型
    	_this.cm = new Ext.grid.ColumnModel([_this.rownum,_this.sm, 
    	    {header : '用户号',dataIndex : 'ACCOUNT_NAME',sortable : true,width : 100},
    	    {header : '用户名称',dataIndex : 'USER_NAME',sortable : true,width : 100},
    	    {header : '性别',dataIndex : 'SEX',width : 100,sortable : true},
    	    {header : '生日',dataIndex : 'BIRTHDAY',width : 150,sortable : true},
    	    {header : '邮箱',dataIndex : 'EMAIL',width : 150,sortable : true},
    	    {header : '手机号',dataIndex : 'MOBILEPHONE',width : 150,sortable : true},
    	    {header : '用户状态',dataIndex : 'USER_STATE',width : 150,sortable : true}
    	]);
    	/**
    	 * 数据存储
    	 */
    	_this.oCustomerQueryStore = new Ext.data.Store({
    		restful:true,	
    		proxy : new Ext.data.HttpProxy({url:basepath+'/XywzUserQueryAction.json'}),
    		reader: new Ext.data.JsonReader({
    			totalProperty : 'json.count',
    			root:'json.data'
    		}, [
                {name: 'ACCOUNT_NAME'},
    		    {name: 'USER_NAME'},
    		    {name: 'SEX'},   		    
    		    {name: 'BIRTHDAY'},
    		    {name: 'EMAIL'},
    		    {name: 'MOBILEPHONE'},
    		    {name: 'USER_STATE'}
    		    ])
    	});
    	
    	_this.oCustomerQueryStore.reload({
			params : {
				start : 0
//				limit : _this.oCustomerQueryBbar.pageSize
			}
		});
    	
    	_this.oPagesizeCombo = new Ext.form.ComboBox({
//    		name : 'pagesize',
//    		triggerAction : 'all',
//    		mode : 'local',
//    		store : new Ext.data.ArrayStore({
//    			fields : ['value', 'text'],
//    			data : [ [ 10, '10条/页' ], [ 20, '20条/页' ], [ 50, '50条/页' ],
//    			         [ 100, '100条/页' ], [ 250, '250条/页' ],
//    			         [ 500, '500条/页' ] ]
//    		}),
//    		valueField : 'value',
//    		displayField : 'text',
//    		value : '20',
//    		editable : false,
//    		width : 85
    	});
    	_this.number = parseInt(_this.oPagesizeCombo.getValue());
    	_this.oPagesizeCombo.on("select", function(comboBox) {
    		_this.oCustomerQueryBbar.pageSize = parseInt(_this.oPagesizeCombo.getValue()),
    		_this.oCustomerQueryStore.load({
    			params : {
    				start : 0,
    				limit : parseInt(_this.oPagesizeCombo.getValue())
    			}
    		});
    	});
    	_this.oCustomerQueryBbar = new Ext.PagingToolbar({
//    		pageSize : _this.number,
//    		store : _this.oCustomerQueryStore,
//    		displayInfo : true,
//    		displayMsg : '显示{0}条到{1}条,共{2}条',
//    		emptyMsg : "没有符合条件的记录",
//    		items : ['-', '&nbsp;&nbsp;', _this.oPagesizeCombo]
    	});
		// 表格实例
    	_this.oCustomerQueryGrid = new Ext.grid.GridPanel({
    		height : 275,
			width:1000,
			region:'center',
			frame : true,
			autoScroll : true,
			store : _this.oCustomerQueryStore, // 数据存储
			stripeRows : true, // 斑马线
			cm : _this.cm, // 列模型
			sm : _this.sm, // 复选框
			bbar:_this.oCustomerQueryBbar,
			viewConfig:{
    			forceFit:false,
    			autoScroll:true
    		},
    		loadMask : {
    			msg : '正在加载表格数据,请稍等...'
    		}
    	});

    	_this.oCustomerQueryWindow=new Ext.Window({
    		title : '用户查询',
    		closable : true,
    		resizable : true,
    		height:435,
    		width:1013,
    		draggable : true,
    		closeAction : 'hide',
    		modal : true, // 模态窗口 
    		border : false,
    		closable : true,
    		layout : 'border',
    		listeners : {
    			'show':function(){
					_this.oCustomerQueryForm.form.reset();
					_this.oCustomerQueryStore.removeAll();
					if(_this.autoLoadFlag)
						_this.oCustomerQueryStore.load();
    			}    			
    		},
    		items : [_this.oCustomerQueryForm,_this.oCustomerQueryGrid],
    		buttonAlign:'center',
    		buttons:[{
    			text:'确定',
    			handler:function(){
    				var sName='';
    				var checkedNodes;
    				
    				if(!(_this.oCustomerQueryGrid.getSelectionModel().selections==null)){
    					//alert('qqqqqqq:'+_this.oCustomerQueryGrid.getSelectionModel().selections.items.length);
    					//alert(oThisSearchField.hiddenField);
    					if(oThisSearchField){
    						checkedNodes = _this.oCustomerQueryGrid.getSelectionModel().selections.items;

						for(var i=0;i<checkedNodes.length;i++){
							if(i==0){
								sName=checkedNodes[i].data.USER_NAME;
								bizMem=checkedNodes[i].data.ACCOUNT_NAME;
							}else{
								sName=sName+','+checkedNodes[i].data.USER_NAME;
								
								bizMem=bizMem+','+checkedNodes[i].data.ACCOUNT_NAME;								
							}
							
						}
						oThisSearchField.bizMem=bizMem;
						oThisSearchField.userName=sName;
						oThisSearchField.setRawValue(sName);
						if(checkedNodes.length==1){//如果单选，则设置该客户相应的附属属性
							oThisSearchField.bizMem=checkedNodes[0].data.ACCOUNT_NAME;
							oThisSearchField.userName=checkedNodes[0].data.USER_NAME;
//							oThisSearchField.custtype=checkedNodes[0].data.CUST_TYP;
//							oThisSearchField.certType=checkedNodes[0].data.CERT_TYPE;
//							oThisSearchField.certNum=checkedNodes[0].data.CERT_NUM;
//							oThisSearchField.mobileNum=checkedNodes[0].data.LINK_PHONE;
//							oThisSearchField.mgrId=checkedNodes[0].data.MGR_ID;
//							oThisSearchField.mgrName=checkedNodes[0].data.MGR_NAME;
//							oThisSearchField.instCode=checkedNodes[0].data.INSTITUTION_CODE;
//							oThisSearchField.instName=checkedNodes[0].data.INSTITUTION_NAME;
//							oThisSearchField.custStat=checkedNodes[0].data.CUST_STAT;//wzy,20130227,add
//							oThisSearchField.linkUser=checkedNodes[0].data.LINK_USER;//wzy,20130227,add
						}
					}
				}
				if (typeof oThisSearchField.callback == 'function') {
					oThisSearchField.callback(oThisSearchField,checkedNodes);
				}
				_this.oCustomerQueryWindow.hide();
			}
    	},{
    		text: '取消',
    		handler:function(){
				_this.oCustomerQueryWindow.hide();
    		}
    	}]	
    });
	_this.oCustomerQueryWindow.show();
    return;
    }
});
Ext.reg('userManagerIdQuery',Com.xywz.common.UserQuery);