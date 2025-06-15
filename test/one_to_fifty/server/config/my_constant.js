import fs from 'fs';
import { fileURLToPath } from "url";
const __dirname = fileURLToPath(new URL(".", import.meta.url));
/*
//app.js 에서 선언한다.  LygLandConstant 는 쓰고싶은 이름으로
//쓸때는 global.LygLandConstant.ABS
global.LygLandConstant=require('./config/my_constant');//프로젝트고유전역변수

//jwt 로그인정보 변수명
req.body.login_info={
    user_info:info,
    dlit_info:dlit_info,
    corp_info:corp_info,
    db_name:dlit_info["dlit_dbname"],
    server_num:""
};
//jwt ejs에서 로그인유무 검사
<% if(body.login_info!=undefined){ %>
    <%=body.login_info.user_info['a_seq']%>
<% } %>
*/
var constant={
    APP_NAME:"lyg_land_win",
    ABS:"",
    PORT:3000,
    JWT_SECRET_KEY:'',
    IS_TEST:"",
    DB_PREFIX:"intoyou",
    DB_HOST:"localhost",
    DB_ID:"root",
    DB_PW:"root",
    DB_NAME:"lyg_land_win",
    DB_PORT:"3306",

    TMP_DATA:{},
    ALLOW_URL_ARR:[],
};
constant.ABS=__dirname.replace(/\\/gi, "/")+"/";
constant.ABS=constant.ABS.replace('/config/','/');
var env_data=getEnvData(constant.ABS+".env");
if(env_data!=undefined){
    for(var key in env_data){
        if(env_data[key]!=undefined){
            constant[key]=env_data[key];
        }
    }
}
constant.ALLOW_URL_ARR=getAllowUrlArrByFile(constant.ABS+"allow_url.txt");
constant.get=function(key,default_val){
    if(default_val==undefined){default_val="";}
    var value=default_val;
    if(constant[key]!=undefined){
        value=constant[key];
    }
    return value;
}

function getEnvData(env_src) {
    if(!fs.existsSync(env_src)){
        return {};
    }
    var env_data_str = fs.readFileSync(env_src,{encoding:"utf8",flag:"r"});
    var env_data_arr=env_data_str.split("\n");

    var env_data={};
    for (var i=0;i<env_data_arr.length;i++) {
        var line=env_data_arr[i];
        line=line.replace("\r","");
        line=line.replace("\n","");
        line=line.replace(/^\s+|\s+$/g,"");
        var key_val_arr=line.split("=");
        if(key_val_arr.length>=2){
            var key=key_val_arr[0];
            if(key!=""){
                delete key_val_arr[0];
                var value=key_val_arr.join("");
                env_data[key]=value;
            }
        }
    }
    return env_data;
}
function getAllowUrlArrByFile(file_src){
    if(!fs.existsSync(file_src)){
        return [];
    }
    var url_data_str = fs.readFileSync(file_src,{encoding:"utf8",flag:"r"});
    var url_data_arr=url_data_str.split("\n");
    var url_arr=[];
    for (var i=0;i<url_data_arr.length;i++) {
        var line=url_data_arr[i];
        line=line.replace("\r","");
        line=line.replace("\n","");
        line=line.replace(/^\s+|\s+$/g,"");
        url_arr.push(line);
    }
    return url_arr;
}

export default constant;
