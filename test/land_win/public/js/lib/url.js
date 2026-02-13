//import URLFunc from '/js/lib/url.js';
//let params=URLFunc.get_location_params(location);
//let tag_name = params.get("tag_name");
class URLFunc
{
  static get_location_params(location){
    return new URLSearchParams(location.search);
  }
}
export default URLFunc;