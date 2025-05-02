import ShowNumArr from "./show_num/index.js";
import ResultArea from "./result_area/index.js";

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
    ResultArea.show({
      ...opt_obj,
    });
  }
}
export default ShowNumArea;