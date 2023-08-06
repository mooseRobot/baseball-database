function deletePlayername(playername) {
  let link = '/players/delete-player-ajax/';
  let data = {
    id: playername
  };

  $.ajax({
    url: link,
    type: 'DELETE',
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
    success: function(result) {
      deleteRow(playername);
    }
  });
}



function deletePlayername(playername) {
  // Put our data we want to send in a javascript object
  let data = {
      id: playername
  };

  // Setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "/players/delete-player-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Tell our AJAX request how to resolve
  xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 204) {

          // Add the new data to the table
          deleteRow(playername);

      }
      else if (xhttp.readyState == 4 && xhttp.status != 204) {
          console.log("There was an error with the input.")
      }
  }
  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));
}

function deleteRow(playername){
    let table = document.getElementById("players-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == playername) {
            table.deleteRow(i);
            break;
       }
    }
}






