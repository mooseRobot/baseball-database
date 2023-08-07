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
            players.playername, 
            players.age, 
            CASE WHEN players.ispitcher = 1 THEN 'Yes' ELSE 'No' END AS ispitcher, 
            CASE WHEN players.isretired = 1 THEN 'Yes' ELSE 'No' END AS isretired, 
            CASE WHEN players.isfreeagent = 1 THEN 'Yes' ELSE 'No' END AS isfreeagent, 
            players.teams_teamname AS teamname
        FROM players
        INNER JOIN teams ON teamname = teams.teamname
        GROUP BY playername
        ORDER BY players.playername ASC;
        `;
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `
                SELECT
                    players.playername, 
                    players.age, 
                    CASE WHEN players.ispitcher = 1 THEN 'Yes' ELSE 'No' END AS ispitcher, 
                    CASE WHEN players.isretired = 1 THEN 'Yes' ELSE 'No' END AS isretired, 
                    CASE WHEN players.isfreeagent = 1 THEN 'Yes' ELSE 'No' END AS isfreeagent, 
                    players.teams_teamname AS teamname
                FROM players 
                WHERE playername LIKE "${req.query.playername}%";`
    }

    // Query 2 is the same in both cases
    let query2 = "SELECT * FROM teams;";

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Save the people
        let players = rows;
        
        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
            
            // Save the teams
            let teams = rows;

            return res.render('players', {data: players, teams: teams});
        })
    })
});

router.post('/add-player-ajax', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    // let homeworld = parseInt(data.homeworld);
    // if (isNaN(homeworld))
    // {
    //     homeworld = 'NULL'
    // }

    // let age = parseInt(data.age);
    // if (isNaN(age))
    // {
    //     age = 'NULL'
    // }

    // Create the query and run it on the database
    query1 = `INSERT INTO players (playername, age, ispitcher, isretired, isfreeagent, teams_teamname) VALUES ('${data.playername}', '${data.age}', '${data.ispitcher}', '${data.isretired}', '${data.isfreeagent}', '${data.teams_teamname}' )`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM players;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});


router.post('/add-player-form', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    // let gameswon = parseInt(data['input-gameswon']);
    // if (isNaN(gameswon))
    // {
    //     gameswon = 'NULL'
    // }

    // let gameslost = parseInt(data['input-gameslost']);
    // if (isNaN(gameslost))
    // {
    //     gameslost = 'NULL'
    // }

    // Create the query and run it on the database
    query1 = `INSERT INTO players (playername, age, ispitcher, isretired, isfreeagent, teams_teamname) VALUES ('${data['input-playername']}', '${data['input-age']}', '${data['input-ispitcher']}', '${data['input-isretired']}', '${data['input-isfreeagent']}', '${data['input-teams_teamname']}' )`;
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
            res.redirect('/players');
        }
    })
});


router.delete('/delete-player-ajax/', function(req,res,next) {
    let data = req.body;
    let playername = data.id;
    let deletePlayername = `DELETE FROM players WHERE playername = ?`;
    db.pool.query(deletePlayername, [playername], function(error, rows, fields){
        if (error) {
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
})});

router.put('/put-player-ajax', function(req,res,next) {
    let data = req.body;
    let playername = data.playername;
    let teamname = data.teamname;
    let age = parseInt(data.age);
    let ispitcher = parseInt(data.ispitcher);
    let isretired = parseInt(data.isretired);
    let isfreeagent = parseInt(data.isfreeagent)

    let queryUpdatePlayer = `UPDATE players
                            SET teams_teamname = IF(teams_teamname = '', NULL, ?),
                                age = ?,
                                ispitcher = ?,
                                isretired = ?,
                                isfreeagent = ?
                            WHERE playername = ?`;

    let selectPlayers =     `SELECT * FROM players 
                            WHERE players.playername = ?`;

    // Run the 1st query
    db.pool.query(queryUpdatePlayer, [teamname, age, ispitcher, isretired, isfreeagent, playername], function(error, rows, fields){
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
            db.pool.query(selectPlayers, [playername], function(error, rows, fields) {

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