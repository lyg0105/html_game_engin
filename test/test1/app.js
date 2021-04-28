const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

var unit_arr=[];
var game_opt={
    map_width:1000,
    map_height:600
};
app.use(express.static(__dirname + '/'));

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
        unit_arr.push(rowData);
    }else{
        for(var key in rowData){
            if(key!="x"&&key!="y"){
                unit_arr[pre_idx][key]=rowData[key];
            }
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
        moveUnits();
    },10);
}

function moveUnits(){
    var unit_len=unit_arr.length;
    for(var i=0;i<unit_len;i++){
        var unit=unit_arr[i];
        unit.speed=parseInt(unit.speed);
        unit.x=parseInt(unit.x);
        unit.y=parseInt(unit.y);
        var min_x=unit.width/2;
        var min_y=unit.height/2+20;
        var max_x=game_opt.map_width-(unit.width/2);
        var max_y=game_opt.map_height-(unit.height/2);
        if(unit.x<min_x){
            unit.x=min_x;
        }else if(unit.x>max_x){
            unit.x=max_x;
        }
        if(unit.y<min_y){
            unit.y=min_y;
        }else if(unit.y>max_y){
            unit.y=max_y;
        }

        if(unit.direct_left_right=="left"){
            unit.x-=unit.speed;
        }else if(unit.direct_left_right=="right"){
            unit.x+=unit.speed;
        }
        if(unit.direct_up_down=="up"){
            unit.y-=unit.speed;
        }else if(unit.direct_up_down=="down"){
            unit.y+=unit.speed;
        }
        unit_arr[i]=unit;
    }
}

io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));
gameLoop();