//var TableArr=require(global.LottoConstant.ABS+'value/table/table_arr');
var DateFunc=require(global.LottoConstant.ABS+'lib/lyg/date_func');

class TableArr
{
  static tb={
    "sche_excute_log":{"table":"ba_corp","name":"자사","split":"","type":"lotto","col_prefix":"schedule"},
  };
  static get(table_str){
    var result_data={
      'table_id':'',
      'table':'',
      'name':'',
      'split':'',
      'split_mid_add':'_',
      'type':'',
      'col_prefix':'',
      'split_length':0,//split 에 따른 자동 지정
      'pri_val_prefix':'',//프라이머리키 앞에문자. ca,ja,sa ..
      'key_ymd':''//증가테이블의 기준 컬럼명. 없으면 PK마지막의 이름이 col_prefix + _ymd 인것을 찾는다.
    };
    var table_data=null;
    for(var key in this.tb){
      if(table_data==null){
        if(key==table_str){
          table_data=this.tb[key];
          table_data['table_id']=key;
        }else if(table_str==this.tb[key]['table']){
          table_data=this.tb[key];
          table_data['table_id']=key;
        }
      }
    }

    if(table_data!=null){
      for(var key in table_data){
        result_data[key]=table_data[key];
      }
    }else{
      result_data=null;
    }

    if(result_data!=null){
      result_data['split_length']=0;
      if(result_data['split']=='y'){
        result_data['split_length']=4;
      }else if(result_data['split']=='ym'){
        result_data['split_length']=6;
      }else if(result_data['split']=='ymd'){
        result_data['split_length']=8;
      }
    }
    return result_data;
  }
  static getTableTailStr(table_str,data_col_val_arr,key_ymd=''){
    var table_opt=this.get(table_str);
    var table_tail_str='';
    if(key_ymd==''){
      if(table_opt['key_ymd']){
        key_ymd=table_opt['key_ymd'];
      }else{
        key_ymd=table_opt['col_prefix']+'_ymd';
      }
    }
    if(table_opt['split_length']&&key_ymd){
      if(data_col_val_arr[key_ymd]!=undefined){
        data_col_val_arr[key_ymd]=data_col_val_arr[key_ymd]+"";
        var ymd_str='';
        if(data_col_val_arr[key_ymd]==""||data_col_val_arr[key_ymd]=="0000-00-00"||data_col_val_arr[key_ymd]=="0"){
          ymd_str=DateFunc.get_date_format(new Date(),"Ymd");
        }else{
          var regex = /[^0-9]/g;
          ymd_str = data_col_val_arr[key_ymd].replace(regex, "");
        }
        ymd_str=ymd_str.substring(0,table_opt['split_length']);
        table_tail_str='_'+table_opt['split']+table_opt['split_mid_add']+ymd_str;
      }
    }
    return table_tail_str;
  }
}
module.exports=TableArr;
