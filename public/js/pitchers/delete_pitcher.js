// deletePitcher function using jQuery
function deletePitcher(idpitcher) {
    let link = '/pitchers/delete/';
    let data = {
        id: idpitcher
    };

    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8", 
        success: function(result) {
        deleteRow(idpitcher);
        }
    });
}


function deleteRow(idpitcher){
    let table = document.getElementById("pitchers-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == idpitcher) {
            table.deleteRow(i);
            break;
       }
    }
  }
