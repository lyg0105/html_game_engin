let inven_items=[];
function farming(){
  inven_items.push("Item.."+LygMath.random(0,100));
  showInven();
}
function showInven(){
  let inven_div=document.getElementById("inven");
  inven_div.innerHTML="";
  for(let i=0;i<inven_items.length;i++){
    inven_div.innerHTML+=
      "<p>"+
        inven_items[i]+
        "<button onclick='removeItem("+i+");' >X</button>"+
      "</p>";
  }
}
function removeItem(idx){
  let new_inven_items=[];
  for(let i=0;i<inven_items.length;i++){
    if(i!=idx){
      new_inven_items.push(inven_items[i]);
    }
  }
  inven_items=new_inven_items;
  showInven();
}