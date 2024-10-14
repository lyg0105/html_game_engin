class AddGoldLayout
{
  static action(inData){
    let opt_obj = {
      this_obj: null,
      ...inData,
    };
    let this_obj = opt_obj.this_obj;

    let gold_table_div=document.createElement('div');
    gold_table_div.id = 'gold_table';
    gold_table_div.className = 'gold_table';
    gold_table_div.innerHTML = `
      <table>
        <colgroup>
          <col width="20%">
          <col width="30%">
          <col width="20%">
          <col width="30%">
        </colgroup>
        <tbody>
          <tr>
            <th>골드</th>
            <td>
              <span id="gold_span">0</span>
            </td>
            <th>+골드</th>
            <td>
              <span id="add_gold_span">0</span>
            </td>
          </tr>
        </tbody>
      </table>
    `;
    this_obj.layout.game_content_wrap.appendChild(gold_table_div);

    this_obj.layout.gold_table = document.getElementById('gold_table');
    this_obj.gold.gold_span = document.getElementById('gold_span');
    this_obj.gold.add_gold_span = document.getElementById('add_gold_span');
  }
}
export default AddGoldLayout;