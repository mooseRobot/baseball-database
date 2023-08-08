// deleteGame function using jQuery
function deleteGame(idgame) {
    let link = '/games/delete/';
    let data = {
        id: idgame
    };

    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8", 
        success: function(result) {
        deleteRow(idgame);
        }
    });
}


function deleteRow(idgame){
    let table = document.getElementById("games-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == idgame) {
            table.deleteRow(i);
            break;
       }
    }
  }
