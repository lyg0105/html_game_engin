class GameData {
  screen = {
    width: 0,
    height: 0,
    x:0,
    y:0,
  };
  canvas = {
    class:null,
    obj:null,
    width: 0,
    height: 0,
  };
  map = {
    width: 0,
    height: 0,
    cell_size:1000,
    cell_width:60,
    cell_height:60,
  };
  units=[];//build,unit {id:0,x:0,y:0,sort:'build'}
  player_units=[];//id arr [1,2,3..]
  epects=[];
  event={};
  actions=[];
};

export default GameData;