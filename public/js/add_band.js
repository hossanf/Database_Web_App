/*
    ---------------------------------------------------------------------------------------------------------------    
    CODE CITATIONS
    This code has been adapted from the CS340 Node.JS Starter Guide
    Date Accessed: 11/1/2022
    URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
    ---------------------------------------------------------------------------------------------------------------
*/

// Get the objects we need to modify
let addBandForm = document.getElementById('add-band-form-ajax');

// Modify the objects we need
addBandForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputBandName = document.getElementById("input-band_name");

    // Get the values from the form fields
    let BandNameValue = inputBandName.value;

    // Put our data we want to send in a javascript object
    let data = {
        band_name: BandNameValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-band-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputBandName.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bands
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("bands-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let bandNameCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.band_id;
    bandNameCell.innerText = newRow.band_name;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(bandNameCell);
    row.appendChild(deleteCell);
  
    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.band_id);
    
    // Add the row to the table
    currentTable.appendChild(row);
}
