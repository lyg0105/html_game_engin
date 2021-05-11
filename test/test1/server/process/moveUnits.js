exports.moveUnits=function(unit_arr,calculateFunc){
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
                var tmp_distance=calculateFunc.getDistance(unit.x,unit.y,unit.target_x, unit.target_y);
                if(unit.speed_max<2){
                    unit.is_target=false;
                    unit.is_move=false;
                }else if(tmp_distance<unit.speed_max){
                    unit.is_target=false;
                    unit.is_move=false;
                }else{
                    unit.is_move=true;
                    unit.angle=calculateFunc.getDegree(unit.x,unit.y,unit.target_x, unit.target_y);
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

        unit_arr[i]=unit;
    }

    return unit_arr;
}