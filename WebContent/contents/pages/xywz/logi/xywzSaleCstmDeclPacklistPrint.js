Ext.onReady(function() {
	Ext.QuickTips.init();
	var qForm = new Ext.form.FormPanel( {
		title : "外贸报关箱单",
		labelWidth : 90, // 标签宽度
		frame : true, // 是否渲染表单面板背景色
		labelAlign : 'middle', // 标签对齐方式
		buttonAlign : 'center',
		region : 'north',
		split : true,
		height : 100,
		items : [ {
			layout : 'column',
			items : [ {
				columnWidth : .25,
				layout : 'form',
				items : [ {
					xtype : 'textfield',
					Width : '100',
					name : 'invNum',
					fieldLabel : '发票号',
					anchor : '90%'
				} ]
			}]
		} ],
		buttons : [ {
			text : '查询',
			handler : function() {
				var conditionStr = qForm.getForm().getValues(false);
				store.baseParams = {
					"condition" : Ext.encode(conditionStr)
				};
				store.load( {
					params : {
						start : 0,
						limit : parseInt(pagesize_combo.getValue())
					}
				});

			}

		}, {
			text : '重置',
			handler : function() {
				qForm.getForm().reset();
			}

		} ]
	});
	// 复选框
		var sm = new Ext.grid.CheckboxSelectionModel();

		// 定义自动当前页行号
		var rownum = new Ext.grid.RowNumberer( {
			header : 'No.',
			width : 28
		});

		var record = Ext.data.Record.create( [ {
	

			   name : 'cstmPacklistId',
			   mapping : 'CSTM_PACKLIST_ID'
			  }, { 
			   name : 'invNum',
			   mapping : 'INV_NUM'
			  }, { 
			   name : 'size',
			   mapping : 'SIZE'
			  }, { 
			   name : 'pcsBundle',
			   mapping : 'PCS_BUNDLE'
			  }, { 
			   name : 'bundles',
			   mapping : 'BUNDLES'
			  }, { 
			   name : 'pcs',
			   mapping : 'PCS'
			  }, { 
			   name : 'suttleGrossWeight',
			   mapping : 'SUTTLE_GROSS_WEIGHT'

		} ]);

		// 定义列模型

		var cm = new Ext.grid.ColumnModel( [ rownum, sm, {

			   header : '报关箱单ID',
			   width : 210,
			   dataIndex : 'cstmPacklistId',
			   sortable : true
			  }, { 
			   header : '发票号',
			   width : 210,
			   dataIndex : 'invNum',
			   sortable : true
			  }, { 
			   header : 'SIZE',
			   width : 210,
			   dataIndex : 'size',
			   sortable : true
			  }, { 
			   header : 'PCS_BUNDLE',
			   width : 210,
			   dataIndex : 'pcsBundle',
			   sortable : true
			  }, { 
			   header : 'BUNDLES',
			   width : 210,
			   dataIndex : 'bundles',
			   sortable : true
			  }, { 
			   header : 'PCS',
			   width : 210,
			   dataIndex : 'pcs',
			   sortable : true
			  }, { 
			   header : '净重和毛重',
			   width : 210,
			   dataIndex : 'suttleGrossWeight',
			   sortable : true

		} ]);

		/**
		 * 数据存储
		 */
		var store = new Ext.data.Store( {
			restful : true,
			proxy : new Ext.data.HttpProxy( {
//json修改
				url : basepath + '/XywzSaleCstmDeclPacklistQueryAction.json'
			}),
			reader : new Ext.data.JsonReader( {
				successProperty : 'success',
				idProperty : 'ID',
				messageProperty : 'message',
				root : 'json.data',
				totalProperty : 'json.count'
			}, record)
		});

		// 每页显示条数下拉选择框
		var pagesize_combo = new Ext.form.ComboBox( {
			name : 'pagesize',
			triggerAction : 'all',
			mode : 'local',
			store : new Ext.data.ArrayStore(
					{
						fields : [ 'value', 'text' ],
						data : [ [ 10, '10条/页' ], [ 20, '20条/页' ],
								[ 50, '50条/页' ], [ 100, '100条/页' ],
								[ 250, '250条/页' ], [ 500, '500条/页' ] ]
					}),
			valueField : 'value',
			displayField : 'text',
			value : '20',
			editable : false,
			width : 85
		});

		// 默认加载数据
		store.load( {
			params : {
				start : 0,
				limit : parseInt(pagesize_combo.getValue())
			}
		});

		// 改变每页显示条数reload数据
		pagesize_combo.on("select", function(comboBox) {
			bbar.pageSize = parseInt(pagesize_combo.getValue()), store.reload( {
				params : {
					start : 0,
					limit : parseInt(pagesize_combo.getValue())
				}
			});
		});
		// 分页工具栏
		var bbar = new Ext.PagingToolbar( {
			pageSize : parseInt(pagesize_combo.getValue()),
			store : store,
			displayInfo : true,
			displayMsg : '显示{0}条到{1}条,共{2}条',
			emptyMsg : "没有符合条件的记录",
			items : [ '-', '&nbsp;&nbsp;', pagesize_combo ]
		});

		// 表格工具栏
		var tbar = new Ext.Toolbar(
				{
					items : [
							{
								text : '打印',
								iconCls:'exportIconCss',
								handler : function(button) {
									var record = grid.getSelectionModel().getSelected();
									var selectLength = grid.getSelectionModel().getSelections().length;
					      			if(record==null || record == undefined||selectLength>1){
					      				Ext.MessageBox.alert('提示','请选择一条记录.');
					      				return;
					      			}
					      			var cstmPacklistId = record.get("cstmPacklistId");
						  			window.open(basepath+"/contents/pages/xywz/logi/xywzSaleCstmDeclPacklistPrintDetail.jsp?cstmPacklistId="+cstmPacklistId,"newwindow","");
								}
							}
							 ]
				});

		// 表格实例
		var grid = new Ext.grid.GridPanel( {
			title : '外贸报价单列表',
			frame : true,
			autoScroll : true,
			region : 'center',
			store : store,
			stripeRows : true, // 斑马线
			cm : cm, // 列模型
			sm : sm, // 复选框
			tbar : tbar, // 表格工具栏
			bbar : bbar,// 分页工具栏
			viewConfig : {},
			loadMask : {
				msg : '正在加载表格数据,请稍等...'
			}
		});

		// 布局模型
		var viewport = new Ext.Viewport( {
			layout : 'fit',
			items : [ {
				layout : 'border',
				items : [ qForm, grid ]
			} ]
		});

	});