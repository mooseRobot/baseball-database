const express = require('express');
const router = express.Router();
const db = require('../database/db-connector');

router.get('/', (req, res) => {
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.idgame === undefined)
    {
        query1 = "SELECT * FROM games;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT * FROM games WHERE idgame LIKE "${req.query.idgame}%";`
    }

    // Query 2 is the same in both cases
    let query2 = "SELECT * FROM teams;";

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Save the people
        let games = rows;
    })
});


router.post('/add', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let winningscore = parseInt(data['input-winningscore']);
    if (isNaN(winningscore))
    {
        winningscore = 'NULL'
    }

    let losingscore = parseInt(data['input-losingscore']);
    if (isNaN(losingscore))
    {
        losingscore = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO games (winningteam, losingteam, winningscore, losingscore, location) VALUES ('${data['input-winningteam']}', '${data['input-losingteam']}', '${data['input-winningscore']}', '${data['input-losingscore']}', '${data['input-location']}'  )`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/games');
        }
    })
});


router.put('/update', function(req,res,next){
    let data = req.body;
    let idgame = (data.idgame);
    let winningscore = parseInt(data.winningscore);
    let losingscore = parseInt(data.losingscore);
    
    let queryUpdateGame = `UPDATE games
                            SET winningscore = ?, 
                                losingscore = ?
                            WHERE games.idgame = ?`;
    let selectGame      = `SELECT * FROM games WHERE idgame = ?`
    
            // Run the 1st query
            db.pool.query(queryUpdateGame, [winningscore, losingscore, idgame], function(error, rows, fields){
                if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
                }
    
                // If there was no error, we run our second query and return that data so we can use it to update the people's
                // table on the front-end
                else
                {
                    // Run the second query
                    db.pool.query(selectGame, [idgame], function(error, rows, fields) {
    
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.send(rows);
                        }
                    })
                }
    
    })});



module.exports = router;
