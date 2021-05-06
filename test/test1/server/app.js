const express = require('express');
const Unit = require('./value/unit');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

var unit_arr=[];
var game_opt={
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
            rowData=new Unit.Unit(rowData).getData();
            rowData.x=parseInt(Math.random()*game_opt.map_width);
            rowData.y=parseInt(Math.random()*game_opt.map_height);
            unit_arr.push(rowData);
        }
    }else{
        for(var key in rowData){
            if(key!="x"&&key!="y"&&key!="speed"&&key!="is_target"){
                unit_arr[pre_idx][key]=rowData[key];
            }
        }
        if(rowData["set_target"]){
            unit_arr[pre_idx]["is_target"]=true;
            unit_arr[pre_idx]["set_target"]=false;
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
        checkCollision();
    },10);
}

function moveUnits(){
    var unit_len=unit_arr.length;
    for(var i=0;i<unit_len;i++){
        var unit=unit_arr[i];
        unit.speed=parseInt(unit.speed);
        unit.x=parseInt(unit.x);
        unit.y=parseInt(unit.y);
        unit.speed_max=parseInt(unit.speed_max);
        unit.speed_power=parseInt(unit.speed_power);
        unit.width=parseInt(unit.width);
        unit.height=parseInt(unit.height);

        //방향
        if(unit.down_key_json["up"]||unit.down_key_json["down"]||unit.down_key_json["left"]||unit.down_key_json["right"]){
            unit.is_target=false;
        }
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

        //목표위치가 있다면 그쪽으로 이동
        if(unit.is_target){
            if(unit.x!=unit.target_x||unit.y!=unit.target_y){
                //거리
                var tmp_distance=getDistance(unit.x,unit.y,unit.target_x, unit.target_y);
                if(unit.speed_max<2){
                    unit.is_target=false;
                    unit.is_move=false;
                }else if(tmp_distance<unit.speed_max){
                    unit.is_target=false;
                    unit.is_move=false;
                }else{
                    unit.is_move=true;
                    unit.angle=getD(unit.x,unit.y,unit.target_x, unit.target_y);
                }
            }
        }

        //이동속도
        if(unit.is_move){
            unit.speed+=unit.speed_power;
            if(unit.speed>unit.speed_max){
                unit.speed=unit.speed_max;
            }
        }else{
            unit.speed=0;
        }

        if(unit.speed>0){
            var m_deg=unit.angle;
            var mx=Math.cos(m_deg*(Math.PI/180))*unit.speed;
		    var my=Math.sin(m_deg*(Math.PI/180))*unit.speed;
            if(m_deg==90){
                mx=0;
                my=unit.speed;
            }else if(m_deg==180){
                mx=-unit.speed;
                my=0;
            }else if(m_deg==270){
                mx=0;
                my=-unit.speed;
            }
            mx=parseInt(mx);
            my=parseInt(my);
            
            unit.x+=mx;
            unit.y+=my;
        }


        var min_x=unit.width/2;
        var min_y=unit.height/2+20;
        var max_x=game_opt.map_width-(unit.width/2);
        var max_y=game_opt.map_height-(unit.height/2);

        if(unit.x<min_x){
            unit.x=min_x
        }else if(unit.x>max_x){
            unit.x=max_x;
        }

        if(unit.y<min_y){
            unit.y=min_y;
        }else if(unit.y>max_y){
            unit.y=max_y;
        }

        unit_arr[i]=unit;
    }
}
function checkCollision(){
    var unit_len=unit_arr.length;
    for(var i=0;i<unit_len;i++){
        var unit=unit_arr[i];
        unit.x=parseInt(unit.x);
        unit.y=parseInt(unit.y);
        unit.width=parseInt(unit.width);
        unit.height=parseInt(unit.height);

        for(var j=0;j<unit_len;j++){
            var unit2=unit_arr[j];
            if(unit2["name"]!=unit["name"]){
                unit2.x=parseInt(unit2.x);
                unit2.y=parseInt(unit2.y);
                unit2.width=parseInt(unit2.width);
                unit2.height=parseInt(unit2.height);

                //거리
                var tmp_distance=getDistance(unit.x,unit.y,unit2.x,unit2.y);
                if(tmp_distance<=(unit.width/2+unit2.width/2)){
                    //내가밀려나자
                    var collision_power=unit.speed-unit2.speed;
                    if(collision_power<0){
                        collision_power=-collision_power;
                    }
                    console.log(collision_power);
                    if(unit.x<unit2.x){
                        unit.x-=collision_power;
                    }else if(unit.x>unit2.x){
                        unit.x+=collision_power;
                    }
                    if(unit.y<unit2.y){
                        unit.y-=collision_power;
                    }else if(unit.y>unit2.y){
                        unit.y+=collision_power;
                    }
                    unit_arr[i]=unit;
                }
            }
        }
    }
}

io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));
gameLoop();


function getD(x1,y1,x2,y2) {
	//목표 x2,y2 주체x1,y1으로부터의 각도
	var dgr = Math.atan((-(y2 - y1)) / (x2 - x1)) * (180 / Math.PI);

	dgr = parseFloat(dgr);

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
function getDistance(x1,y1,x2,y2){
	//목표x2,y2와 주체x1,y1과의 거리구하기
	var distance=Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
	distance=parseInt(distance);
	return distance;
}