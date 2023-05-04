/*
    ---------------------------------------------------------------------------------------------------------------    
    CODE CITATIONS
    This code has been adapted from the CS340 Node.JS Starter Guide
    Date Accessed: 11/1/2022
    URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data
    ---------------------------------------------------------------------------------------------------------------
*/

// code using jQuery
function deleteThisRate(royalty_rate_id) {
    let link = '/delete-rate-ajax/';
    let data = {
      royalty_rate_id: royalty_rate_id
    };
    
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8"
    });
  }

