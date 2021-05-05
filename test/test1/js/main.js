/*
시작
컨트롤명령
데이터생성
데이터받기
그리기
*/
var canvas_wrap=null;
var game_canvas=null;
var ctx=null;
var unit_arr=[];
var socket = io();
var iamData=null;
var game_opt={
    is_load:false,
    loop_delay:20
};

window.onload=function(){
    canvas_wrap=document.getElementById("canvas_wrap");
    game_canvas=document.getElementById("game_canvas");
    ctx=game_canvas.getContext("2d");
    ctx.canvas.width=canvas_wrap.clientWidth;
    ctx.canvas.height=canvas_wrap.clientHeight;
    
    socket.on('updateUnitArr',updateUnitArr);
    gameLoop();

    //updateIamDataByInput();
    openLoginPage();

    document.addEventListener("keydown",onKeyDown);
    document.addEventListener("keyup",onKeyUp);
    document.getElementById("speed_input").addEventListener("change",updateIamDataByInput);
    document.getElementById("color_input").addEventListener("change",updateIamDataByInput);

    document.getElementById("login_btn").addEventListener("click",loginAction);
    document.getElementById("login_out_btn").addEventListener("click",logOutAction);
};
function openLoginPage(){
    document.getElementById("login_name_input").value='';
    document.getElementById("speed_input").value='';
    document.getElementById("color_input").value='';
    document.getElementById("name_input").value='';
    document.getElementById("login_div").style.display="";
    document.getElementById("login_name_input").focus();
}
function loginAction(){
    var user_name=document.getElementById("login_name_input").value;
    if(user_name==""){
        alert("이름입력필요");
        return false;
    }
    //중복검사
    var unit_len=unit_arr.length;
    var pre_iamData=null;
    for(var i=0;i<unit_len;i++){
        if(unit_arr[i].name==user_name){
            pre_iamData=unit_arr[i];
        }
    }
    if(pre_iamData!=null){
        if(confirm("이미 있는 아이디가 있습니다. 이걸로 로그인 하시겠습니까?")){
            console.log(pre_iamData);
            iamData=pre_iamData;
        }
    }

    if(iamData==null){
        iamData={
            "name":user_name,
            "speed":5,
            "color":"#fff",
            "down_key_json":{}
        };
    }

    document.getElementById("speed_input").value=iamData.speed;
    document.getElementById("color_input").value=iamData.color;
    document.getElementById("name_input").value=iamData.name;
    document.getElementById("login_div").style.display="none";
    updateIamDataByInput();
}
function logOutAction(){
    socket.emit("logout",iamData);
    iamData=null;
    openLoginPage();
}
function updateIamDataByInput(){
    if(iamData==null){
        return false;
    }

    iamData.color=document.getElementById("color_input").value;
    iamData.speed=document.getElementById("speed_input").value;
    iamData.speed=parseInt(iamData.speed);
    
    socket.emit("updateData",iamData);
}

function updateUnitArr(in_unit_arr){
    game_opt["is_load"]=false;
    unit_arr=in_unit_arr;
}

function gameLoop(){
    setInterval(function(){
        clearCanvas();
        drawUnits();
        if(game_opt["is_load"]==false){
            game_opt["is_load"]=true;
            socket.emit("requestData",iamData);
        }
    },game_opt.loop_delay);
}

function clearCanvas(){
    ctx.save();
    ctx.rect(0, 0, canvas_wrap.clientWidth, canvas_wrap.clientHeight);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.restore();
}
function drawUnits(){
    var unit_len=unit_arr.length;
    for(var i=0;i<unit_len;i++){
        var unit=unit_arr[i];
        ctx.save();
        //그리기
        ctx.fillStyle = unit.color;
        if(unit.shape=="circle"){
            ctx.beginPath();
            ctx.arc(unit.x,unit.y,unit.height/2, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
        }else{
            ctx.fillRect(unit.x-(unit.width/2),unit.y-(unit.height/2),unit.width,unit.height);
        }
        //이름
        ctx.font="11px";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.fillText(unit.name,unit.x,unit.y-(unit.height/2)-6);

        ctx.restore();
    }
}
function onKeyDown(e){
    if(e.keyCode==38||e.keyCode==40||e.keyCode==37||e.keyCode==39){
        iamData.is_move=true;
    }
    if(e.keyCode==38){
        iamData.down_key_json["up"]=true;
    }else if(e.keyCode==40){
        iamData.down_key_json["down"]=true;
    }
    if(e.keyCode==37){
        iamData.down_key_json["left"]=true;
    }else if(e.keyCode==39){
        iamData.down_key_json["right"]=true;
    }

    if(e.keyCode==13){
        if(document.getElementById("login_div").style.display!="none"){
            loginAction();
        }
    }
}
function onKeyUp(e){
    if(e.keyCode==38||e.keyCode==40){
        iamData.down_key_json["up"]=false;
        iamData.down_key_json["down"]=false;
    }
    if(e.keyCode==37||e.keyCode==39){
        iamData.down_key_json["left"]=false;
        iamData.down_key_json["right"]=false;
    }
    if(e.keyCode==38||e.keyCode==40||e.keyCode==37||e.keyCode==39){
        if(iamData.down_key_json["up"]==false&&iamData.down_key_json["down"]==false
            &&iamData.down_key_json["left"]==false&&iamData.down_key_json["right"]==false){
                iamData.is_move=false;
        }
    }
}