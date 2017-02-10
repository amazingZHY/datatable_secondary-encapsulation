/**
 * !datatables 1.1.1.20161108
 * Created by zhy on 2016/11/10.
 */

/**
 * @summary datatables
 * @description Paginate,search and order HTML tables easier
 * @version 1.1.1
 * @file datatables.js
 */
function Table (config) {
    this.columns = config.columns;
    this.id = config.id;
    this.url = config.url;
    this.rowNumber = config.rowNumber || false; // need row-number or not
    this.checkBox = config.checkBox || false; // need checkbox or not
    this.lengthMenu = config.lengthMenu || false; // Page length options
    this.searching = config.searching || false;// Feature control search (filtering) abilities.
    this.info = config.info || false;// Feature control table information display field.
    this.paging = config.paging || false;
    this.scrollY = config.scrollY || false; // need scrollY or not
    this.additionalInfo = config.additionalInfo || false; // open additional information or not
    this.singleSelect = config.singleSelect || false; // select single row style
    this.multipleSelect = config.multipleSelect || false; // select multiple row style
    this.highlight = config.highlight || false; // hightlight rows and columns
    this.paginateInput = config.paginateInput || false; // paginate input navigator
    this.init(); // table init
    $("#"+this.id).data("control",this);
    return this;
}
/**
 * @description datatables nucleus initialization program
 * @type {{init: Function, createTable: Function}}
 */
