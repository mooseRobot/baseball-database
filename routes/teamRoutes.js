const express = require('express');
const router = express.Router();
const db = require('../database/db-connector');

router.get('/', (req, res) => {
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.teamname === undefined)
    {
        query1 = "SELECT * FROM teams;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT * FROM teams WHERE teamname LIKE "${req.query.teamname}%";`
    }

    // Query 2 is the same in both cases
    let query2 = "SELECT * FROM players;";

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Save the people
        let teams = rows;

        return res.render('teams', {data: teams, teams: teams});
        
        // Run the second query
        // - Felix note: We don't need query 2 because we're not selecting any players
        db.pool.query(query2, (error, rows, fields) => {
            
            // Save the planets
            let teams = rows;

            
        })
    })
});


router.post('/add', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let gameswon = parseInt(data['input-gameswon']);
    if (isNaN(gameswon))
    {
        gameswon = 'NULL'
    }

    let gameslost = parseInt(data['input-gameslost']);
    if (isNaN(gameslost))
    {
        gameslost = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO teams (teamname, location, gameswon, gameslost) VALUES ('${data['input-teamname']}', '${data['input-location']}', '${data['input-gameswon']}', '${data['input-gameslost']}')`;
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
            res.redirect('/teams');
        }
    })
});

router.delete('/delete', function(req,res,next){
    let data = req.body;
    let teamname = data.id;
    let deleteTeamname = `DELETE FROM teams WHERE teamname = ?`;
    db.pool.query(deleteTeamname, [teamname], function(error, rows, fields){
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


router.put('/update', function(req,res,next){
    let data = req.body;
    let teamname = data.teamname;
    let gameswon = parseInt(data.gameswon);
    let gameslost = parseInt(data.gameslost);
    
    let queryUpdateTeam = `UPDATE teams
                            SET gameswon = ?, 
                                gameslost = ?
                            WHERE teams.teamname = ?`;
    let selectTeam      = `SELECT * FROM teams WHERE teamname = ?`
    
            // Run the 1st query
            db.pool.query(queryUpdateTeam, [gameswon, gameslost, teamname], function(error, rows, fields){
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
                    db.pool.query(selectTeam, [teamname], function(error, rows, fields) {
    
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
