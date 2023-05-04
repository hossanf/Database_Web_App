/*
    ---------------------------------------------------------------------------------------------------------------    
    CODE CITATIONS
    This code has been adapted from the CS340 Node.JS Starter Guide
    Date Accessed: 11/1/2022
    URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data
    ---------------------------------------------------------------------------------------------------------------
*/

// Get the objects we need to modify
let updateRoyaltyOwnerForm = document.getElementById("update-royalty_rate-ajax");

// Modify the objects we need
updateRoyaltyOwnerForm.addEventListener('submit', function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputSongName = document.getElementById("select-song_name");
    let inputRoyaltyOwnerName = document.getElementById('select-royalty_owner');
    let inputRoyaltyType = document.getElementById('select-royalty_type');
    let inputRoyaltyRate = document.getElementById('update-royalty_rate');
  
    // Get the values from the form fields
    let SongNameValue = inputSongName.value;
    let RoyaltyOwnerValue = inputRoyaltyOwnerName.value;
    let RoyaltyTypeValue = inputRoyaltyType.value;
    let RoyaltyRateValue = inputRoyaltyRate.value;

    
    // Put our data we want to send in a javascript object
    //song_name has the royalty_rate_id as its value
    let data = {
        song_name: SongNameValue,
        royalty_owner_name: RoyaltyOwnerValue,
        royalty_type: RoyaltyTypeValue,
        royalty_rate: RoyaltyRateValue
      }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-royalty_rate-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, SongNameValue);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})

function updateRow(data, ID){
    let parsedData = JSON.parse(data);

    let table = document.getElementById('rates-table');

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute('data-value') == ID) {

            // Get the location of the row where we found the matching song ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of song_name value

            let ownerNameTD = updateRowIndex.getElementsByTagName("td")[2];
            let ownerTypeTD = updateRowIndex.getElementsByTagName("td")[3];
            let royaltyRateTD = updateRowIndex.getElementsByTagName("td")[4];

            // Reassign the values to our values we updated to

            ownerNameTD.innerHTML = parsedData[0].Royalty_Owner;
            ownerTypeTD.innerHTML = parsedData[0].Royalty_Type;
            royaltyRateTD.innerHTML = parsedData[0].Royalty_Rate;
       }
    }
}


