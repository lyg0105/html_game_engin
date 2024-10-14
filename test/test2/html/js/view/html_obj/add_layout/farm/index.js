class AddFarmLayout {
  static action(inData) {
    let opt_obj = {
      this_obj: null,
      ...inData,
    };
    let this_obj = opt_obj.this_obj;

    let farm_btn_wrap_div = document.createElement('div');
    farm_btn_wrap_div.id = 'farm_btn_wrap';
    farm_btn_wrap_div.className = 'farm_btn_wrap';
    farm_btn_wrap_div.innerHTML = `
      <div>
        자동파밍
      </div>
      <div class="farm_box_wrap" id="farm_box_wrap">
        &nbsp;
        <div id="farm_per_span"></div>
        <div id="farm_box"></div>
      </div>
      <button id="farm_btn">파밍</button>
    `;
    this_obj.layout.game_content_wrap.appendChild(farm_btn_wrap_div);

    this_obj.layout.farm_btn_wrap = document.getElementById('farm_btn_wrap');
    this_obj.farm.farm_btn = document.getElementById('farm_btn');
    this_obj.farm.farm_per_span = document.getElementById('farm_per_span');
    this_obj.farm.farm_box_wrap = document.getElementById('farm_box_wrap');
    this_obj.farm.farm_box = document.getElementById('farm_box');
  }
}
export default AddFarmLayout;