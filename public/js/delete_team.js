// deleteTeam function using jQuery
function deleteTeam(teamname) {
    let link = '/delete-team-ajax/';
    let data = {
        id: teamname
    };
    console.log(data.id)
    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8", 
        success: function(result) {
        deleteRow(teamname);
        }
    });
}



function deleteRow(teamname){
    let table = document.getElementById("teams-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == teamname) {
            table.deleteRow(i);
            break;
       }
    }
  }