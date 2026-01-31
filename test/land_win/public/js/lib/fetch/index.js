class LygFetch {
  static async send(inData) {
    let opt_obj = {
      method: 'POST',
      url: "",
      headers: {},
      data: {},
      ...inData
    };
    let default_headers = {
      // 'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "*"
    };
    let headers = {
      ...default_headers,
      ...opt_obj.headers
    };

    const response = await fetch(opt_obj.url, {
      method: opt_obj.method,
      headers: headers,
      body: JSON.stringify(opt_obj.data)
    });

    return response.json();
  }
}
export default LygFetch;