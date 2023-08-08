// Get the objects we need to modify
let addGameForm = document.getElementById('add-game-form-ajax');

// Modify the objects we need
addGameForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputIdGame = document.getElementById("input-idgame");
    let inputWinningTeam = document.getElementById("input-winningteam");
    let inputLosingTeam = document.getElementById("input-losingteam");
    let inputWinningScore = document.getElementById("input-gameslost");
    let inputLosingScore = document.getElementById("input-losingscore");
    let inputLocation = document.getElementById("input-location");

    // Get the values from the form fields
    let idGameValue = inputIdGame.value;
    let winningTeamValue = inputWinningTeam.value;
    let losingTeamValue = inputLosingTeam.value;
    let winningScoreValue = inputWinningScore.value;
    let losingScoreValue = inputLosingScore.value;
    let locationValue = inputLocation.value;

    // Put our data we want to send in a javascript object
    let data = {
        idgame: idGameValue,
        winningteam: winningTeamValue,
        losingteam: losingTeamValue,
        winningscore: winningScoreValue,
        losingscore: losingScoreValue,
        location: locationValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-game-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputIdGame.value = '';
            inputWinningTeam.value = '';
            inputLosingTeam.value = '';
            inputWinningScore.value = '';
            inputLosingScore.value = '';
            inputLocation.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("games-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idgameCell = document.createElement("TD");
    let winningTeamCell = document.createElement("TD");
    let losingTeamCell = document.createElement("TD");
    let winningScoreCell = document.createElement("TD");
    let losingScoreCell = document.createElement("TD");
    let locationCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idgameCell.innerText = newRow.idgame;
    winningTeamCell.innerText = newRow.winningteam;
    losingTeamCell.innerText = newRow.losingteam;
    winningScoreCell.innerText = newRow.winningscore;
    losingScoreCell.innerText = newRow.losingscore;
    locationCell.innerText = newRow.location;


    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteGame(newRow.id);
    };

    // Add the cells to the row 
    row.appendChild(idgameCell);
    row.appendChild(winningTeamCell);
    row.appendChild(losingTeamCell);
    row.appendChild(winningScoreCell);
    row.appendChild(losingScoreCell);
    row.appendChild(locationCell);


    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);
    
    // Add the row to the table
    currentTable.appendChild(row);
}