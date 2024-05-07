//var BaseModel= require(LygLandConstant.ABS+'model/base/baseModel');
var Model= require(global.LygLandConstant.ABS+'model/base/model');
var TableArr= require(global.LygLandConstant.ABS+'value/table/table_arr');
var BaseWrite= require('./common/write/BaseWrite');
var BaseDelete= require('./common/delete/BaseDelete');
var BaseList=require('./common/list/BaseList');
var Response=require(global.LygLandConstant.ABS+'lib/response/response');

class BaseModel
{
  db=null;
  server_num='';
  db_name='';
  login_info=null;
  table='';
  table_id='';
  tableOpt=null;
  is_check_input_str=true;
  constructor(in_opt_obj={}){
    if(in_opt_obj==undefined){in_opt_obj={};}
    var opt_obj={
      'server_num':'',
      'db_name':'',
      "login_info":null,
      'table':'user'
    };
    for(var key in in_opt_obj){
      opt_obj[key]=in_opt_obj[key];
    }
    if(opt_obj["server_num"]==""){
      if(opt_obj["login_info"]!=undefined&&opt_obj["login_info"]!=null){
        opt_obj["server_num"]=opt_obj["login_info"]["server_num"];
        opt_obj["db_name"]=opt_obj["login_info"]["db_name"];
      }
      if(opt_obj["server_num"]==""){
        opt_obj["server_num"]="main";
      }
    }
    this.login_info=opt_obj["login_info"];
    this.server_num=opt_obj['server_num'];
    this.db_name=opt_obj['db_name'];
    this.table=opt_obj['table'];

    this.tableOpt=TableArr.get(this.table);
    this.table=this.tableOpt['table'];
    this.table_id=this.tableOpt['table_id'];

    this.connectServerByServerNum(this.server_num,this.db_name);
  }
  connectServerByServerNum(server_num,db_name){
    var modelOpt={
      host:LygLandConstant.DB_HOST,
      user   : LygLandConstant.DB_ID,
      password : LygLandConstant.DB_PW,
      database :LygLandConstant.DB_NAME,
      port   : LygLandConstant.DB_PORT,
      server_num:server_num,
    };
    if(server_num=='main'){
      modelOpt={
        host:LygLandConstant.DB_HOST,
        user   : LygLandConstant.DB_ID,
        password : LygLandConstant.DB_PW,
        database :LygLandConstant.DB_NAME,
        port   : LygLandConstant.DB_PORT,
        server_num:server_num,
      };
      if(db_name==""){
        this.db_name=LygLandConstant.DB_NAME;
      }
    }

    if(db_name!=""){
      modelOpt.database=db_name;
    }

    this.db=new Model(modelOpt);
  }
  async list(in_opt_obj){
    var list=new BaseList();
    in_opt_obj["table"]=this.table;
    in_opt_obj["baseModel"]=this;
    var list_data_arr=await list.action(in_opt_obj);
    return Response.getResultJson({"data":list_data_arr});
  }
  async write(in_opt_obj){
    var write=new BaseWrite();
    in_opt_obj["table"]=this.table;
    in_opt_obj["baseModel"]=this;
    return await write.action(in_opt_obj);
  }
  async delete(in_opt_obj){
    var deleteObj=new BaseDelete();
    in_opt_obj["table"]=this.table;
    in_opt_obj["baseModel"]=this;
    return await deleteObj.action(in_opt_obj);
  }
}

module.exports=BaseModel;