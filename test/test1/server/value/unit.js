exports.Unit=function(init_data){
    this.data={
        name:"",
        x:50,
        y:100,
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
    }
    this.init();
};