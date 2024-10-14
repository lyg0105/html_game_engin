class TopTabLayout {
  static action(inData) {
    let opt_obj = {
      this_obj: null,
      ...inData,
    };
    let this_obj = opt_obj.this_obj;

    let tab_table_div = document.createElement('div');
    tab_table_div.id = 'top_tab';
    tab_table_div.className = 'top_tab';
    tab_table_div.innerHTML = `
      <table>
        <colgroup>
          <col width="20%">
          <col width="20%">
          <col width="20%">
        </colgroup>
        <tbody>
          <tr>
            <th>파밍</th>
            <th>사냥</th>
          </tr>
        </tbody>
      </table>
    `;
    this_obj.layout.game_content_wrap.appendChild(tab_table_div);

    this_obj.layout.gold_table = document.getElementById('gold_table');
    this_obj.gold.gold_span = document.getElementById('gold_span');
    this_obj.gold.add_gold_span = document.getElementById('add_gold_span');
  }
}
export default TopTabArea;