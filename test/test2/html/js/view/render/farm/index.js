class RenderFarm {
  static action(inData) {
    let opt_obj = {
      main: null,
      ...inData
    };
    let main = opt_obj.main;

    let is_auto_farm = main.gameData.data.is_auto_farm;
    if (is_auto_farm) {
      main.gameView.htmlObjs.farm.farm_btn.innerHTML = "중지";
    } else {
      main.gameView.htmlObjs.farm.farm_btn.innerHTML = "파밍";
    }

    let farm_delay_max = main.gameData.data.farm_delay_max;
    let farm_delay = main.gameData.data.farm_delay;
    let farm_percent = 0;
    if (farm_delay != 0 && farm_delay_max != 0) {
      farm_percent = (farm_delay / farm_delay_max) * 100;
    }
    main.gameView.htmlObjs.farm.farm_box.style.width = farm_percent + "%";
    farm_percent=Math.floor(farm_percent);
    main.gameView.htmlObjs.farm.farm_per_span.innerHTML = farm_percent + "%";
  }
}
export default RenderFarm;