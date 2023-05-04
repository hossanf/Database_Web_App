/*
    ---------------------------------------------------------------------------------------------------------------    
    CODE CITATIONS
    This code has been adapted from the CS340 Node.JS Starter Guide
    Date Accessed: 11/1/2022
    URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
    ---------------------------------------------------------------------------------------------------------------
*/


/*
    ---------------------------------------------------------------------------------------------------------------    
    SETUP
    ---------------------------------------------------------------------------------------------------------------
*/

// Express
var express = require('express');
var app = express();
PORT = 1240;

// app.js

const {engine} = require('express-handlebars');
  var exphbs = require('express-handlebars'); // Import express-handlebars
  app.engine('.hbs', engine({
    extname: ".hbs"
  })); // Create an instance of the handlebars engine to process templates
  app.set('view engine', '.hbs'); // Tell express to use the handlebars engine whenever it encounters a *.hbs file.
  
  // Database
  var db = require('./database/db-connector')
  
  // app.js - SETUP section
  app.use(express.json())
  app.use(express.urlencoded({
    extended: true
  }))

  //app.use(express.static('public'))
  app.use(express.static(__dirname + '/public')); // this is needed to allow for the form to use the ccs style sheet
  
/*
    ---------------------------------------------------------------------------------------------------------------
    GET ROUTES
    ---------------------------------------------------------------------------------------------------------------
*/

// Get for home index page
app.get('/', function(req, res)
    {  
        res.render('index')                                                  
    });                                                         


// Get data for Bands page
app.get('/bands.hbs', function(req, res)
{  
    let query1 = "SELECT * FROM bands;";                    // Define our query

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('bands', {data: rows});                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});                                                         // received back from the query


// Get data for Albums page
app.get('/albums.hbs', function(req, res)
{  
    /*
    * Source for SQL Date Format
    * Date Accessed: 11/14/2022
    * Based on W3 School MySQL DATE_FORMAT
    * Website: https://www.w3schools.com/sql/func_mysql_date_format.asp
    */
    let query1 = "SELECT albums.album_id, bands.band_name, albums.album_name, DATE_FORMAT(albums.release_date, '%Y %b %d') as release_date FROM albums JOIN bands ON albums.band_id = bands.band_id;";       // Define our query
    let query2 = "SELECT * FROM bands;";

    db.pool.query(query1, function(error, rows, fields){    // Execute the query
        let albums = rows;                                  // Save the albums data

        db.pool.query(query2, (error, rows, fields) => {    // Execute the second query
            let bands = rows;                               // Save the bands data
            return res.render('albums', {data: albums, bands: bands});
        }); 
    });    
});                                                         

// Get data for Songs page
app.get('/songs.hbs', function(req, res)
{  
    let query1 = "SELECT songs.song_id, songs.song_name, songs.track_no, songs.monthly_streams, songs.total_streams, bands.band_name, albums.album_name FROM songs JOIN albums ON songs.album_id = albums.album_id JOIN bands ON albums.band_id = bands.band_id ORDER BY songs.song_id;";       
    let query2 = "SELECT * FROM albums;";

    db.pool.query(query1, function(error, rows, fields){    // Execute the query
        let songs = rows;                                   // Save the songs data

        db.pool.query(query2, (error, rows, fields) => {    // Execute the second query
            let albums = rows;                              // Save the bands data
            return res.render('songs', {data: songs, albums: albums});
        }); 
    });    
});                                                         

// Get data for Royalty Owners page
app.get('/owners.hbs', function(req, res)
{  
    let query1; 
    
    if (req.query.royalty_owner_name === undefined)
    {
        query1 = "SELECT royalty_owner_id AS 'ID', royalty_owner_name AS 'Owner_Name', royalty_owner_address AS 'Owner_Address', royalty_owner_city AS 'Owner_City', royalty_owner_state_abbr AS 'Owner_State', royalty_owner_zip As 'Owner_Zip' FROM royalty_owners;"
    }
    else                                                    // else query for search function
    {
        query1 = `SELECT royalty_owner_id AS 'ID', royalty_owner_name AS 'Owner_Name', royalty_owner_address AS 'Owner_Address', royalty_owner_city AS 'Owner_City', royalty_owner_state_abbr AS 'Owner_State', royalty_owner_zip As 'Owner_Zip' FROM royalty_owners WHERE royalty_owner_name LIKE "${req.query.royalty_owner_name}%"`
    }
    db.pool.query(query1, function(error, rows, fields){    // Execute the query
        let royalty_owners = rows;
        return res.render('owners', {data: royalty_owners});                  
    })                                                      
});  

