Ext.ns('Com.xywz.common');
/**
 *外协加工工厂联系人信息选择放大镜
 * @author zyx
 * @since 2015-10-18
 */
 Com.xywz.common.AsstMachgContcrMgmtQuery = Ext.extend(Ext.form.TwinTriggerField, {
    initComponent : function(){
        Ext.ux.form.SearchField.superclass.initComponent.call(this);
        this.on('specialkey', function(f, e){
            if(e.getKey() == e.ENTER){
                this.onTrigger2Click();
            }
        }, this);
    },
    onRender : function(ct, position){
    	Com.xywz.common.AsstMachgContcrMgmtQuery.superclass.onRender.call(this, ct, position);
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
    contcrId:'',
    fstNm:'',
    asstMachgId:'',
    validationEvent:false,
    validateOnBlur:false,
    trigger1Class:'x-form-clear-trigger',
    trigger2Class:'x-form-search-trigger',
    hideTrigger1:true,
    width:180,
    hasSearch : false,
    paramName : 'query',
    hiddenName:false, //用于存隐藏ID字段
    oAsstMachgContcrMgmtQueryWindow : false,

    onTrigger2Click : function(){
    	var _this=this;
    	if(_this.oAsstMachgContcrMgmtQueryWindow){
    		_this.oAsstMachgContcrMgmtQueryWindow.show();
    		return;
    	}
    	if(this.disabled){
    		return;
    	}
    	var oThisSearchField=_this;
  	
    	_this.oAsstMachgContcrMgmtQueryForm = new Ext.form.FormPanel({
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
					columnWidth : .33,
					layout : 'form',
					labelWidth: 100, // 标签宽度
					defaultType : 'textfield',
					border : false,
					items : [{
						fieldLabel : '外协加工工厂编号',
						name : 'asstMachgId',
						xtype : 'textfield', // 设置为数字输入框类型
						labelStyle: 'text-align:left;',
						anchor : '90%'
					}]
				},{
					columnWidth : .33,
					layout : 'form',
					labelWidth : 80, // 标签宽度
					defaultType : 'textfield',
					border : false,
					items : [{
						fieldLabel : '名字',
						name : 'fstNm',
						xtype : 'textfield', // 设置为数字输入框类型
						labelStyle: 'text-align:left;',
						anchor : '90%'
					}]
				}]
			}],
			
			buttons : [{
				text : '查询',
				handler : function() {
					_this.oAsstMachgContcrMgmtQueryStore.on('beforeload', function() {
						var conditionStr =  _this.oAsstMachgContcrMgmtQueryForm.getForm().getValues(false);
						this.baseParams = {
								"condition":Ext.encode(conditionStr)
						};
					});
					_this.oAsstMachgContcrMgmtQueryStore.reload({
						params : {
							start : 0,
							limit : _this.oAsstMachgContcrMgmtQueryBbar.pageSize
						}
					});
				}
			},{
				text : '重置',
				handler : function() {
					_this.oAsstMachgContcrMgmtQueryForm.getForm().reset();  
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
    	    {header : '联系人ID',dataIndex : 'CONTCR_ID',sortable : true,width : 150,hidden:true},
    	    {header : '名字',dataIndex : 'FST_NM',width : 200,sortable : true},
    	    {header : '外协加工工厂编号',dataIndex : 'ASST_MACHG_ID',width : 200,sortable : true}
    	]);
    	/**
    	 * 数据存储
    	 */
    	_this.oAsstMachgContcrMgmtQueryStore = new Ext.data.Store({
    		restful:true,	
    		proxy : new Ext.data.HttpProxy({url:basepath+'/XywzAsstMachgContcrMgmtQueryAction.json'}),
    		reader: new Ext.data.JsonReader({
    			totalProperty : 'json.count',
    			root:'json.data'
    		}, [
    		    {name: 'CONTCR_ID'},
    		    {name: 'FST_NM'},
    		    {name: 'ASST_MACHG_ID'},
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
    		_this.oAsstMachgContcrMgmtQueryBbar.pageSize = parseInt(_this.oPagesizeCombo.getValue()),
    		_this.oAsstMachgContcrMgmtQueryStore.load({
    			params : {
    				start : 0,
    				limit : parseInt(_this.oPagesizeCombo.getValue())
    			}
    		});
    	});
    	_this.oAsstMachgContcrMgmtQueryBbar = new Ext.PagingToolbar({
    		pageSize : _this.number,
    		store : _this.oAsstMachgContcrMgmtQueryStore,
    		displayInfo : true,
    		displayMsg : '显示{0}条到{1}条,共{2}条',
    		emptyMsg : "没有符合条件的记录",
    		items : ['-', '&nbsp;&nbsp;', _this.oPagesizeCombo]
    	});
		// 表格实例
    	_this.oAsstMachgContcrMgmtQueryGrid = new Ext.grid.GridPanel({
    		height : 275,
			width:1000,
			region:'center',
			frame : true,
			autoScroll : true,
			store : _this.oAsstMachgContcrMgmtQueryStore, // 数据存储
			stripeRows : true, // 斑马线
			cm : _this.cm, // 列模型
			sm : _this.sm, // 复选框
			bbar:_this.oAsstMachgContcrMgmtQueryBbar,
			viewConfig:{
    			forceFit:false,
    			autoScroll:true
    		},
    		loadMask : {
    			msg : '正在加载表格数据,请稍等...'
    		}
    	});

    	_this.oAsstMachgContcrMgmtQueryWindow=new Ext.Window({
    		title : '供应商联系人查询',
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
					_this.oAsstMachgContcrMgmtQueryForm.form.reset();
					_this.oAsstMachgContcrMgmtQueryStore.removeAll();
					if(_this.autoLoadFlag)
						_this.oAsstMachgContcrMgmtQueryStore.load();
    			}    			
    		},
    		items : [_this.oAsstMachgContcrMgmtQueryForm,_this.oAsstMachgContcrMgmtQueryGrid],
    		buttonAlign:'center',
    		buttons:[{
    			text:'确定',
    			handler:function(){
    				var sName='';
    				var checkedNodes;
    				if(!(_this.oAsstMachgContcrMgmtQueryGrid.getSelectionModel().selections==null)){
    					if(oThisSearchField.hiddenField){
    						checkedNodes = _this.oAsstMachgContcrMgmtQueryGrid.getSelectionModel().selections.items;
						if(oThisSearchField.singleSelected&&checkedNodes.length>1){
							Ext.Msg.alert('提示', '您只能选择一个客户');
							return ;
						}
						for(var i=0;i<checkedNodes.length;i++){
							if(i==0){
								sName=checkedNodes[i].data.FST_NM;
								oThisSearchField.hiddenField.setValue(checkedNodes[i].data.CONTCR_ID);
							}else{
								sName=sName+','+checkedNodes[i].data.FST_NM;
								oThisSearchField.hiddenField.setValue(_this.hiddenField.value+','+checkedNodes[i].data.CONTCR_ID);
							}
						}
						oThisSearchField.setRawValue(sName);
						if(checkedNodes.length==1){//如果单选，则设置该客户相应的附属属性
							oThisSearchField.contcrId=checkedNodes[0].data.CONTCR_ID;
							oThisSearchField.fstNm=checkedNodes[0].data.FST_NM;
							oThisSearchField.asstMachgId=checkedNodes[0].data.ASST_MACHG_ID;
						}
					}
				}
				if (typeof oThisSearchField.callback == 'function') {
					oThisSearchField.callback(oThisSearchField,checkedNodes);
				}
				_this.oAsstMachgContcrMgmtQueryWindow.hide();
			}
    	},{
    		text: '取消',
    		handler:function(){
				_this.oAsstMachgContcrMgmtQueryWindow.hide();
    		}
    	}]	
    });
	_this.oAsstMachgContcrMgmtQueryWindow.show();
    return;
    }
});
Ext.reg('AsstMachgContcrMgmtquery',Com.xywz.common.AsstMachgContcrMgmtQuery);