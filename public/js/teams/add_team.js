// Get the objects we need to modify
let addTeamForm = document.getElementById('add-team-form-ajax');

// Modify the objects we need
addTeamForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputTeamname = document.getElementById("input-teamname");
    let inputLocation = document.getElementById("input-location");
    let inputGamesWon = document.getElementById("input-gameswon");
    let inputGamesLost = document.getElementById("input-gameslost");

    // Get the values from the form fields
    let teamnameValue = inputTeamname.value;
    let locationValue = inputLocation.value;
    let gamesWonValue = inputGamesWon.value;
    let gamesLostValue = inputGamesLost.value;

    // Put our data we want to send in a javascript object
    let data = {
        teamname: teamnameValue,
        location: locationValue,
        gameswon: gamesWonValue,
        gameslost: gamesLostValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-team-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputTeamname.value = '';
            inputLocation.value = '';
            inputGamesWon.value = '';
            inputGamesLost.value = '';
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
    let currentTable = document.getElementById("teams-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let teamnameCell = document.createElement("TD");
    let locationCell = document.createElement("TD");
    let gamesWonCell = document.createElement("TD");
    let gamesLostCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    teamnameCell.innerText = newRow.teamname;
    locationCell.innerText = newRow.location;
    gamesWonCell.innerText = newRow.gameswon;
    gamesLostCell.innerText = newRow.gameslost;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteTeam(newRow.id);
    };

    // Add the cells to the row 
    row.appendChild(teamnameCell);
    row.appendChild(locationCell);
    row.appendChild(gamesWonCell);
    row.appendChild(gamesLostCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);
    
    // Add the row to the table
    currentTable.appendChild(row);
}