var express = require('express');
var fs=require('fs');
var router = express.Router();
var CheckRequest=require(LygLandConstant.ABS+"lib/request/check_request");

router.post('/:param1', function(req, res, next) {
  manageUrlParams(req, res, next);
});
router.post('/:param1/:param2', function(req, res, next) {
 manageUrlParams(req, res, next);
});
router.post('/:param1/:param2/:param3', function(req, res, next) {
  manageUrlParams(req, res, next);
});
router.post('/:param1/:param2/:param3/:param4', function(req, res, next) {
  manageUrlParams(req, res, next);
});
router.post('/:param1/:param2/:param3/:param4/:param5', function(req, res, next) {
  manageUrlParams(req, res, next);
});
router.post('/:param1/:param2/:param3/:param4/:param5/:param6', function(req, res, next) {
  manageUrlParams(req, res, next);
});
router.post('/:param1/:param2/:param3/:param4/:param5/:param6/:param7', function(req, res, next) {
  manageUrlParams(req, res, next);
});
router.post('/:param1/:param2/:param3/:param4/:param5/:param6/:param7/:param8', function(req, res, next) {
  manageUrlParams(req, res, next);
});

async function manageUrlParams(req,res,next){
  var param_key_arr=['param1','param2','param3','param4','param5','param6','param7','param8'];
  var url_arr=[];
  for(var i=0;i<param_key_arr.length;i++){
    var key=param_key_arr[i];
    if(req.params[key]!=undefined){
      url_arr.push(req.params[key]);
    }
  }
  url_str=url_arr.join('/');

  var class_path_arr=[];
  var method_str="";
  for(var i=0;i<url_arr.length;i++){
    if(i!=url_arr.length-1){
        class_path_arr.push(url_arr[i]);
    }else{
        method_str=url_arr[i];
    }
  }
  var class_path_str=class_path_arr.join("/");
  var file_src_str=LygLandConstant.ABS+"routes/api/"+class_path_str+".js";
  if(fs.existsSync(file_src_str)){
    var TargetClass = require(LygLandConstant.ABS+"routes/api/"+class_path_str);
    req.body.req=req;
    var targetClass=new TargetClass(req,res);
    if(class_path_str!="api/test/mytest/sql_excute"){
      //req.body=CheckRequest.checkRequestData(req.body);
    }
    var result_arr=await targetClass[method_str](req.body);
    res.send(JSON.stringify(result_arr));
  }else{
    res.send(JSON.stringify({"result":"false","msg":"Not Exist.."}));
  }
}

module.exports = router;
