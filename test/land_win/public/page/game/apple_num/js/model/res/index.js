class Resource {
  main;
  constructor(inData) {
    let opt_obj = {
      main: null,
      ...inData
    };
    this.main = opt_obj.main;
  }
  
}
export default Resource;