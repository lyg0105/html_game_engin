class CellFunc
{
  get_cell_xy_by_click(inData){
    let opt_obj={
      click_x:0,
      click_y:0,
      game_data:null,
      ...inData
    };
    let cell_data={
      x:0,
      y:0,
      xy:"",
    };
    let click_x=opt_obj.click_x;
    let click_y=opt_obj.click_y;
    let game_data=opt_obj.game_data;

    let check_x=click_x+game_data.screen.x;
    let check_y=click_y+game_data.screen.y;
    for(let i=0;i<game_data.map.cell_size;i++){
      let start_x=i*game_data.map.cell_width;
      for(let j=0;j<game_data.map.cell_size;j++){
        let start_y=j*game_data.map.cell_height;

        let end_x=start_x+game_data.map.cell_width;
        let end_y=start_y+game_data.map.cell_height;

        if(check_x>start_x && check_x<end_x && check_y>start_y && check_y<end_y){
          cell_data.x=i;
          cell_data.y=j;
          cell_data.xy=i+"_"+j;
        }
      }
    }

    return cell_data;
  };
}
export default CellFunc;