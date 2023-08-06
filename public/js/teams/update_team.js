
// Get the objects we need to modify
let updateTeamForm = document.getElementById('update-team-form-ajax');

// Modify the objects we need
updateTeamForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputTeamName = document.getElementById("mySelect");
    let inputGamesWon = document.getElementById("input-gameswon-update");
    let inputGamesLoss = document.getElementById("input-gameslost-update");


    // Get the values from the form fields
    let teamNameValue = inputTeamName.value;
    let gamesWonValue = inputGamesWon.value;
    let gamesLostValue = inputGamesLoss.value;
    
    // currently the database table for baseball database does not allow updating values to NULL
    // so we must abort if being bassed NULL for gameswon and gameslost

    if (isNaN(gamesWonValue)) {
        return;
    } else if (isNaN(gamesLostValue)) {
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        teamname: teamNameValue,
        gameswon: gamesWonValue,
        gameslost: gamesLostValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/teams/update", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, teamNameValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, teamname){
    let parsedData = JSON.parse(data);

    let table = document.getElementById("teams-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == teamname) {

            // Get the location of the row where we found the matching team ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of gameswon and games lost value
            console.log(updateRowIndex)
            let gameswon = updateRowIndex.getElementsByTagName("td")[2];
            let gameslost = updateRowIndex.getElementsByTagName("td")[3];
            console.log(gameswon)
            // Reassign games won and lost values
            gameswon.innerHTML = parsedData[0].gameswon;
            gameslost.innerHTML = parsedData[0].gameslost;
       }
    }
}
