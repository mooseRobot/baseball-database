// Get the objects we need to modify
let addGameForm = document.getElementById('add-game-team-form"');

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
    xhttp.open("POST", "/add", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

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
