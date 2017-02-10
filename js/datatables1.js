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
    this.rowNumber = config.rowNumber || false;
    this.init(); // 初始化table
    return this;
}

Table.prototype = {
    /**
     * 初始化table
     */
    init: function(){
        this.createTable();
        var that = this;
        var oTable = $("#"+this.id+"_table").DataTable({
            //"lengthMenu": [5, 10, 20, 30],//这里也可以设置分页，但是不能设置具体内容，只能是一维或二维数组的方式，所以推荐下面language里面的写法。
            "paging": true,//分页
            //"pagingType": "full_numbers",//分页样式的类型
            "pagingType": "input",
            "ordering": true,//是否启用排序
            "rowReorder": true,
            "searching": true,//搜索，
            //"scrollY": "200px",// 是否开启滚动，若设置滚动，应同时设置"paging": false 即不分页
            "language": {
                "sProcessing":"<div style=''><img src='../static/img/loader.gif'><span>加载中...</span></div>",//可以自定义加载动画
                "lengthMenu": '每页显示<select class="form-control input-xsmall">' +
                                '<option value="1">1</option>' +
                                '<option value="10">10</option>' +
                                '<option value="20">20</option>' +
                                '<option value="30">30</option>' +
                                '<option value="40">40</option>' +
                                '<option value="50">50</option>' +
                            '</select>条记录',//左上角的分页大小显示。
                "search": '<span class="label label-success">搜索：</span>',//右上角的搜索文本，可以写html标签
                "paginate": {//分页的样式内容。
                    "previous": "<<",
                    "next": ">>",
                    "first": "首页",
                    "last": "最后"
                },
                "zeroRecords": "没有检索到数据...",//table tbody内容为空时，tbody的内容。
                //下面三者构成了总体的左下角的内容。
                "info": "总共_PAGES_ 页，显示第_START_ 到第 _END_ ，筛选之后得到 _TOTAL_ 条，初始_MAX_ 条 ",//左下角的信息显示，大写的词为关键字。
                "infoEmpty": "0条记录",//筛选为空时左下角的显示。
                "infoFiltered": ""//筛选之后的左下角筛选提示。
            },
            "ajax" : this.url,
            "fnServerData":function(){
            },
            "fnDrawCallback":function(){
                /*$(this).find("tbody tr").each(function(){
                    $(this).prepend("<td class='text-center'></td>");
                });*/
               /* $(this).find("tbody td:eq(0)").each(function(){
                    $(this).before("<td class='text-center'></td>");
                });*/

                var tbodyTd = $(this).find("tbody td:eq(0)"),
                    tbodyTr = $(this).find("tbody tr");
                for(var j = 0; j < tbodyTr.length; j++){
                    if(that.rowNumber){
                        tbodyTd.before("<td class='text-center'></td>");
                    }
                }
                /*var tbodyTr = $(this).find("tbody tr");
                for(var j = 0; j < tbodyTr.length; j++){
                    if(that.rowNumber){
                        $(this).find("tbody td:eq(0)").before("<td class='text-center'></td>");
                       // $(tbodyTr[j]).prepend("<td class='text-center'></td>");
                    }
                }*/
            }
        });
        $("#"+this.id+"_filter").find("input[type=search]").css({ width: "auto" });//右上角的默认搜索文本框，不写这个就超出去了
    },
    /**
     * 创建table
     */
    createTable: function () {
        var $table = $("<table></table>"),
            $thead = $("<thead></thead>"),
            $tbody = $("<tbody></tbody>"),
            $tr = $("<tr></tr>");
        $table.addClass("table table-bordered table-striped table-hover")
            .css({
                "width":"100%"
            }).prop({
                "id" : this.id + "_table"
            });
        if(this.rowNumber){
            //$tr.prepend($("<th>序号</th>"));
        }
        for(var i = 0; i < this.columns.length; i++){
            $tr.append($("<th>").text(this.columns[i].caption));
        }
        $thead.append($tr);
        $("#"+this.id).append($table.append($thead).append($tbody));
    }
};