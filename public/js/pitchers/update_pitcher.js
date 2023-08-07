// Get the objects we need to modify
let updatePitcherForm = document.getElementById('update-pitcher-form');

// Modify the objects we need
updatePitcherForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputIdPitcher = document.getElementById("mySelect")
    let inputInnings = document.getElementById("input-innings-update");
    let inputEra = document.getElementById("input-era-update");

    // Get the values from the form fields
    let idPitcherValue = inputIdPitcher.value;
    let inningsValue = inputInnings.value;
    let eraValue = inputEra.value;
    
    // currently the database table for database does not allow updating values to NULL
    // so we must abort if being bassed NULL for age, pitcher, retured, and freeagent

    if (isNaN(eraValue)) {
        return;
    } else if (isNaN(inningsValue)) {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        idpitcher: idPitcherValue,
        innings: inningsValue,
        era: eraValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/pitchers/update", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, idPitcherValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, idpitcher){
    let parsedData = JSON.parse(data);
    console.log(parsedData)
    let table = document.getElementById("pitchers-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == idpitcher) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get values of pitchers
            let innings = updateRowIndex.getElementsByTagName("td")[2];
            let era = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign values
            innings.innerHTML = parsedData[0].inningspitched;
            era.innerHTML = parsedData[0].earnedrunsaverage;
       }
    }
}
