exports.checkCollision=function(unit_arr,game_opt,calculateFunc){
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
                var tmp_distance=calculateFunc.getDistance(unit.x,unit.y,unit2.x,unit2.y);
                if(tmp_distance<=(unit.width/2+unit2.width/2)){
                    //반반 밀려나자
                    var collision_power=unit.speed-unit2.speed;
                    if(collision_power<0){
                        collision_power=-collision_power;
                    }
                    collision_power+=(unit.width/2+unit2.width/2)-tmp_distance;
                    var collision_power2=parseInt(collision_power/2);
                    if(unit.x<unit2.x){
                        unit.x-=collision_power2;
                        unit2.x+=collision_power2;
                    }else if(unit.x>unit2.x){
                        unit.x+=collision_power2;
                        unit.x2-=collision_power2;
                    }
                    if(unit.y<unit2.y){
                        unit.y-=collision_power2;
                        unit2.y+=collision_power2;
                    }else if(unit.y>unit2.y){
                        unit.y+=collision_power2;
                        unit2.y-=collision_power2;
                    }

                    unit.life-=1;
                    unit2.life-=1;

                    unit_arr[i]=unit;
                    unit_arr[j]=unit2;
                }
            }
        }
    }

    //벽충돌 검사
    for(var i=0;i<unit_len;i++){
        var unit=unit_arr[i];

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

    //피검사
    for(var i=0;i<unit_len;i++){
        var unit=unit_arr[i];
        if(unit==undefined){
            continue;
        }
        unit.life=parseInt(unit.life);
        if(unit.life<=0){
            unit_arr.splice(i,1);
        }
    }

    return unit_arr;
}