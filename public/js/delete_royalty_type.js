/*
    ---------------------------------------------------------------------------------------------------------------    
    CODE CITATIONS
    This code has been adapted from the CS340 Node.JS Starter Guide
    Date Accessed: 11/1/2022
    URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data
    ---------------------------------------------------------------------------------------------------------------
*/



function deleteRoyaltyType(royalty_type_id) {
  // Put our data we want to send in a javascript object
    let data = {
      royalty_type_id: royalty_type_id
    };

  // Setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "/delete-royalty_type", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Tell our AJAX request how to resolve
  xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 204) {

          // Add the new data to the table
          deleteRow(royalty_type_id);

      }
      else if (xhttp.readyState == 4 && xhttp.status != 204) {
          console.log("There was an error with the input.")
      }
  }
  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));
}


function deleteRow(royalty_type_id){

  let table = document.getElementById("royalty_types-table");
  for (let i = 0, row; row = table.rows[i]; i++) {
     //iterate through rows
     //rows would be accessed using the "row" variable assigned in the for loop
     if (table.rows[i].getAttribute("data-value") == royalty_type_id) {
          table.deleteRow(i);
          break;
     }
  }
}
