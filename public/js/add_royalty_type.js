/*
    ---------------------------------------------------------------------------------------------------------------    
    CODE CITATIONS
    This code has been adapted from the CS340 Node.JS Starter Guide
    Date Accessed: 11/1/2022
    URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data
    ---------------------------------------------------------------------------------------------------------------
*/


// Get the objects we need to modify
let addRoyaltyTypeForm = document.getElementById('add-royalty_type-form');

// Modify the objects we need
addRoyaltyTypeForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputRoyaltyType = document.getElementById("input-royalty_type-name");

    // Get the values from the form fields
    let RoyaltyTypeNameValue = inputRoyaltyType.value;

    // Put our data we want to send in a javascript object
    let data = {
        royalty_type_name: RoyaltyTypeNameValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-royalty_type-form", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputRoyaltyType.value = '';
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
    let currentTable = document.getElementById("royalty_types-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let royaltyTypeNameCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.royalty_type_id;
    royaltyTypeNameCell.innerText = newRow.royalty_type_name;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteRoyaltyType(newRow.royalty_type_id);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(royaltyTypeNameCell);
    row.appendChild(deleteCell);
  
    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.royalty_type_id);
   
    // Add the row to the table
    currentTable.appendChild(row);
}
