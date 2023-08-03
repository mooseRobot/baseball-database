function deletePlayer(playername) {
  console.log('function')
    let link = '/delete-player-ajax/';
    let data = {
      id: playername
    };
    console.log('ajax')
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(playername);
      }
    });
  }
  
function deleteRow(playername){
    let table = document.getElementById("players-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == playername) {
            table.deleteRow(i);
            break;
        }
    }
}
