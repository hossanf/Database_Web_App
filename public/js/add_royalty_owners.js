/*
    ---------------------------------------------------------------------------------------------------------------    
    CODE CITATIONS
    This code has been adapted from the CS340 Node.JS Starter Guide
    Date Accessed: 11/1/2022
    URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data
    ---------------------------------------------------------------------------------------------------------------
*/

// Get the objects we need to modify
let addRoyaltyOwnersForm = document.getElementById('add-royalty_owners-form');

// Modify the objects we need
addRoyaltyOwnersForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("input-royalty_owners_name");
    let inputAddress = document.getElementById("input-royalty_owners_addresss");
    let inputCity = document.getElementById("input-royalty_owners_city");
    let inputState = document.getElementById("input-royalty_owners_state");
    let inputZip = document.getElementById("input-royalty_owners_zip");

    // Get the values from the form fields
    let RoyaltyOwnersNameValue = inputName.value;
    let RoyaltyOwnersAddressValue = inputAddress.value;
    let RoyaltyOwnersCityValue = inputCity.value;
    let RoyaltyOwnersStateValue  = inputState.value;
    let RoyaltyOwnersZipValue = inputZip.value;

    // Put our data we want to send in a javascript object
    let data = {
        royalty_owners_name: RoyaltyOwnersNameValue,
        royalty_owners_address: RoyaltyOwnersAddressValue,
        royalty_owners_city: RoyaltyOwnersCityValue,
        royalty_owners_state: RoyaltyOwnersStateValue,
        royalty_owners_zip: RoyaltyOwnersZipValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-royalty_owners-form", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputName.value = '';
            inputAddress.value = '';
            inputCity.value = '';
            inputState.value = '';
            inputZip.value = '';
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
    let currentTable = document.getElementById("royalty_owners-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let royaltyOwnersNameCell = document.createElement("TD");
    let royaltyOwnersAddressCell = document.createElement("TD");
    let royaltyOwnersStateCell= document.createElement("TD");
    let royaltyOwnersCityCell= document.createElement("TD");
    let royaltyOwnersZipCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.royalty_owners_id;
    royaltyOwnersNameCell.innerText = newRow.royalty_owners_name;
    royaltyOwnersAddressCell.innerText = newRow.royalty_owners_address;
    royaltyOwnersCityCell.innerText = newRow.royalty_owners_city;
    royaltyOwnersStateCell.innerText = newRow.royalty_owners_state;
    royaltyOwnersZipCell.innerText = newRow.royalty_owners_zip;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteRoyaltyOwner(newRow.royalty_owners_id);
    };


    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(royaltyOwnersNameCell);
    row.appendChild(royaltyOwnersAddressCell);
    row.appendChild(royaltyOwnersCityCell);
    row.appendChild(royaltyOwnersStateCell);
    row.appendChild(royaltyOwnersZipCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.royalty_owners_id);

    // Add the row to the table
    currentTable.appendChild(row);

    // Adding new data to the dropdown menu for updating Owners
    
    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.royalty_owners_name;
    option.value = newRow.royalty_owners_id;
    selectMenu.add(option);
    // End of new step 8 code.
}
