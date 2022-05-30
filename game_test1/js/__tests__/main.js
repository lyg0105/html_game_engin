function lygRandom(min,max){
  let term=max-min;
  let real_min=min;
  if(term<0){
    term=-term;
    real_min=max;
  }
  // n/1=x/term (n/1)*term=x;
  let x=Math.random()*(term+1);
  x=Math.floor(x);
  x=x+real_min;
  return x;
}

test('lygLadderGame.random 1', () => {
  expect(lygRandom(0,10)>0).toBe(true);
});