// Get data for Royalty Rates page
app.get('/rates.hbs', function(req, res)

{   // Queries for main table and dropdowns on royalty rates page
    let query1 = "SELECT royalty_rates.royalty_rate_id as 'ID', songs.song_name as 'Song_Name', royalty_owners.royalty_owner_name as 'Royalty_Owner', royalty_types.royalty_type_name as 'Royalty_Type', royalty_rates.royalty_rate as 'Royalty_Rate' FROM royalty_rates JOIN songs ON royalty_rates.song_id = songs.song_id JOIN royalty_owners ON royalty_rates.royalty_owner_id = royalty_owners.royalty_owner_id LEFT JOIN royalty_types ON royalty_rates.royalty_type_id = royalty_types.royalty_type_id ORDER BY royalty_rates.royalty_rate_id;";       
    let query2 = "SELECT song_id, song_name FROM songs;";
    let query3 = "SELECT royalty_owner_id, royalty_owner_name FROM royalty_owners;";
    let query4 = "SELECT royalty_type_id, royalty_type_name FROM royalty_types;";

    db.pool.query(query1, function(error, rows, fields){            // Execute the query
        let royalty_rates = rows;                                   // Save the royalty_rates data
        db.pool.query(query2, (error, rows, fields) => {            // Execute the second query
            let songs = rows;                                       // Save the songs data
            db.pool.query(query3, (error, rows, fields) => {        // Execute the third query
                let royalty_owners = rows;                          // Save the royalty owners data
                db.pool.query(query4, (error, rows, fields) => {    // Execute the fourth query
                    let royalty_types = rows;                       // Save the royalty_types
                    return res.render('rates', {data: royalty_rates, songs: songs, royalty_owners: royalty_owners, royalty_types: royalty_types});
                });
            });
        });        
    });    
});  

// Get data for Royalty Types page
app.get('/types.hbs', function(req, res)
{  
    let query1 = "SELECT royalty_type_id AS 'ID', royalty_type_name AS 'Royalty_Type' FROM royalty_types;";
    
    db.pool.query(query1, function(error, rows, fields){        // Execute the query
        let royalty_types = rows;
        return res.render('types', {data: royalty_types});                  
    })                                                      
});   

/*
    ---------------------------------------------------------------------------------------------------------------
    POST ROUTES
    ---------------------------------------------------------------------------------------------------------------
*/

// Add new Band
app.post('/add-band-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let band_name = parseInt(data['input-band_name']);

    // Create the query and run it on the database
    query1 = `INSERT INTO bands (band_name) VALUES ('${data['input-band_name']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bands and
        // presents it on the screen
        else
        {
            res.redirect('/bands.hbs');
        }
    })
})

// Add new Album
app.post('/add-album-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    console.log(data)
    // Capture NULL values
    let band_id = parseInt(data['input-band_id']);

    // Create the query and run it on the database
    query1 = `INSERT INTO albums (album_name, release_date, band_id) VALUES ('${data['input-album_name']}', '${data['input-release_date']}', ${band_id})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bands and
        // presents it on the screen
        else
        {
            res.redirect('/albums.hbs');
        }
    })
})

// Add new Song
app.post('/add-song-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let album_id = parseInt(data['input-album_id']);
    let track_no = parseInt(data['input-track_no']);
    let monthly_streams = parseInt(data['input-monthly_streams']);
    let total_streams = parseInt(data['input-total_streams']);

    if (isNaN(track_no))
    {
        track_no = 'NULL'
    }
    if (isNaN(monthly_streams))
    {
        monthly_streams = 'NULL'
    }
    if (isNaN(total_streams))
    {
        total_streams = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO songs (song_name, track_no, monthly_streams, total_streams, album_id) VALUES ('${data['input-song_name']}', ${track_no}, ${monthly_streams}, ${total_streams}, ${album_id})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bands and
        // presents it on the screen
        else
        {
            res.redirect('/songs.hbs');
        }
    })
})

