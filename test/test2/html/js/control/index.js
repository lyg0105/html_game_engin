import Farm from './farm/index.js';
class GameControl{
    main=null;
    farm=null;
    constructor(inData){
      let opt_obj={
        main:null,
        ...inData
      };
      this.main = opt_obj.main;
    }
    init(){
      let this_obj = this;
      this.farm=new Farm({main:this_obj.main});
    }
    start(){
      this.main.gameProcess.start();
    }
    stop(){
      this.main.gameProcess.stop();
    }
}
export default GameControl;