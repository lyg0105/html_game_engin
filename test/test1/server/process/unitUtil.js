exports.unitsUtilProcess=function(unit_arr,game_opt){
    var unit_len=unit_arr.length;
    for(var i=0;i<unit_len;i++){
        var unit=unit_arr[i];

        if(unit.life<unit.life_max){
            if(unit.recover_time>unit.recover_term){
                unit.life+=unit.recover_life;
                if(unit.life>unit.life_max){
                    unit.life=unit.life_max;
                }
                unit.recover_time=0;
            }
            unit.recover_time+=game_opt.loop_delay;
        }

        unit_arr[i]=unit;
    }
    return unit_arr;
}