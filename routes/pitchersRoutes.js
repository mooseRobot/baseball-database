const express = require('express');
const router = express.Router();
const db = require('../database/db-connector');

router.get('/', function(req, res) {
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.playername === undefined)
    {
        query1 = `
                SELECT
                    pitchers.idpitcher,
                    pitchers.players_playername AS name,
                    pitchers.inningspitched AS innings_pitched,
                    pitchers.earnedrunsaverage AS earned_runs_average
                FROM pitchers
                INNER JOIN players ON pitchers.players_playername = players.playername;
                `;
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1  =   `
                    SELECT
                        pitchers.idpitcher,
                        pitchers.players_playername AS name,
                        pitchers.inningspitched AS innings_pitched,
                        pitchers.earnedrunsaverage AS earned_runs_average
                    FROM pitchers
                    INNER JOIN players ON pitchers.players_playername = players.playername 
                    WHERE playername LIKE "${req.query.playername}%";`
    }

    // Query 2 is the same in both cases
    let query2  =   "SELECT * FROM teams;";

    // Query 3 selects all the pitchers
    let query3  =   `SELECT * FROM players 
                    LEFT JOIN pitchers ON players.playername = pitchers.players_playername
                    WHERE (players.ispitcher = 1 and idpitcher IS Null);`;

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Save the people
        let pitchers = rows;
        
        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
            
            // Save the teams
            let teams = rows;

            db.pool.query(query3, function(error, rows, fields) {

                let pitchersFromPlayers = rows;

                return res.render('pitchers', {data: pitchers, teams: teams, pitchersFromPlayers: pitchersFromPlayers});
            })
        })
    })
});


router.post('/add', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 =    `INSERT INTO pitchers (inningspitched, earnedrunsaverage, players_playername) VALUES
                ('${data['input-innings']}', '${data['input-era']}', '${data['input-pitchername']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else {
            res.redirect('/pitchers');
        }
    })
})


router.put('/update', function(req,res,next) {
    let data = req.body;
    let idpitcher = data.idpitcher;
    let innings = parseFloat(data.innings);
    let era = parseFloat(data.era);

    let queryUpdatePitcher = `UPDATE pitchers
                            SET inningspitched = ?, earnedrunsaverage = ?
                            WHERE idpitcher = ?`;

    let selectPitchers =     `SELECT * FROM pitchers 
                            WHERE pitchers.idpitcher = ?`;

    // Run the 1st query
    db.pool.query(queryUpdatePitcher, [innings, era, idpitcher], function(error, rows, fields){
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
            db.pool.query(selectPitchers, [idpitcher], function(error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
})});


router.delete('/delete', function(req, res, next) {
    let data = req.body;
    let idpitcher = data.id;
    let queryDeletePitcher = `DELETE FROM pitchers WHERE idpitcher = ?`
    db.pool.query(queryDeletePitcher, [idpitcher], function(error, rows, fields){
        if (error) {
        console.log(error);
        res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
})});



module.exports = router;