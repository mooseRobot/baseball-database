// deleteGame function using jQuery
function deleteGameAndTeam(idgame) {
    let link = '/gamesandteams/delete/';
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
    let table = document.getElementById("game-teams-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == idgame) {
            table.deleteRow(i);
            break;
       }
    }
  }

  function deleteDropDownMenu(idgame){
    let selectMenu = document.getElementById("delete-game-team-drop-down");
    for (let i = 0; i < selectMenu.length; i++){
        if (selectMenu.options[i].value === idgame){
        selectMenu[i].remove();
        break;
        } 
    }
}

let deletePlayerForm = document.getElementById('delete-game-team-drop-down-form');

// Modify the objects we need
deletePlayerForm.addEventListener("submit", function (e) {
    let gameToDelete = document.getElementById("delete-game-team-drop-down")
    let gameToDeleteValue = gameToDelete.value
    deleteGameAndTeam(gameToDeleteValue)
})