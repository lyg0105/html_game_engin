import StringFunc from "/common/js/string/index.js";
import MyMath from "/common/js/math/index.js";
import DateFunc from "/common/js/date/index.js";
import LygFetch from "/common/js/fetch/index.js";
import LayerPopup from "/common/js/layer_popup/index.js";

class InitData
{
  static getInitData(){
    let data={
      util:{},
      data:{
        lotto_info_arr:[],
        make_num_arr:[],
        except_num_arr:[],
        include_num_arr:[],
      },
      list_opt:{
        now_page:1,
        page_size:10,
        total_page:0,
        num_per_page:10,
      },
      popup:null,
    };

    data.util.string=StringFunc;
    data.util.math=MyMath;
    data.util.date=DateFunc;
    data.util.fetch=LygFetch;
    data.popup=new LayerPopup({
      title:"팝업",
      content:"내용",
    });

    return data;
  }
}
export default InitData;