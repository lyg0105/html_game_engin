console.log("kkk");


async function logJSONData(url) {
  const response = await fetch(url);
  const jsonData = await response.json();
  console.log(jsonData);
}
let lotto_idx=400;
let loto_url="https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo="+lotto_idx;
logJSONData(loto_url);