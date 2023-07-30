// Get the objects we need to modify
let addPlayerForm = document.getElementById('add-player-form-ajax');

// Modify the objects we need
addPlayerForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputPlayername = document.getElementById("input-playername");
    let inputAge = document.getElementById("input-age");
    let inputIsPitcher = document.getElementById("input-ispitcher");
    let inputIsRetired = document.getElementById("input-isretired");
    let inputIsFreeAgent = document.getElementById("input-isfreeagent");
    let inputTeamsTeamName = document.getElementById("input-teams_teamname-ajax")

    // Get the values from the form fields
    let playerNameValue = inputPlayername.value;
    let ageValue = inputAge.value;
    let isPticherValue = inputIsPitcher.value;
    let isRetiredValue = inputIsRetired.value;
    let isFreeAgentValue = inputIsFreeAgent.value;
    let teamsTeamnameValue = inputTeamsTeamName.value;

    // Put our data we want to send in a javascript object
    let data = {
        playername: playerNameValue,
        age: ageValue,
        ispitcher: isPticherValue,
        isretired: isRetiredValue,
        isfreeagent: isFreeAgentValue,
        teams_teamname: teamsTeamnameValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-player-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputPlayername.value = '';
            inputAge.value = '';
            inputIsPitcher.value = '';
            inputIsRetired.value = '';
            inputIsRetired.value = '';
            inputIsFreeAgent.value = '';
            inputTeamsTeamName.value = '';
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
    let currentTable = document.getElementById("players-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let playernameCell = document.createElement("TD");
    let ageCell = document.createElement("TD");
    let ispitcherCell = document.createElement("TD");
    let isretiredCell = document.createElement("TD");
    let isfreeagentCell = document.createElement("TD");
    let teams_teamnameCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");


    // Fill the cells with correct data
    playernameCell.innerText = newRow.playername;
    ageCell.innerText = newRow.age;
    ispitcherCell.innerText = newRow.ispitcher;
    isretiredCell.innerText = newRow.isretired;
    isfreeagentCell.innerText = newRow.isfreeagent;
    teams_teamnameCell.innerText = newRow.teams_teamname;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deletePerson(newRow.playername);
    };

    // Add the cells to the row 
    row.appendChild(playernameCell);
    row.appendChild(ageCell);
    row.appendChild(ispitcherCell);
    row.appendChild(isretiredCell);
    row.appendChild(isfreeagentCell);
    row.appendChild(teams_teamnameCell);

    row.appendChild(deleteCell);

    
    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);

    // step 8 code
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.fname + ' ' +  newRow.lname;
    option.value = newRow.id;
    selectMenu.add(option);
}