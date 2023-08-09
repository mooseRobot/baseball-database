// Get the objects we need to modify
let addPositionForm = document.getElementById('add-position-form-ajax');

// Modify the objects we need
addPositionForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputPosition = document.getElementById("input-position");
    let inputBattingAverage = document.getElementById("input-battingaverage");
    let inputHomeRuns = document.getElementById("input-homeruns");
    let inputRbi = document.getElementById("input-rbi");
    let inputPlayersPlayerName = document.getElementById("input-players_playername");

    // Get the values from the form fields
    let positionValue = inputPosition.value;
    let battingAverageValue = inputBattingAverage.value;
    let homerunsValue = inputHomeRuns.value;
    let rbiValue = inputRbi.value;
    let playersPlayerNameValue = inputPlayersPlayerName.value;

    // Put our data we want to send in a javascript object
    let data = {
        position: positionValue,
        battingaverage: battingAverageValue,
        homeruns: homerunsValue,
        rbi: rbiValue,
        players_playername : playersPlayerNameValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-position-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputPosition.value = '';
            inputBattingAverage.value = '';
            inputHomeRuns.value = '';
            inputRbi.value = '';
            inputPlayersPlayerName.value = '';
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
    let currentTable = document.getElementById("position-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let positionCell = document.createElement("TD");
    let battingAverageCell = document.createElement("TD");
    let homerunsCell = document.createElement("TD");
    let rbiCell = document.createElement("TD");
    let players_playernameCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    positionCell.innerText = newRow.position;
    battingAverageCell.innerText = newRow.battingaverage;
    homerunsCell.innerText = newRow.homeruns;
    rbiCell.innerText = newRow.rbi;
    players_playernameCell.innerText = newRow.players_playername;


    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteGame(newRow.position);
    };

    // Add the cells to the row 
    row.appendChild(positionCell);
    row.appendChild(battingAverageCell);
    row.appendChild(homerunsCell);
    row.appendChild(rbiCell);
    row.appendChild(players_playernameCell);


    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.position);
    
    // Add the row to the table
    currentTable.appendChild(row);
}