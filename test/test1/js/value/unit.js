var Unit=function(init_data){
    this.data={
        x:10,
        y:50,
        speed:5,
        direct_left_right:"",
        direct_up_down:"",
        width:50,
        height:50,
        name:"",
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
export default Unit;