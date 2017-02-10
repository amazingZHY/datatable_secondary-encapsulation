# Datatables 二次封装（自定义应用）
##1.表格初始化
   ①序列号
   ②多选框（支持全选、全不选）
   ③分页（假分页）
   ④每页显示数据条数（开启分页后方生效）、页跳转导航
   ⑤即时搜索
   ⑥页脚信息是否显示
   ⑦纵向滚动
   ⑧子行
   ⑨设置隐藏列、文本对齐方式、排序(可设置默认排序列及排序方式sss)
   ⑩选择单行/多行效果、高亮显示交叉数据
##2.获取行数据（实现单行）
   getRowData()
   ----$("#tableID").data('control').getRowData(data)
   ------data:Dom of current tr
##3.添加数据
  ①添加一行数据
   addNewRow()
   -----$("#tableID").data('control').addNewRow(data)
   ------data格式为：["dataA","dataB",“dataC”,...]
   ②添加多行数据
    addNewRows()
    ------$("#tableID").data('control').addNewRows(data)
    ------data格式为：[["dataA","dataB",“dataC”,...],["dataA","dataB",“dataC”,...],...]
##4.删除数据
   deleteRows()
    -----$("#tableID").data('control').deleteRows(data)
    ------data:Dom of current tr or trs you want to delete
##5.重载table
   reloadTable()
   -----$("#tableID").data('control').reloadTable(dataUrl,callback)
   -----dataUrl:数据源地址 callback：重载后回调函数
