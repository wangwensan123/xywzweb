Ext.ns('Com.xywz.common');
/**
 * 客户选择放大镜
 * @author ZM
 * @since 2012-11-08
 */
 Com.xywz.common.ProdPlan = Ext.extend(Ext.form.TwinTriggerField, {
    initComponent : function(){
        Ext.ux.form.SearchField.superclass.initComponent.call(this);
        this.on('specialkey', function(f, e){
            if(e.getKey() == e.ENTER){
                this.onTrigger2Click();
            }
        }, this);
    },
    onRender : function(ct, position){
    	Com.xywz.common.ProdPlan.superclass.onRender.call(this, ct, position);
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
    agentNamr:'',
    contactPer:'',
    agentId:'',
    contactPhone:'',
    contactMobile:'',
    add:'',
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
    oProdPlanQueryWindow : false,

    onTrigger2Click : function(){
    	var _this=this;
    	if(_this.oProdPlanQueryWindow){
    		_this.oProdPlanQueryWindow.show();
    		return;
    	}
    	if(this.disabled){
    		return;
    	}
    	var oThisSearchField=_this;

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
  	
    	_this.oProdPlanQueryForm = new Ext.form.FormPanel({
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
						fieldLabel : '品名',
						name : 'PRD_NAME',
						xtype : 'textfield', // 设置为数字输入框类型
						labelStyle: 'text-align:right;',
						anchor : '90%'
					}]
				},{
					columnWidth : .25,
					layout : 'form',
					labelWidth: 100, // 标签宽度
					defaultType : 'textfield',
					border : false,
					items : [{
						fieldLabel : '规格型号',
						name : 'SPC_MODEL',
						xtype : 'textfield', // 设置为数字输入框类型
						labelStyle: 'text-align:right;',
						anchor : '90%'
					}]
				}]
			}],
			
			buttons : [{
				text : '查询',
				handler : function() {
					_this.oProdPlanQueryStore.on('beforeload', function() {
						var conditionStr =  _this.oProdPlanQueryForm.getForm().getValues(false);
						this.baseParams = {
								"condition":Ext.encode(conditionStr)
						};
					});
					_this.oProdPlanQueryStore.reload({
						params : {
							start : 0,
							limit : _this.oProdPlanQueryBbar.pageSize
						}
					});
				}
			},{
				text : '重置',
				handler : function() {
					_this.oProdPlanQueryForm.getForm().reset();  
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
    	    {header : '品名',dataIndex : 'PRD_NAME',sortable : true,width : 100,hiden:true}, 
    	    {header : '规格型号',dataIndex : 'SPC_MODEL',sortable : true,width : 100},                                
    	    //{header : '件数',dataIndex : 'JIAN_CNT',sortable : true,width : 100},
    	    //{header : '支/件',dataIndex : 'ZHI_CNT',sortable : true,width : 100},
    	    //{header : '零支',dataIndex : 'REM_ZHI_CNT',width : 100,sortable : true},
    	    {header : '吨数',dataIndex : 'WEIGHT',width : 100,sortable : true}
    	]);
    	/**
    	 * 数据存储
    	 */
    	_this.oProdPlanQueryStore = new Ext.data.Store({
    		restful:true,	
    		proxy : new Ext.data.HttpProxy({url:basepath+'/XywzProdPlanQueryAction.json'}),
    		reader: new Ext.data.JsonReader({
    			totalProperty : 'json.count',
    			root:'json.data'
    		}, [
    		    {name: 'PRD_NAME'},
                {name: 'SPC_MODEL'},
//                {name: 'JIAN_CNT'},
//    		    {name: 'ZHI_CNT'},
//    		    {name: 'REM_ZHI_CNT'},   		    
    		    {name: 'WEIGHT'}
    		    ])
    	});

    	_this.oPagesizeCombo = new Ext.form.ComboBox({
    		name : 'pagesize',
    		triggerAction : 'all',
    		mode : 'local',
    		store : new Ext.data.ArrayStore({
    			fields : ['value', 'text'],
    			data : [ [ 10, '10条/页' ], [ 20, '20条/页' ], [ 50, '50条/页' ],
    			         [ 100, '100条/页' ], [ 250, '250条/页' ],
    			         [ 500, '500条/页' ] ]
    		}),
    		valueField : 'value',
    		displayField : 'text',
    		value : '20',
    		editable : false,
    		width : 85
    	});
    	_this.number = parseInt(_this.oPagesizeCombo.getValue());
    	_this.oPagesizeCombo.on("select", function(comboBox) {
    		_this.oProdPlanQueryBbar.pageSize = parseInt(_this.oPagesizeCombo.getValue()),
    		_this.oProdPlanQueryStore.load({
    			params : {
    				start : 0,
    				limit : parseInt(_this.oPagesizeCombo.getValue())
    			}
    		});
    	});
    	_this.oProdPlanQueryBbar = new Ext.PagingToolbar({
    		pageSize : _this.number,
    		store : _this.oProdPlanQueryStore,
    		displayInfo : true,
    		displayMsg : '显示{0}条到{1}条,共{2}条',
    		emptyMsg : "没有符合条件的记录",
    		items : ['-', '&nbsp;&nbsp;', _this.oPagesizeCombo]
    	});
		// 表格实例
    	_this.oProdPlanQueryGrid = new Ext.grid.GridPanel({
    		height : 275,
			width:1000,
			region:'center',
			frame : true,
			autoScroll : true,
			store : _this.oProdPlanQueryStore, // 数据存储
			stripeRows : true, // 斑马线
			cm : _this.cm, // 列模型
			sm : _this.sm, // 复选框
			bbar:_this.oProdPlanQueryBbar,
			viewConfig:{
    			forceFit:false,
    			autoScroll:true
    		},
    		loadMask : {
    			msg : '正在加载表格数据,请稍等...'
    		}
    	});

    	_this.oProdPlanQueryWindow=new Ext.Window({
    		title : '银行查询',
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
					_this.oProdPlanQueryForm.form.reset();
					_this.oProdPlanQueryStore.removeAll();
					if(_this.autoLoadFlag)
						_this.oProdPlanQueryStore.load();
    			}    			
    		},
    		items : [_this.oProdPlanQueryForm,_this.oProdPlanQueryGrid],
    		buttonAlign:'center',
    		buttons:[{
    			text:'确定',
    			handler:function(){
    				var sName='';
    				var checkedNodes;
    				if(!(_this.oProdPlanQueryGrid.getSelectionModel().selections==null)){
    					if(oThisSearchField.hiddenField){
    						checkedNodes = _this.oProdPlanQueryGrid.getSelectionModel().selections.items;
						if(oThisSearchField.singleSelected&&checkedNodes.length>1){
							Ext.Msg.alert('提示', '您只能选择一个客户');
							return ;
						}
						for(var i=0;i<checkedNodes.length;i++){
							if(i==0){
								sName=checkedNodes[i].data.PRD_NAME;
								oThisSearchField.hiddenField.setValue(checkedNodes[i].data.SPC_MODEL);
							}else{
								sName=sName+','+checkedNodes[i].data.PRD_NAME;
								oThisSearchField.hiddenField.setValue(_this.hiddenField.value+','+checkedNodes[i].data.SPC_MODEL);
							}
						}
						oThisSearchField.setRawValue(sName);
						if(checkedNodes.length==1){//如果单选，则设置该客户相应的附属属性
//							oThisSearchField.agentNamr=checkedNodes[0].data.AGENT_NAMR;
//							oThisSearchField.agentId=checkedNodes[0].data.AGENT_ID;
//							oThisSearchField.add=checkedNodes[0].data.ADDR;
//							oThisSearchField.contactPer=checkedNodes[0].data.CONTACT_PER;
//							oThisSearchField.contactPhone=checkedNodes[0].data.CONTACT_PHONE;
//							oThisSearchField.contactMobile=checkedNodes[0].data.CONTACT_MOBILE;
						}
					}
				}
				if (typeof oThisSearchField.callback == 'function') {
					oThisSearchField.callback(oThisSearchField,checkedNodes);
				}
				_this.oProdPlanQueryWindow.hide();
			}
    	},{
    		text: '取消',
    		handler:function(){
				_this.oProdPlanQueryWindow.hide();
    		}
    	}]	
    });
	_this.oProdPlanQueryWindow.show();
    return;
    }
});
Ext.reg('ProdPlanQuery',Com.xywz.common.ProdPlan);