/*
    ---------------------------------------------------------------------------------------------------------------    
    CODE CITATIONS
    This code has been adapted from the CS340 Node.JS Starter Guide
    Date Accessed: 11/1/2022
    URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data
    ---------------------------------------------------------------------------------------------------------------
*/


// Get the objects we need to modify
let updateBandForm = document.getElementById('update-band-form-ajax');

// Modify the objects we need
updateBandForm.addEventListener('submit', function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputBandId = document.getElementById('mySelect');
    let inputNewBandName = document.getElementById('input-band_name-update');

    // Get the values from the form fields
    let BandIdValue = inputBandId.value;
    let NewBandNameValue = inputNewBandName.value;
    
    // Put our data we want to send in a javascript object
    let data = {
        band_id: BandIdValue,
        new_band_name: NewBandNameValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-band-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, BandIdValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

function updateRow(data, band_id){
    let parsedData = JSON.parse(data);

    let table = document.getElementById('bands-table');

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute('data-value') == band_id) {

            // Get the location of the row where we found the matching band ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of band_name value
            let td = updateRowIndex.getElementsByTagName("td")[1];

            // Reassign band_name to our value we updated to
            td.innerHTML = parsedData[0].band_name; 
       }
    }
}


