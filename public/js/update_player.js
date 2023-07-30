
// Get the objects we need to modify
let updatePlayerForm = document.getElementById('update-player-form-ajax');

// Modify the objects we need
updatePlayerForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputPlayerName = document.getElementById("mySelect")
    let inputTeamName = document.getElementById("input-teamname-update");
    let inputAge = document.getElementById("input-age-update");
    let inputIsPitcher = document.getElementById("input-ispitcher-update");
    let inputIsRetired = document.getElementById("input-isretired-update");
    let inputIsFreeAgent = document.getElementById("input-isfreeagent-update")


    // Get the values from the form fields
    let playerNameValue = inputPlayerName.value;
    let teamNameValue = inputTeamName.value;
    let ageValue = inputAge.value;
    let isPitcherValue = inputIsPitcher.value;
    let isRetiredValue = inputIsRetired.value;
    let isFreeAgentValue = inputIsFreeAgent.value;

    
    // currently the database table for database does not allow updating values to NULL
    // so we must abort if being bassed NULL for age, pitcher, retured, and freeagent

    if (isNaN(ageValue)) {
        return;
    } else if (isNaN(isPitcherValue)) {
        return;
    } else if (isNaN(isRetiredValue)) {
        return;
    } else if (isNaN(isFreeAgentValue)) {
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        playername: playerNameValue,
        teamname: teamNameValue,
        age: ageValue,
        ispitcher: isPitcherValue,
        isretired: isRetiredValue,
        isfreeagent: isFreeAgentValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-player-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, fullNameValue);

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

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].name; 
       }
    }
}
