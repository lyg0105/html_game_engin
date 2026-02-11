import LygFetch from "/js/lib/fetch/index.js";
import StringFunc from "/js/lib/string/index.js";
import DateFunc from "/js/lib/date/index.js";

class Util {
  main;
  constructor(inData){
    let opt_obj={
      main: null,
      ...inData
    };
    this.main = opt_obj.main;
    this.main.model.data.util.fetch = LygFetch;
    this.main.model.data.util.string = StringFunc;
    this.main.model.data.util.date = DateFunc;
  }
}
export default Util;