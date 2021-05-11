const express = require('express');
const Unit = require('./value/unit');
const calculateFunc = require('./func/collision/calculateFunc');
const moveProcess = require('./process/moveUnits');
const collisionProcess = require('./process/checkCollision');
const unitProcess = require('./process/unitUtil');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

var unit_arr=[];
var game_opt={
    loop_delay:10,
    map_width:1000,
    map_height:600
};
app.use(express.static(__dirname + '/../'));

function onConnection(socket){
    //socket_arr.push(socket);
    socket.on('updateData', updateData);
    socket.on('requestData',function(rowData){
        if(rowData!=null&&rowData!=undefined){
            updateData(rowData);
        }
        socket.emit('updateUnitArr',unit_arr);
    });
    socket.on('logout', logOutAction);
}

function updateData(rowData){
    var unit_len=unit_arr.length;
    var pre_idx=-1;
    for(var i=0;i<unit_len;i++){
        if(unit_arr[i]["name"]==rowData["name"]){
            pre_idx=i;
        }
    }
    if(pre_idx==-1){
        if(rowData["name"]){
            if(rowData.set_login){
                rowData=new Unit.Unit(rowData).getData();
                rowData.x=parseInt(Math.random()*game_opt.map_width);
                rowData.y=parseInt(Math.random()*game_opt.map_height);
                unit_arr.push(rowData);
            }
        }
    }else{
        if(rowData["set_move"]){
            unit_arr[pre_idx]["down_key_json"]=rowData.down_key_json;
            unit_arr[pre_idx]["is_move"]=rowData.is_move;
        }
        if(rowData["set_target"]){
            unit_arr[pre_idx]["is_target"]=true;
            unit_arr[pre_idx]["set_target"]=false;
            unit_arr[pre_idx]["target_x"]=rowData.target_x;
            unit_arr[pre_idx]["target_y"]=rowData.target_y;
            unit_arr[pre_idx]["down_key_json"]=rowData.down_key_json;
        }
    }
}

function logOutAction(rowData){
    var pre_idx=-1;
    var unit_len=unit_arr.length;
    for(var i=0;i<unit_len;i++){
        if(unit_arr[i]["name"]==rowData["name"]){
            pre_idx=i;
        }
    }
    if(pre_idx!=-1){
        //제거
        unit_arr.splice(pre_idx,1);
    }
}

function gameLoop(){
    setInterval(function(){
        unit_arr=unitProcess.unitsUtilProcess(unit_arr,game_opt);
        unit_arr=moveProcess.moveUnits(unit_arr,calculateFunc);
        unit_arr=collisionProcess.checkCollision(unit_arr,game_opt,calculateFunc);
    },game_opt.loop_delay);
}

io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));
gameLoop();