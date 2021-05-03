const express = require('express');
const Unit = require('./server/value/unit');

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
        rowData=new Unit.Unit(rowData).getData();
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

        //이동속도
        if(unit.is_move){
            unit.speed+=unit.speed_power;
            if(unit.speed>unit.speed_max){
                unit.speed=unit.speed_max;
            }
        }else{
            unit.speed=0;
        }

        //방향
        if(unit.down_key_json["up"]&&unit.down_key_json["right"]){
            unit.angle=315;
        }else if(unit.down_key_json["down"]&&unit.down_key_json["right"]){
            unit.angle=45;
        }else if(unit.down_key_json["down"]&&unit.down_key_json["left"]){
            unit.angle=135;
        }else if(unit.down_key_json["up"]&&unit.down_key_json["left"]){
            unit.angle=225;
        }else if(unit.down_key_json["up"]){
            unit.angle=270;
        }else if(unit.down_key_json["right"]){
            unit.angle=0;
        }else if(unit.down_key_json["down"]){
            unit.angle=90;
        }else if(unit.down_key_json["left"]){
            unit.angle=180;
        }

        if(unit.speed>0){
            var m_deg=unit.angle;
            var mx=Math.cos(m_deg*(Math.PI/180))*unit.speed;
		    var my=Math.sin(m_deg*(Math.PI/180))*unit.speed;
            console.log(unit.angle,mx,my);
            
            unit.x+=parseInt(mx);
            unit.y+=parseInt(my);
        }

        if(unit.x<0){
            unit.x=0;
        }else if(unit.x>game_opt.map_width){
            unit.x=game_opt.map_width;
        }

        if(unit.y<0){
            unit.y=0;
        }else if(unit.y>game_opt.map_height){
            unit.y=game_opt.map_height;
        }

        unit_arr[i]=unit;
    }
}

io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));
gameLoop();


function getD(x1,y1,x2, y2) {
	//목표 x2,y2 주체x1,y1으로부터의 각도
	var dgr = Math.atan((-(y2 - y1)) / (x2 - x1)) * (180 / Math.PI);

	dgr = parseInt(dgr);

	if (x1 < x2 && y1 > y2) {
		dgr = 360 - dgr;
	} else if (x1 < x2 && y1 < y2) {
		dgr = (-dgr);
	} else if (x1 > x2 && y1 < y2) {
		dgr = 180 - dgr;
	} else if (x1 > x2 && y1 > y2) {
		dgr = 180 + (-dgr);
	}
	dgr = parseInt(dgr);

	return dgr;
}
function getDistance(x1,y1,x2, y2){
	//목표x2,y2와 주체x1,y1과의 거리구하기
	var distance=Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
	distance=parseInt(distance);
	return distance;
}