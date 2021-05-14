exports.Unit=function(init_data){
    this.data={
        name:"",
        x:50,
        y:100,
        set_target:false,
        is_target:false,
        target_x:0,
        target_y:0,
        shape:"circle",//rect
        is_move:false,
        speed:0,
        speed_power:1,
        speed_max:5,
        angle:0,
        down_key_json:{
            "up":false,
            "down":false,
            "left":false,
            "right":false
        },
        width:50,
        height:50,
        color:"#fff",
        life:1,
        life_max:10,
        recover_term:100,
        recover_time:0,
        recover_life:1
    };
    this.getData=function(){
        var result_data={};
        for(var key in this.data){
            result_data[key]=this.data[key];
        }
        return result_data;
    }
    this.init=function(){
        for(var key in init_data){
            this.data[key]=init_data[key];
        }
        if(init_data["color"]!=undefined){
            var random_num=parseInt(Math.random()*10);
            var random_num2=parseInt(Math.random()*10);
            var random_num3=parseInt(Math.random()*10);
            this.data["color"]="#"+random_num+""+random_num2+""+random_num3;
            console.log(random_num);
        }
    }
    this.init();
};