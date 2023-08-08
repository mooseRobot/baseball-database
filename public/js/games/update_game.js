// Get the objects we need to modify
let updateGameForm = document.getElementById('update-game-form');

// Modify the objects we need
updateGameForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputIdGame = document.getElementById("mySelect")
    let inputWinningScore = document.getElementById("input-winningscore-update");
    let inputLosingScore = document.getElementById("input-losingscore-update");

    // Get the values from the form fields
    let idGameValue = inputIdGame.value;
    let winningScoreValue = inputWinningScore.value;
    let losingScoreValue = inputLosingScore.value;
    
    // currently the database table for database does not allow updating values to NULL
    // so we must abort if being bassed NULL for age, pitcher, retured, and freeagent

    if (isNaN(winningScoreValue)) {
        return;
    } else if (isNaN(losingScoreValue)) {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        idgame: idGameValue,
        winningscore: winningScoreValue,
        losingscore: losingScoreValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/games/update", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, idGameValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, idgame){
    let parsedData = JSON.parse(data);
    console.log(parsedData)
    let table = document.getElementById("games-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == idgame) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get values of pitchers
            let winningscore = updateRowIndex.getElementsByTagName("td")[3];
            let losingscore = updateRowIndex.getElementsByTagName("td")[4];

            // Reassign values
            winningscore.innerHTML = parsedData[0].winningscore;
            losingscore.innerHTML = parsedData[0].losingscore;
       }
    }
}
