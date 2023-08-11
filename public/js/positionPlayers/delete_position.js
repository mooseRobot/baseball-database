// deletePitcher function using jQuery
function deletePosition(idposition) {
    let link = '/positionplayers/delete/';
    let data = {
        id: idposition
    };

    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8", 
        success: function(result) {
        deleteRow(idposition);
        }
    });
}


function deleteRow(idposition){
    let table = document.getElementById("position-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == idposition) {
            table.deleteRow(i);
            break;
       }
    }
  }
