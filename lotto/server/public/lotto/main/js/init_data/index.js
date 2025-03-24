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
        last_lotto_info:null,
        lotto_info_arr:[],
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