// Add new Royalty Owner
app.post('/add-royalty_owners-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let royalty_owners_name = parseInt(data['input-royalty_type_name']);
    let royalty_owners_address = parseInt(data['input-royalty_owners_address']);
    let royalty_owners_city = parseInt(data['input-royalty_owners_city']);
    let royalty_owners_state = parseInt(data['input-royalty_owners_state']);
    let royalty_owners_zip = parseInt(data['input-royalty_owners_zip']);
 
    // Create the query and run it on the database
    query1 = `INSERT INTO royalty_owners (royalty_owner_name, royalty_owner_address, royalty_owner_city, royalty_owner_state_abbr, royalty_owner_zip) VALUES ('${data['input-royalty_owners_name']}', '${data['input-royalty_owners_address']}', '${data['input-royalty_owners_city']}', '${data['input-royalty_owners_state']}', '${data['input-royalty_owners_zip']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            res.redirect('/owners.hbs');
        }
    })  
});


// Add new Royalty Type
app.post('/add-royalty_type-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let royalty_type_name = parseInt(data['input-royalty_type-name']);
    if (isNaN(royalty_type_name))
    {
        royalty_type_name = null
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO royalty_types (royalty_type_name) VALUES ('${data['input-royalty_type-name']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            res.redirect('/types.hbs');
        }
    })  
});

// Add new Royalty Rate
app.post('/add-rate-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    
    // Capture NULL values
    let song_id = parseInt(data['input-song_id']);
    let royalty_owner_id = parseInt(data['input-royalty_owner_id']);
    let royalty_type_id = parseInt(data['input-royalty_type_id']);
    
    // royalty type is optional so make NULL if not a number
    if (isNaN(royalty_type_id))
    {
        royalty_type_id = null
    }
    
    // Create the query and run it on the database
    query1 = `INSERT INTO royalty_rates (song_id, royalty_owner_id, royalty_type_id, royalty_rate) VALUES ('${song_id}', '${royalty_owner_id}', ${royalty_type_id}, '${data['input-royalty_rate']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bands and
        // presents it on the screen
        else
        {
            res.redirect('/rates.hbs');
        }
    })
})

/*
    ---------------------------------------------------------------------------------------------------------------
    DELETE ROUTES
    ---------------------------------------------------------------------------------------------------------------
*/

// Delete Band
app.delete('/delete-band-ajax/', function(req,res,next){
    let data = req.body;
    let band_id = parseInt(data.band_id);
    let deleteBands = `DELETE FROM bands WHERE band_id = ?`;

          // Run the query
          db.pool.query(deleteBands, [band_id], function(error, rows, fields){
            if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
            else
            {
                res.sendStatus(204);
            }
        })
});


// Delete Royalty Owner
app.delete('/delete-royalty_owner', function(req,res,next){
    let data = req.body;
    let royalty_owner_id = parseInt(data.royalty_owner_id);
    let deleteRoyaltyOwner = `DELETE FROM royalty_owners WHERE royalty_owner_id = ?`;

            db.pool.query(deleteRoyaltyOwner, [royalty_owner_id], function(error, rows, fields){
                if (error) {

                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                console.log(royalty_owner_id);
                res.sendStatus(400);
                }

                else
                {
                res.sendStatus(204);
                }
})});

// Delete Royalty Type
app.delete('/delete-royalty_type', function(req,res,next){
    let data = req.body;
    let royalty_type_id = parseInt(data.royalty_type_id);
    let updateRoyaltyRates = 'UPDATE royalty_rates SET royalty_type_id = NULL WHERE royalty_type_id = ?;'
    let deleteRoyaltyType = `DELETE FROM royalty_types WHERE royalty_type_id = ?`;

            db.pool.query(deleteRoyaltyType, [royalty_type_id], function(error, rows, fields){
                if (error) {

                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
                }

                else
                {
                res.sendStatus(204);
                }
})});

// Delete Royalty Rate
app.delete('/delete-rate-ajax/', function(req,res,next){
    let data = req.body;
    let royalty_rate_id = parseInt(data.royalty_rate_id);
    let deleteRates = `DELETE FROM royalty_rates WHERE royalty_rate_id = ?`;

        db.pool.query(deleteRates, [royalty_rate_id], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            else
            {
            res.sendStatus(204);
            }
})});

