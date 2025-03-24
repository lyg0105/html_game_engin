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
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    let headers = {
      ...default_headers,
      ...inData.headers
    };

    return new Promise((resolve, reject) => {
      fetch(opt_obj.url, {
        method: opt_obj.method,
        headers: headers,
        body: JSON.stringify(opt_obj.data),
      })
        .then((response) => response.json())
        .then((result) => {
          resolve(result);
        });
    });
  }
}
export default LygFetch;