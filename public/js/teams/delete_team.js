// deleteTeam function using jQuery
function deleteTeam(teamname) {
    let link = '/teams/delete/';
    let data = {
        id: teamname
    };
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
            deleteDropDownMenu(teamname);
            break;
       }
    }
  }

function deleteDropDownMenu(teamname){
    let selectMenu = document.getElementById("delete-team-drop-down-select");
    for (let i = 0; i < selectMenu.length; i++){
        if (selectMenu.options[i].value === teamname){
        selectMenu[i].remove();
        break;
        } 
    }
}

let deletePlayerForm = document.getElementById('delete-team-drop-down-form');

// Modify the objects we need
deletePlayerForm.addEventListener("submit", function (e) {
    let teamToDelete = document.getElementById("delete-team-drop-down-select")
    let teamToDeleteValue = teamToDelete.value
    deleteTeam(teamToDeleteValue)
})