const StrFunc = require('./string_func');
global.LygLandConstant=require('../../config/my_constant');

test('test str_in_array', () => {
  let search_str="dd";
  let str_arr=["aa","bb","cc"];
  expect(StrFunc.str_in_array(search_str,str_arr)).toBe(-1);
  expect(StrFunc.str_in_array("aa",str_arr)).toBe(true);
  expect(StrFunc.str_in_array("a",str_arr)).toBe(-1);
});

test('test getNumber', () => {
  expect(StrFunc.getNumber(0)).toBe("0");
  expect(StrFunc.getNumber("0")).toBe("0");
  expect(StrFunc.getNumber("1")).toBe("1");
  expect(StrFunc.getNumber("safsfd1")).toBe("1");
  expect(StrFunc.getNumber("safsfd-1")).toBe("-1");
  expect(StrFunc.getNumber("-22.123")).toBe("-22.123");
});

test('test str_replace', () => {
  //var str=StringFunc.str_replace(search,replace,content);
  expect(StrFunc.str_replace("a","","abcabc")).toBe("bcbc");
  expect(StrFunc.str_replace("a","b","abcabc")).toBe("bbcbbc");
  expect(StrFunc.str_replace("abc","1","abcabc")).toBe("11");
});
