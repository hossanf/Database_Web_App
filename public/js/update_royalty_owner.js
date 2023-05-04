/*
    ---------------------------------------------------------------------------------------------------------------    
    CODE CITATIONS
    This code has been adapted from the CS340 Node.JS Starter Guide
    Date Accessed: 11/1/2022
    URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data
    ---------------------------------------------------------------------------------------------------------------
*/



// Get the objects we need to modify
let updateRoyaltyOwnerForm = document.getElementById("update-royalty_owner-ajax");

// Modify the objects we need
updateRoyaltyOwnerForm.addEventListener('submit', function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputRoyaltyOwnerId = document.getElementById("mySelect");
    let inputNewRoyaltyOwnerName = document.getElementById('input-royalty_owner-name-update');
    let inputNewRoyaltyOwnerAddress = document.getElementById('input-royalty_owners_address-update');
    let inputNewRoyaltyOwnerCity = document.getElementById('input-royalty_owners_city-update');
    let inputNewRoyaltyOwnerState = document.getElementById('input-royalty_owners_state-update');
    let inputNewRoyaltyOwnerZip = document.getElementById('input-royalty_owners_zip-update');

    // Get the values from the form fields
    let RoyaltyOwnerIdValue = inputRoyaltyOwnerId.value;
    let RoyaltyOwnerNameValue = inputNewRoyaltyOwnerName.value;
    let RoyaltyOwnerAddressValue = inputNewRoyaltyOwnerAddress.value;
    let RoyaltyOwnerCityValue = inputNewRoyaltyOwnerCity.value;
    let RoyaltyOwnerStateValue = inputNewRoyaltyOwnerState.value;
    let RoyaltyOwnerZipValue = inputNewRoyaltyOwnerZip.value;
    
    // Put our data we want to send in a javascript object
    let data = {
        royalty_owner_id: RoyaltyOwnerIdValue,
        new_royalty_owner_name: RoyaltyOwnerNameValue,
        new_royalty_owner_address: RoyaltyOwnerAddressValue,
        new_royalty_owner_city: RoyaltyOwnerCityValue,
        new_royalty_owner_state: RoyaltyOwnerStateValue,
        new_royalty_owner_zip: RoyaltyOwnerZipValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-royalty_owner-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, RoyaltyOwnerIdValue);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})

function updateRow(data, royalty_owner_id){
    let parsedData = JSON.parse(data);

    let table = document.getElementById('royalty_owners-table');

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute('data-value') == royalty_owner_id) {

            // Get the location of the row where we found the matching band ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of band_name value
            let nameTD = updateRowIndex.getElementsByTagName("td")[1];
            let addressTD = updateRowIndex.getElementsByTagName("td")[2];
            let cityTD = updateRowIndex.getElementsByTagName("td")[3];
            let stateTD = updateRowIndex.getElementsByTagName("td")[4];
            let zipTD = updateRowIndex.getElementsByTagName("td")[5];

            // Reassign band_name to our value we updated to
            nameTD.innerHTML = parsedData[0].Owner_Name; 
            addressTD.innerHTML = parsedData[0].Owner_Address;
            cityTD.innerHTML = parsedData[0].Owner_City;
            stateTD.innerHTML = parsedData[0].Owner_State;
            zipTD.innerHTML = parsedData[0].Owner_Zip;
       }
    }
}


