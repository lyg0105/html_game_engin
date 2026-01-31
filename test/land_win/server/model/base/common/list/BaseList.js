//var BaseList=require(global.LygLandConstant.ABS+'model/base/common/list/BaseList');
var StrFunc=require(global.LygLandConstant.ABS+'lib/lyg/string_func');
var ConvertPrefixKey=require(global.LygLandConstant.ABS+'model/base/func/convertPrefixKey');
var DateFunc=require(global.LygLandConstant.ABS+'lib/lyg/date_func');
var WebPaging=require(global.LygLandConstant.ABS+'lib/paging/WebPaging');
var DBFunc=require(global.LygLandConstant.ABS+'model/base/func/DBFunc');

class BaseList
{
  table="";
  table_id="";
  tableOpt=null;
  baseModel=null;
  x_column_arr=null;
  x_column_detail=null;
  pri_col_arr=[];
  last_pri_col="";
  order_where_row=[];
  s_list_opt={};
  async action(inOptObj){
    if(inOptObj['is_app']=='1'){
      // var tmpInOptObj = JSON.stringify(inOptObj);
      // tmpInOptObj = JSON.parse(tmpInOptObj);
      // if(!StrFunc.is_empty(inOptObj["s_pri_arr"])){
      //   inOptObj["s_pri_arr"] =JSON.parse(tmpInOptObj["s_pri_arr"]);
      // }
      // if(!StrFunc.is_empty(inOptObj["s_car_user_seq_arr"])){
      //   inOptObj["s_car_user_seq_arr"] =JSON.parse(tmpInOptObj["s_car_user_seq_arr"]);
      // }
    }
    this.s_list_opt={
      "now_page":"1",
      "num_per_page":"20",
      "order_id":"",
      "order_type":"",
      "group_id":"",
      "s_date_type":"",
      "s_start_date":"",
      "s_end_date":"",
      "sc":null,//{}

      "debug":"",
      "get_col":"*",
      "get_col_after":"",
      "tot_col":"",

      "s_pri_arr":null,//[]

      "is_need_count":"1",
      "is_need_info_arr":"1",
      "is_no_limit":"",
      "is_convert_col":"1",
      "max_limit_num":"1000000",
      "is_check_input_str":true,
      "is_add_idx_info":"",

      "is_paging":"1"
    };
    for(var key in inOptObj){
      this.s_list_opt[key]=inOptObj[key];
    }
    
    if(this.s_list_opt["is_paging"]==""){
      this.s_list_opt.is_need_count="";
      this.s_list_opt.is_need_info_arr="1";
      this.s_list_opt.is_no_limit="1";
    }

    this.baseModel=this.s_list_opt["baseModel"];
    this.table=this.baseModel.table;
    this.table_id=this.baseModel.table_id;
    this.tableOpt=this.baseModel.tableOpt;
    this.x_column_arr=await DBFunc.getXColumnArrByTableName({"table":this.table,"baseModel":this.baseModel});
    this.x_column_detail=DBFunc.getDetailByXColumnArr(this.x_column_arr);
    this.pri_col_arr=this.x_column_detail["pri_col_arr"];
    this.last_pri_col=this.x_column_detail["last_pri_col"];
    this.s_list_opt=this.setUnConvertListOpt(this.s_list_opt,"a_",this.tableOpt["col_prefix"]+"_");
    this.initCustomOpt();

    this.order_where_row=this.addWhereOfOrder();
    var where_row=this.getWhereArr();
    var tableStr=this.getTableStrCustom();
    this.s_list_opt["get_col"]=this.getColCustom();
    var get_col=this.s_list_opt["get_col"];

    var table_split_arr=[];
    if(this.tableOpt["split"]!=""){
      table_split_arr=await this.getTableSplitArr();
    }
    if(table_split_arr.length==0){
      table_split_arr.push(tableStr);
    }
    tableStr=this.getTableStrByTableSplitArr(table_split_arr);
    where_row=[];

    if(this.s_list_opt["get_col_after"]!=""){
      get_col=this.s_list_opt["get_col_after"];
    }

    var tot_col="COUNT(*) AS tot";
    if(this.s_list_opt["tot_col"]!=""){
      tot_col=this.s_list_opt["tot_col"];
    }else if(this.s_list_opt["group_id"]!=""){
      var tmp_is_number_col_arr=this.x_column_detail["is_number_col_arr"];
      var tmp_tot_col_arr=[];
      for(var key in this.x_column_arr){
        var row_xcolumn=this.x_column_arr[key];
        if(row_xcolumn["pri"]==""){
          if(StrFunc.str_in_array(key,tmp_is_number_col_arr)!=-1){
            tmp_tot_col_arr.push("SUM("+key+") AS "+key);
          }
        }
      }
      tmp_tot_col_arr.push("COUNT(*) AS tot");
      tot_col=tmp_tot_col_arr.join(",");
    }
    var count_info=null;
    var count_tot="0";
    var p_conf={};
    var webPaging=null;
    if(this.s_list_opt["is_need_count"]=="1"){
      var tmp_sql_opt={
        "t":tableStr,
        "g":tot_col,
        "w":where_row,
        "o":"1",
        "debug":this.s_list_opt["debug"]
      };
      var count_info=await this.baseModel.db.list(tmp_sql_opt);
      count_tot=count_info["tot"];
      if(this.s_list_opt["group_id"]!=""){
        var tmp_group_id=this.s_list_opt["group_id"];
        var tmp_table_str="(SELECT "+tmp_group_id+" AS tot FROM "+tableStr+" WHERE 1=1 GROUP BY "+tmp_group_id+") AS G";
        var tmp_sql_opt2={
          "t":tmp_table_str,
          "g":"COUNT(*) AS tot",
          "o":"1",
          "debug":this.s_list_opt["debug"]
        };
        var tmp_count_info=await this.baseModel.db.list(tmp_sql_opt2);
        count_tot=tmp_count_info["tot"];
      }
      p_conf={
        "now_page":parseInt(this.s_list_opt["now_page"]),
        "num_per_page":parseInt(this.s_list_opt["num_per_page"]),
        "total_rec":parseInt(count_tot)
      };
      webPaging=new WebPaging(p_conf);
    }

    if(this.s_list_opt["group_id"]!=""){
      where_row.push("GROUP BY "+this.s_list_opt["group_id"]);

      if(get_col=="*"){
        var tmp_is_number_col_arr=this.x_column_detail["is_number_col_arr"];
        var get_col_arr=[];
        for(var key in this.x_column_arr){
          var row_xcolumn=this.x_column_arr[key];
          var tmp_col_str=key;
          if(row_xcolumn["pri"]==""){
            if(StrFunc.str_in_array(key,tmp_is_number_col_arr)!=-1){
              if(key.indexOf("_seq")==-1&&key.indexOf("_code")==-1){
                tmp_col_str="SUM("+key+") AS "+key;
              }
            }
          }
          get_col_arr.push(tmp_col_str);
        }
        get_col_arr.push("COUNT(*) AS row_tot");
        get_col=get_col_arr.join(",");
      }
    }
    for(var i=0;i<this.order_where_row.length;i++){
      where_row.push(this.order_where_row[i]);
    }

    if(webPaging!=null){
      where_row.push("LIMIT "+webPaging.opt_obj.st_limit+", "+webPaging.opt_obj.num_per_page);
    }else{
      if(this.s_list_opt["is_no_limit"]=="1"){
        where_row.push("LIMIT "+this.s_list_opt["max_limit_num"]);
      }else{
        var tmp_now_page=parseInt(this.s_list_opt["now_page"]);
        var tmp_num_per_page=parseInt(this.s_list_opt["num_per_page"]);
        var st_num=(tmp_now_page-1)*tmp_num_per_page;
        where_row.push("LIMIT "+st_num+", "+tmp_num_per_page);
      }
    }

    var info_arr=[];
    if(this.s_list_opt["is_need_info_arr"]=="1"){
      var info_arr_sql_opt={
        "t":tableStr,
        "w":where_row,
        "g":get_col,
        "debug":this.s_list_opt["debug"]
      };
      info_arr=await this.baseModel.db.list(info_arr_sql_opt);
    }
    info_arr=await this.getInfoArrCheckData(info_arr);
    info_arr=await this.getInfoArrAddon(info_arr);
    var list_data_arr={
      "info_arr":info_arr,
      "tot":count_tot,
      "count_info":count_info
    };
    if(webPaging!=null){
      list_data_arr["start_index"]=webPaging.get_index_num(0);
      if(this.s_list_opt["is_add_idx_info"]=="1"){
        let tmp_arr_len=list_data_arr["info_arr"].length;
        for(let i=0;i<tmp_arr_len;i++){
          list_data_arr["info_arr"][i]["idx_num"]=list_data_arr["start_index"]-i;
        }
      }
    }
    list_data_arr=await this.getListDataArrAddon(list_data_arr);

    if(this.s_list_opt["is_convert_col"]=="1"){
      var tmp_col_prefix=this.tableOpt["col_prefix"];
      info_arr=ConvertPrefixKey.getConvertedPrefixInfoArr(info_arr,tmp_col_prefix+"_","a_");
      list_data_arr["info_arr"]=info_arr;
      if(count_info!=null){
        count_info=ConvertPrefixKey.getConvertedPrefixColValArr(count_info,tmp_col_prefix+"_","a_");
        list_data_arr["count_info"]=count_info;
      }
    }

    return list_data_arr;
  }
  async getListDataArrAddon(list_data_arr){
    return list_data_arr;
  }
  async getInfoArrCheckData(info_arr){
    var tmp_info_arr=[];
    for(var i=0;i<info_arr.length;i++){
      var info=info_arr[i];
      for(var key in info){
        if(info[key]==null||info[key]==undefined){info[key]="";}
        if(StrFunc.str_in_array(key,this.x_column_detail["is_date_col_arr"])!=-1){
          if(info[key]=="0000-00-00"||info[key]=="0000-00-00 00:00:00"||info[key]=="0000-00"){
            info[key]="";
          }
        }else if(StrFunc.str_in_array(key,this.x_column_detail["is_number_col_arr"])!=-1){
          if(StrFunc.str_in_array(key,this.x_column_detail["pri_col_arr"])==-1){
            if(key.indexOf("_seq")==-1&&key.indexOf("_code")==-1&&key.indexOf("_year")==-1){
              //info[key]=StrFunc.comma(info[key]);
            }
          }
        }
      }
      tmp_info_arr.push(info);
    }
    info_arr=tmp_info_arr;
    return info_arr;
  }
  async getInfoArrAddon(info_arr){
    return info_arr;
  }
  getColCustom(){
    return this.s_list_opt["get_col"];
  }
  getTableStrCustom(){
    return this.table;
  }
  getWhereArr(inOptObj){
    if(inOptObj==undefined){inOptObj={};}
    var optObj={
      "split_table":""
    };
    for(var key in inOptObj){
      optObj[key]=inOptObj[key];
    }
    var where_arr=[];
    if(this.s_list_opt["sc"]!=null){
      for(var key in this.s_list_opt["sc"]){
        var val=this.s_list_opt["sc"][key];
        if(val=="0"){
          val="empty";
        }
        if(val!=""){
          if(this.x_column_arr[key]!=undefined){
            if(val=="empty"){
              where_arr.push(" AND IFNULL("+key+",'') IN ('','0')");
            }else{
              where_arr.push(" AND "+key+" LIKE '%"+val+"%'");
            }
          }
        }
      }
    }

    if(this.s_list_opt["s_pri_arr"]!=null){
      var pri_val_arr_str="'"+this.s_list_opt["s_pri_arr"].join("','")+"'";
      var pri_col_str=this.pri_col_arr.join(",',',");
      where_arr.push("AND CONCAT("+pri_col_str+") IN ("+pri_val_arr_str+")");
    }

    if(this.s_list_opt["s_date_type"]==""){
      this.s_list_opt["s_date_type"]="";//cargo_start_date
    }
    if(this.s_list_opt["s_date_type"]!=""){
      if(this.s_list_opt["s_start_date"]!=""){
        where_arr.push(" AND LEFT("+this.s_list_opt["s_date_type"]+",10) >= '"+this.s_list_opt["s_start_date"]+"'");
      }
      if(this.s_list_opt["s_end_date"]!=""){
        where_arr.push(" AND LEFT("+this.s_list_opt["s_date_type"]+",10) <= '"+this.s_list_opt["s_end_date"]+"'");
      }
    }

    return where_arr;
  }
  addWhereOfOrder(in_where_row){
    var result_where_row=[];
    if(in_where_row!=undefined){
      for(var i=0;i<in_where_row.length;i++){
        result_where_row.push(in_where_row[i]);
      }
    }

    if(this.s_list_opt["order_id"]!=""){
      var order_data_str=this.s_list_opt["order_id"]+" "+this.s_list_opt["order_type"];
      var order_data_arr=order_data_str.split(",");
      var order_where_arr=[];
      
      for(var i=0;i<order_data_arr.length;i++){
        var order_row=order_data_arr[i].replace(" ASC","");
        var tmp_row_arr=order_row.split(" DESC");
        var key=StrFunc.trim(tmp_row_arr[0]);
        var order_w_str=key;
        if(tmp_row_arr.length==2){
          order_w_str+=" DESC";
        }
        if(this.x_column_arr[key]!=undefined){
          order_where_arr.push(order_w_str);
        }
      }
      if(order_where_arr.length>0){
        var order_where_arr_str=order_where_arr.join(",");
        result_where_row.push("ORDER BY "+order_where_arr_str);
      }
    }
    
    return result_where_row;
  }
  async getTableSplitArr(){
    var s_start_date=this.s_list_opt["s_start_date"];
    var s_end_date=this.s_list_opt["s_end_date"];

    if(s_start_date==""){
      s_start_date=DateFunc.get_date_format(new Date(),"Y-01-01");
    }
    if(s_end_date==""){
      s_end_date=DateFunc.get_date_format(new Date(),"Y-12-31");
    }

    var st_time=new Date(s_start_date);
    st_time=DateFunc.get_change_date(st_time,'month',-6);
    var end_time=new Date(s_end_date);
    end_time=DateFunc.get_change_date(end_time,'month',+6);

    var ymd_date_key=this.tableOpt["split"];
    ymd_date_key=ymd_date_key.toLowerCase();
    if(ymd_date_key=="y"){
      ymd_date_key="Y";
    }else if(ymd_date_key=="ym"){
      ymd_date_key="Ym";
    }else if(ymd_date_key=="ymd"){
      ymd_date_key="Ymd";
    }

    if(ymd_date_key!=""){
      var tmp_s_pri_arr=this.s_list_opt["s_pri_arr"];
      if(tmp_s_pri_arr!=null&&tmp_s_pri_arr.length>0){
        for(var i=0;i<tmp_s_pri_arr.length;i++){
          var pri_val=tmp_s_pri_arr[i];
          var tmp_pri_val_arr=pri_val.split(",");
          tmp_pri_val_arr[0]=tmp_pri_val_arr[0].replace("\[^0-9-.]\g","");
          var tmp_st_year=tmp_pri_val_arr[0].substr(0,4);
          var tmp_st_month=tmp_pri_val_arr[0].substr(4,2);
          var tmp_st_day=tmp_pri_val_arr[0].substr(6,2);
          var tmp_st_time=new Date(tmp_st_year+"-"+tmp_st_month+"-"+tmp_st_day);
          if(tmp_st_time.getTime()<st_time.getTime()){
            st_time=tmp_st_time;
            st_time=DateFunc.get_change_date(st_time,'month',-6);
          }
          var tmp_end_time=new Date(tmp_st_year+"-"+tmp_st_month+"-"+tmp_st_day);
          if(tmp_end_time.getTime()>end_time.getTime()){
            end_time=tmp_end_time;
            end_time=DateFunc.get_change_date(end_time,'month',+6);
          }
        }
      }
    }

    var table_split_arr=[];
    var ymd_st=DateFunc.get_date_format(st_time,ymd_date_key);
    ymd_st=parseInt(ymd_st);
    var ymd_end=DateFunc.get_date_format(end_time,ymd_date_key);
    ymd_end=parseInt(ymd_end);
    var tmp_cnt=0;
    var max_cnt=99;
    for(var i=ymd_st;i<=ymd_end;i++){
      var i_str=i+"";
      if(ymd_date_key=="Ymd"){
        if(parseInt(i_str.substr(6,2))>=32){
          var tmp_y=i_str.substr(0,4);
          var tmp_m=parseInt(i_str.substr(4,2));
          tmp_m++;
          i_str=tmp_y+tmp_m+"01";

          if(parseInt(i_str.substr(4,2))>=13){
            var tmp_y=parseInt(i_str.substr(0,4));
            tmp_y++;
            i_str=tmp_y+"0101";
          }

          i=parseInt(i_str);
        }
      }else if(ymd_date_key=="Ym"){
        if(parseInt(i_str.substr(4,2))>=13){
          var tmp_y=parseInt(i_str.substr(0,4));
          tmp_y++;
          i_str=tmp_y+"01";
        }
        i=parseInt(i_str);
      }

      var tmp_table_name=this.tableOpt["table"];
      tmp_table_name+="_"+this.tableOpt["split"];
      tmp_table_name+=this.tableOpt["split_mid_add"]+i;
      var tmp_has_table=await DBFunc.hasTable({"baseModel":this.baseModel,"table_name":tmp_table_name});
      if(tmp_has_table){
        tmp_cnt++;
        table_split_arr.push(tmp_table_name);
        if(tmp_cnt>=max_cnt){
          i=ymd_end;
            break;
        }
      }
    }

    return table_split_arr;
  }
  getTableStrByTableSplitArr(table_split_arr){
    var table_str_arr=[];
    for(var i=0;i<table_split_arr.length;i++){
      var split_table=table_split_arr[i];
      var tmp_get_col=this.s_list_opt["get_col"];
      var tmp_sql="SELECT "+tmp_get_col+" FROM "+split_table+" WHERE 1=1 ";
      var tmp_where_row=this.getWhereArr({"split_table":split_table});
      for(var j=0;j<this.order_where_row.length;j++){
        tmp_where_row.push(this.order_where_row[j]);
      }
      for(var j=0;j<tmp_where_row.length;j++){
        tmp_sql+=" "+tmp_where_row[j]+" ";
      }
      tmp_sql+=" LIMIT "+this.s_list_opt["max_limit_num"];
      table_str_arr.push("("+tmp_sql+")");
    }
    var table_str=table_str_arr.join(" UNION ");
    table_str="("+table_str+") AS TABLE_A";
    return table_str;
  }
  setUnConvertListOpt(s_list_opt,prefix,change_prefix){
    var tmp_change_key_arr=[
      "order_id",
      "order_type",
      "s_date_type",
      "group_id",
      "get_col",
      "get_col_after"
    ];
    for(var key in s_list_opt){
      if(StrFunc.str_in_array(key,tmp_change_key_arr)==-1){
        continue;
      }
      var val=s_list_opt[key];
      if(val!=""&&typeof val=="string"){
        val=ConvertPrefixKey.replacePrefixStr(val,prefix,change_prefix);
        val=StrFunc.str_replace(" "+prefix," "+change_prefix,val);
        if(this.s_list_opt["is_check_input_str"]==false&&this.baseModel.is_check_input_str==false){

        }else{
          val=StrFunc.checkInputStr(val);
        }
        s_list_opt[key]=val;
      }
    }

    if(s_list_opt["sc"]!=null){
      var tmp_sc={};
      for(var key in s_list_opt["sc"]){
        var key2=ConvertPrefixKey.replacePrefixStr(key,prefix,change_prefix);
        tmp_sc[key2]=s_list_opt["sc"][key];
        tmp_sc[key2]=StrFunc.checkInputStr(tmp_sc[key2]);
      }
      s_list_opt["sc"]=tmp_sc;
    }

    return s_list_opt;
  }
  initCustomOpt(){

  }
}
module.exports=BaseList;
