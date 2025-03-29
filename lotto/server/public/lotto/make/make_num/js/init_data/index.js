import StringFunc from "/common/js/string/index.js";
import MyMath from "/common/js/math/index.js";
import DateFunc from "/common/js/date/index.js";
import LygFetch from "/common/js/fetch/index.js";

class InitData
{
  static getInitData(){
    let data={
      util:{},
      data:{
        lotto_info_arr:[],
      },
      list_opt:{
        now_page:1,
        page_size:10,
        total_page:0,
        num_per_page:10,
      },
    };

    data.util.string=StringFunc;
    data.util.math=MyMath;
    data.util.date=DateFunc;
    data.util.fetch=LygFetch;

    return data;
  }
}
export default InitData;