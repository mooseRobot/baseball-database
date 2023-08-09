const express = require('express');
const router = express.Router();
const db = require('../database/db-connector');

// router.get('/', function(req, res) {
//     let query1;

//     if (req.query.players_playername === undefined)
//     {
//         query1 = `
//                 SELECT
//                     position_players.players_playername AS player_name,
//                     position_players.position,
//                     position_players.battingaverage AS batting_average,
//                     position_players.homeruns, position_players.rbi
//                 FROM position_players
//                 INNER JOIN players ON position_players.players_playername = players.playername;`;
//     } else {
//         query1 = `
//                 SELECT
//                     position_players.players_playername AS player_name,
//                     position_players.position,
//                     position_players.battingaverage AS batting_average,
//                     position_players.homeruns, position_players.rbi
//                 FROM position_players
//                 INNER JOIN players ON position_players.players_playername = players.playername
//                 WHERE position_players.players_playername LIKE "${req.query.players_playername}%"`;
//     }

//     db.pool.query(query1, function(error, rows, fields){

//         let players = rows;

//         return res.render('positionPlayers', {data: players})
// })});



router.get('/', function(req, res) {
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.position === undefined)
    {
        query1 = `
                SELECT * FROM position_players;
                `;
                
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1  =   `
                    SELECT * FROM position_players WHERE position LIKE "${req.query.position}%";`;
                    
    }

    // Query 2 is the same in both cases
    let query2  =   "SELECT * FROM teams;";

    // Query 3 selects all the pitchers
    let query3  =   `SELECT * FROM players 
                    LEFT JOIN position_players ON players.playername = position_players.players_playername
                    WHERE (players.ispitcher = 0);`;

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Save the people
        let position_players = rows;
        
        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
            
            // Save the teams
            let teams = rows;

            db.pool.query(query3, function(error, rows, fields) {

                let positionsFromPlayers = rows;

                return res.render('positionPlayers', {data: position_players, teams: teams, positionsFromPlayers: positionsFromPlayers});
            })
        })
    })
});











router.post('/add', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 =    `INSERT INTO position_players (position, battingaverage, homeruns, rbi, players_playername) VALUES
                ('${data['input-position']}', '${data['input-battingaverage']}', '${data['input-homeruns']}', '${data['input-rbi']}', '${data['input-players_playername']}')`;
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
            res.redirect('/positionPlayers');
        }
    })
})





module.exports = router;