/*
    ---------------------------------------------------------------------------------------------------------------
    PUT ROUTES
    ---------------------------------------------------------------------------------------------------------------
*/

// Update Band
app.put('/put-band-ajax', function(req,res,next){
    let data = req.body;
    let band_id = parseInt(data.band_id);

    let queryUpdateBand = `UPDATE bands SET band_name = ? WHERE bands.band_id = ?`;
    let queryBands = 'SELECT * FROM bands WHERE band_id = ?';

        // Run the 1st query
        db.pool.query(queryUpdateBand, [data['new_band_name'], band_id], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }
            // If there was no error, we run our second query and return that data so we can use it to update the bands's
            // table on the front-end
            else
            {
                // Run the second query
                db.pool.query(queryBands, [band_id], function(error, rows, fields) {
        
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
})});

// Update Royalty Owner
app.put('/put-royalty_owner-ajax', function(req,res,next){
    let data = req.body;
    let royalty_owner_id = parseInt(data.royalty_owner_id);

    let queryUpdateRoyaltyOwner = `UPDATE royalty_owners SET royalty_owner_name = ?, royalty_owner_address = ?, royalty_owner_city = ?, royalty_owner_state_abbr = ?, royalty_owner_zip = ? WHERE royalty_owner_id = ?;`;
    let queryRoyaltyOwners = `SELECT royalty_owner_id AS 'ID', royalty_owner_name AS 'Owner_Name', royalty_owner_address AS 'Owner_Address', royalty_owner_city AS 'Owner_City', royalty_owner_state_abbr AS 'Owner_State', royalty_owner_zip As 'Owner_Zip' FROM royalty_owners WHERE royalty_owner_id = ?`;

        // Run the 1st query
        db.pool.query(queryUpdateRoyaltyOwner, [data['new_royalty_owner_name'], data['new_royalty_owner_address'], data['new_royalty_owner_city'], data['new_royalty_owner_state'], data['new_royalty_owner_zip'], royalty_owner_id], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }
            // If there was no error, we run our second query and return that data so we can use it to update the bands's
            // table on the front-end
            else
            {
                // Run the second query
                db.pool.query(queryRoyaltyOwners, [royalty_owner_id], function(error, rows, fields) {
        
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
})});

// Update Royalty Rate
app.put('/put-royalty_rate-ajax', function(req,res,next){

    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    // song_name has the royalty_rate_id as its value
    let song_name = parseInt(data.song_name);

    // Capture NULL values
    let royalty_type = parseInt(data.royalty_type);
    // royalty type is optional so make NULL if not a number
    if (isNaN(royalty_type))
    {
        royalty_type = null
    }
    
    let queryUpdateRoyaltyRate = `UPDATE royalty_rates SET royalty_owner_id = ?, royalty_type_id = ?, royalty_rate = ? WHERE royalty_rate_id = ?;`;
    let query1 = "SELECT royalty_rates.royalty_rate_id as 'ID', songs.song_name as 'Song_Name', royalty_owners.royalty_owner_name as 'Royalty_Owner', royalty_types.royalty_type_name as 'Royalty_Type', royalty_rates.royalty_rate as 'Royalty_Rate' FROM royalty_rates JOIN songs ON royalty_rates.song_id = songs.song_id JOIN royalty_owners ON royalty_rates.royalty_owner_id = royalty_owners.royalty_owner_id LEFT JOIN royalty_types ON royalty_rates.royalty_type_id = royalty_types.royalty_type_id WHERE royalty_rate_id = ? ORDER BY royalty_rates.royalty_rate_id;";       
    
        // Run the 1st query
        db.pool.query(queryUpdateRoyaltyRate, [data['royalty_owner_name'], royalty_type, data['royalty_rate'], song_name], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }
            else
            {
                // Run the second query
                db.pool.query(query1, [song_name], function(error, rows, fields) {
                    
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                     
                })       
                
            }
})});



/*
    ---------------------------------------------------------------------------------------------------------------    
    LISTENER
    ---------------------------------------------------------------------------------------------------------------
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
