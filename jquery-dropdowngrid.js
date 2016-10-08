/*!
 * dropdowngrid1.0
 *
 * Released under the MIT license
 *
 *  Date: 2016-09-29
 *
 *  for project by luanle
 */
(function($) {

	function DropdownGrid() {
		this._defaults = {
			jqgridOp:{
				url:'',
				postData:{},//传给后台的数据
				datatype : "json",
				height:'auto',
				width:'180',
				rowNum:'all',
				forceFit:true,
				shrinkToFit:true,
				//autowidth:true,
				loadComplete : function() {

				},
            },
            dropDownOp:{
                search:true,
                showRefresh:false,
                extendBtn:false,
                extendBtnIcon:"glyphicon glyphicon-option-horizontal",
                width:'100%',
                height:'300px',
            },
            viewCol:'',//选中显示到input中的字段
			searchField:'',
		};
	};

	$.extend(DropdownGrid.prototype, {

		markerClassName: 'hasDropdownGrid',

		propertyName: 'dropdownGrid',

		setDefaults: function(options) {
			$.extend(this._defaults, options || {});
			return this;
		},
		_attachPlugin: function(target, options) {
			var target = $(target);
			if (target.hasClass(this.markerClassName)) {
				return;
			}
			var inst = {options: $.extend(true,{}, this._defaults)};
			target.addClass(this.markerClassName).
				data(this.propertyName, inst);

			this._optionPlugin(target, options);
		},

		_optionPlugin: function(target, options, value) {
			var target = $(target);
			var _this = this;
			var inst = target.data(this.propertyName);

			if (!target.hasClass(this.markerClassName)) {
				return;
			}
			options = options || {};
			$.extend(true,inst.options, options);
			var container_html = '<div class="input-group input-group-sm"></div>';
			target.wrap(container_html);
			var iconBtn = '<div class="input-group-addon">'+
		                        '<a href="javascript:;">'+
		                            '<span class="glyphicon glyphicon-search"></span>'+
		                        '</a>'+
		                    '</div>';
			target.parent(".input-group").append(iconBtn);
			this._addDropdownGrid(target,options);
			
			//绑定事件
			//下拉展开按钮点击事件
			target.siblings('.input-group-addon').bind('click',function(e){
				var evt = e || window.event;
				evt.stopPropagation();
				_this._resetDropdownGrid(target);
				_this._toggleDropdownGrid(target);
			});
			//输入框绑定键盘事件
			target.bind('keyup',function(e){
				var evt = e || window.event;
				evt.stopPropagation();
				if(evt.keyCode=='13'||evt.which=='13'){
					_this._resetDropdownGrid(target);
					_this._showDropdownGrid(target);
				}
			});
			//document绑定使下拉框消失的事件
			$(document).bind('click',function(){
				_this._hideDropdownGrid(target);
			});
		},
		_setDropdownGridDataPlugin:function(target,options){
			var target = $(target);
			var inst = target.data(this.propertyName).options;
			$.extend(true,inst,options);
		},
		_addDropdownGrid:function(target){
			var target = $(target);
			var inst = target.data(this.propertyName).options;
			var id = target.attr('id');
			var dropdown_html = '<div class="dropdown-menu dropdown-grid" id="'+id+'_dropdown">'+
									'<div class="main-content-table">'+
										'<div class="main-table-container">'+
											'<table class="table table-striped table-hover table-change" id="'+id+'_dropdownGrid"></table>'+
										'</div>'+
									'</div>'+
								'</div>';
			$('body').append($(dropdown_html));
			inst.jqgridOp.onSelectRow = function(rowid){
                target.prop("value",$(this).getCell(rowid,inst.viewCol));
			};
			$('#'+id+'_dropdownGrid').jqGrid(inst.jqgridOp);
			$('#'+id+'_dropdown').css({
				height:inst.dropDownOp.height,
			});
		},
		_setDropdownGridPos:function(target){
			var target = $(target);
			var pos = target.offset();
			var id = target.attr('id');
			$('#'+id+'_dropdown').css({
				top:pos.top+30,
				left:pos.left,
			});
		},
		_setDropdownGridWidth: function (target) {
			var target = $(target);
			var inst = target.data(this.propertyName).options;
			var id = target.attr('id');
			//width配置为100%时，根据当前操作的input来设置高度
			if(inst.dropDownOp.width=='100%'){
				var curr_width = target.parents('.input-group').outerWidth();
				inst.dropDownOp.width = curr_width;
			};
			$('#'+id+'_dropdown').css({
				width:inst.dropDownOp.width,
			});
		},
		_resetDropdownGrid:function(target){
			var target = $(target);
			var inst = target.data(this.propertyName).options;
			var id = target.attr('id');
			var searchVal = target.val().trim();
			inst.jqgridOp.postData[inst.searchField] = searchVal;
			$('#'+id+'_dropdownGrid')
				.clearGridData()
				.setGridParam({postData:inst.jqgridOp.postData})
				.trigger("reloadGrid");
		},
		_showDropdownGrid:function(target){
			var target = $(target);
			var id = target.attr('id');
			this._setDropdownGridPos(target);
			this._setDropdownGridWidth(target);
			$('.dropdown-menu').slideUp(100);
			$('#'+id+'_dropdown').slideDown(100);
		},
		_hideDropdownGrid:function(target){
			var target = $(target);
			var id = target.attr('id');
			$('#'+id+'_dropdown').slideUp(100);
		},
		_toggleDropdownGrid:function(target){
			var target = $(target);
			var id = target.attr('id');
			this._setDropdownGridPos(target);
			this._setDropdownGridWidth(target);
			if($('#'+id+'_dropdown').css('display')=='none'){
				$(document).trigger('click');
			}
			$('#'+id+'_dropdown').slideToggle(100);
		}
	});

	$.fn.dropdownGrid = function(options) {
		var otherArgs = Array.prototype.slice.call(arguments,1);
		return this.each(function() {
			if(typeof options == 'string'){
				if(!plugin['_'+options+'Plugin']){
					throw '没有此方法：'+options;
				}else{
					plugin['_'+options+'Plugin'].
						apply(plugin,[this].concat(otherArgs));
				}
			}else{
				plugin._attachPlugin(this, options || {});
			}
		});
	};

	var plugin = $.DropdownGrid = new DropdownGrid();

})(jQuery);