Table.prototype = {
    init: function(){
        this.createTable();
        var that = this,
            rowNoFlag = true,// row-number's flag
            checkboxFlag = true,// checkbox's flag
            additionalInfoFlag = true,
            visibleTargets = [], // hide columns targets array
            orderableTargets = [],// ordering columns targets array
            selected = [],// row selected array
            tableTbody = $("#"+this.id+"_table tbody"); // table's tbody
        for(var i = 0; i < this.columns.length; i++){
            if(!this.columns[i].visible){
                visibleTargets.push(i);
            }
            if(!this.columns[i].orderable){
                orderableTargets.push(i);
            }
        }
        /**
         * init table
         * @type {jQuery}
         */
        this.oTable = $("#"+this.id+"_table").DataTable({
            "sAjaxSource": this.url, // ajax get data
            "ordering": true,// use ordering or not
            "searching": this.searching,
            "info": this.info,
            "lengthMenu": [this.lengthMenu],
            "columnDefs": [
                {
                    "visible":false,    // hide columns
                    "targets":visibleTargets
                },
                {
                    "orderable":false,  // ordering columns
                    "targets":orderableTargets
                }
            ],
            "scrollY": this.scrollY ? 200 : "",
            "scrollCollapse": this.scrollY ? true : false,
            "paging": this.paging, // Enable or disable table pagination.
            "pagingType": this.paginateInput ? "input" : "full_numbers", // use input plugin or not
            "autoWidth": false, // forbidden calculate columns' width auto
            "bLengthChange" : false,// show per-page data controler or not
            "language":{
                "search":'<span class="label label-success">搜索：</span>', // search input custom
                "zeroRecords": "没有检索到数据...", // when table is empty,tbody's context
                "paginate": {   // Alternative pagination
                    "previous": '上一页',
                    "next": '下一页',
                    "first": "首页",
                    "last": "最后一页"
                },
                "info": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项" // setting footer information
            },
            "fnHeaderCallback":function(nHead){ //Be called on every 'draw' event, and allows you to dynamically modify the header row
                /*---------------------------添加“索引列”头部序号------------------------------*/
                if(that.rowNumber){
                    if(rowNoFlag){
                        $(nHead).prepend('<th class="text-center">序号</th>'); //添加索引列头部"序号"
                        rowNoFlag = false;
                     }
                }
                /*----------------------------添加"checkbox"头部------------------------------*/
                if(that.checkBox){
                    if(checkboxFlag){
                        if($(nHead).find(":input[type=checkbox]").length == 0){
                            $(nHead).prepend('<th class="text-center"><input type="checkbox" id="select_all"></th>');
                            checkboxFlag = false;
                        }
                    }
                }
                /*----------------------------添加“附加信息”title----------------------------*/
                if(that.additionalInfo){
                    if(additionalInfoFlag){
                        $(nHead).prepend('<th class="text-center"></th>');
                        additionalInfoFlag = false;
                    }
                }
            },
            "fnCreatedRow":function(nRow){ //called when a TR element is created (and all TD child elements have been inserted), or registered if using a DOM source, allowing manipulation of the TR element
                /*------------------------每行加“索引列”行号-----------------------------------*/
                if(that.rowNumber){
                    $(nRow).prepend($("<td class='text-center'></td>"));
                }
                /*--------------------------每行加“checkbox”复选框-----------------------------*/
                if(that.checkBox){
                    $(nRow).prepend($("<td class='text-center'></td>"));
                }
                /*---------------------------每行加“附加信息”按钮-------------------------------*/
                if(that.additionalInfo){
                    $(nRow).prepend('<td class="details-control"></td>')
                }
            },
            "fnDrawCallback":function(oSettings){ //called on every 'draw' event, and allows you to dynamically modify any aspect you want about the created DOM
                var iStart = "",
                    tbodyTr = $(oSettings.nTBody).find("tr");
                if(that.paginateInput){
                    iStart = verification._isNull($("#"+oSettings.sTableId+'_input').val()) ? 1 : $("#"+oSettings.sTableId+'_input').val();
                }else{
                    iStart = verification._isNull($("#"+that.id+" .dataTables_paginate").find(".active").text()) ? 1 : $("#"+that.id+" .dataTables_paginate").find(".active").text(); // 获取当前所在分页数
                }

                /*------------------------添加"索引列"-----------------------------------------*/
                if(that.rowNumber){
                    var index;
                    if(that.additionalInfo && that.checkBox){
                        index = 2;
                    }else if((!that.additionalInfo && that.checkBox) || (that.additionalInfo && !that.checkBox)){
                        index = 1;
                    }else{
                        index = 0;
                    }
                    tbodyTr.each(function(i){
                        $(this).children("td:eq("+index+")").text((iStart-1)*that.lengthMenu+(i+1));
                    });
                }
                /*-------------------------添加"checkbox"-------------------------------------*/
                if(that.checkBox){
                    var index = that.additionalInfo ? 1 :0;
                    tbodyTr.each(function(){
                        if($(this).find(":input[type=checkbox]").length == 0){
                            $(this).children("td:eq("+index+")").append('<input type="checkbox" class="active">');
                        }
                    });
                }
                // 重绘后（排序或切换页数时）切换checkbox全选状态
                $('#select_all').prop("checked",equ(that));
            },
            "rowCallback": function(row,data) {
                if($.inArray(data.DT_RowId, selected) !== -1) {
                    $(row).addClass('selected');
                }
            }
        });

        /**
         * checkbox-click event
         */
        $('#select_all').on('click', function(){
            $(that.oTable.rows().nodes()).find('input[type="checkbox"]').prop('checked',this.checked);
        });
        tableTbody.on('change', 'input[type="checkbox"]', function(){
            $('#select_all').prop("checked",equ(that));
        });
        function equ(that){
            var tbody = $("#"+that.id+"_table tbody");
            return tbody.find('input[type="checkbox"]').length == tbody.find("input:checked").length;
        }

        /**
         * Formatting function for row details - modify as you need
         * @param d
         * @returns {string}
         */
        function format ( d ) {
            // `d` is the original data object for the row
            return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
                        '<tr>'+
                            '<td>Full name:</td>'+
                            '<td>'+d[0]+'</td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td>Extension number:</td>'+
                            '<td>'+d[1]+'</td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td>Extra info:</td>'+
                            '<td>And any further details here (images etc)...</td>'+
                        '</tr>'+
                    '</table>';
        }
        // Add event listener for opening and closing details
        tableTbody.on('click', 'td.details-control', function () {
            var tr = $(this).closest('tr');
            var row = that.oTable.row( tr );
            if ( row.child.isShown() ) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                // Open this row
                row.child( format(row.data()) ).show();
                tr.addClass('shown');
            }
        } );

        /**
         * select row style
         */
        tableTbody.on('click','tr',function(){
            if(that.singleSelect){
                if($(this).hasClass('selected')){
                    $(this).removeClass('selected');
                }else{
                    that.oTable.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                }
            }else if(that.multipleSelect){
                var id = this.id,
                    index = $.inArray(id,selected);
                if(index === -1){
                    selected.push(id);
                }else{
                    selected.splice(index,1);
                }
                $(this).toggleClass('selected');
            }
        });


        /**
         * Highlighting rows and columns style
         */
        /*if(that.highlight){
            tableTbody.on('mouseenter','td',function(){
                var colIdx = that.oTable.cell(this).index().column;
                $(that.oTable.cells().nodes()).removeClass('highlight');
                $(that.oTable.column(colIdx).nodes()).addClass('highlight');
            }).on('mouseleave',function(){
                $(that.oTable.cells().nodes()).removeClass('highlight');
            });
        }*/
    },
    /**
     * draw table's Dom
     */
    createTable: function(){
        var $table = $("<table class='table table-bordered'></table>"),
            $thead = $("<thead></thead>"),
            $tbody = $("<tbody></tbody>"),
            $tr = $("<tr></tr>");
        $table.addClass("table table-bordered table-striped table-hover")
            .css({
                "width":"100%"
            }).prop({
                "id" : this.id + "_table",
                "cellspacing":"0" ,
                "cellpadding":"0"
            });
        if(this.columns.length > 0){
            for(var i = 0; i < this.columns.length; i++){
                $tr.append($("<th class='text-center'>").text(this.columns[i].caption));
            }
        }
        $thead.append($tr);
        $("#"+this.id).append($table.append($thead).append($tbody));
    },

    /**
     * get row's or rows' data
     * @returns {*}
     */
    getRowData:function(){
        var $this = $("#"+this.id+"_table tbody").find("tr.selected");
        if(this.singleSelect){
            return this.oTable.row($this).data();
        }else if(this.multipleSelect){
            return this.oTable.rows($this).data();
        }
    },

    /**
     *  add a new row to the table
     * @param data
     */
    addNewRow:function(data){
        var rowNode = this.oTable.row.add(data).draw().node();
        $(rowNode).css('color','#3c763d');
    },

    /**
     * add multiple new rows to the table
     * @param data
     */
    addNewRows:function(data){
        var rowNodes = this.oTable.rows.add(data).draw().nodes();
        $(rowNodes).css('color','#00f');
    }
};

/**
 * @description some public method
 * @type {{_isNull: Function, _ajaxString: Function}}
 */
    var verification = {
        /**
         * 判断是否为空
         * @param text
         * @returns
         */
        _isNull : function(text){
            if (text === undefined || text === "undefined" || text === null
                || text === "null" || text === "" || text === "{null}")
                return true;
            return false;
        },
        /**
         * ajax同步请求
         * @param url
         * @param data
         * @return successMsg
         */
        _ajaxString : function(url,data){
            url = encodeURI(url);
            getorpost = "POST";
            var result = "";
            $.ajax({
                type:"POST",
                url:url,
                data: data || "",
                contentType:"application/x-www-form-urlencoded; charset=utf-8",
                async:false,
                dataType:'html',
                error: function(data,transport){
                },
                success:function(msg){
                    result = msg;
                }
            });
            return result;
        }
    };