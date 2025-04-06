import ShowNumArr from "./show_num/index.js";

class ShowNumArea {
  static show(inData) {
    let opt_obj = {
      main: {},
      ...inData
    };
    let this_obj = this;
    ShowNumArr.show({
      ...opt_obj,
      div_obj: document.getElementById("except_num_div"),
      num_arr:opt_obj.main.data.data.except_num_arr,
    });
    ShowNumArr.show({
      ...opt_obj,
      div_obj: document.getElementById("include_num_div"),
      num_arr:opt_obj.main.data.data.include_num_arr,
    });
    ShowNumArr.show({
      ...opt_obj,
      div_obj: document.getElementById("make_num_div"),
      num_arr:opt_obj.main.data.data.make_num_arr,
    });
  }
}
export default ShowNumArea;