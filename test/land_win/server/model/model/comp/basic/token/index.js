//var TokenModel = require(LygLandConstant.ABS+"model/model/comp/basic/token");
var BaseModel= require(LygLandConstant.ABS+'model/base/baseModel');
var Response=require(LygLandConstant.ABS+'lib/response/response');
var WriteAction=require('./write/write_action');
var DeleteAction=require('./delete/delete_action');
var ListAction=require('./list/list_action');

class TokenModel extends BaseModel
{
  constructor(in_opt_obj={}){
    in_opt_obj["table"]="token";
    super(in_opt_obj);
  }
  async write(in_opt_obj){
    var write=new WriteAction();
    in_opt_obj["table"]=this.table;
    in_opt_obj["baseModel"]=this;
    return await write.action(in_opt_obj);
  }
  async delete(in_opt_obj){
    var deleteAction=new DeleteAction();
    in_opt_obj["table"]=this.table;
    in_opt_obj["baseModel"]=this;
    return await deleteAction.action(in_opt_obj);
  }
  async list(in_opt_obj){
    var listAction=new ListAction();
    in_opt_obj["table"]=this.table;
    in_opt_obj["baseModel"]=this;
    var list_data_arr=await listAction.action(in_opt_obj);
    return Response.get({"data":list_data_arr});
  }
}

module.exports=TokenModel;