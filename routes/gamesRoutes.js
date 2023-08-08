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

    let query2 = "SELECT * FROM teams;";


    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Save the people
        let games = rows;

        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
    
            // Save the teams
            let teams = rows;

            return res.render('games', {data: games, teams: teams});
        })
    })
});


router.post('/add', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let winningscore = parseInt(data['input-winningscore']);
    winningscore = isNaN(winningscore) ? 'NULL' : winningscore;

    let losingscore = parseInt(data['input-losingscore']);
    losingscore = isNaN(losingscore) ? 'NULL' : losingscore;

    // Construct first query
    query1 =    `INSERT INTO games (winningteam, losingteam, winningscore, losingscore, location) VALUES 
                ((SELECT teamname FROM teams WHERE teamname='${data['input-winningteam']}'), 
                (SELECT teamname FROM teams WHERE teamname='${data['input-losingteam']}'), 
                '${data['input-winningscore']}', '${data['input-losingscore']}', '${data['input-location']}')`;

    // Execute first query
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

            // Find the game we inserted and get the game id
            query2 = `
                    SELECT idgame
                    FROM games
                    WHERE (winningteam = '${data['input-winningteam']}' AND losingteam = '${data['input-losingteam']}' AND winningscore = '${data['input-winningscore']}' AND losingscore = '${data['input-losingscore']}')`;

            db.pool.query(query2, function(error, rows, field) {
                // Add games and teams to intersection table
                let games = rows
                let gamesID = games[0].idgame

                if (error) {
                    console.log(error)
                    res.sendStatus(400)
                
                } else {

                    // Add winning team
                    query3 = `INSERT INTO games_has_teams ( games_idgame, teams_teamname ) VALUES 
                    ('${gamesID}', (SELECT teamname FROM teams WHERE teamname='${data['input-winningteam']}' ) )`

                    db.pool.query(query3, function(error, rows, fields) {
                        if (error) {
                            console.log(error)
                            res.sendStatus(400);

                        } else {
                            // Add losing team
                            query4 = `INSERT INTO games_has_teams ( games_idgame, teams_teamname ) VALUES 

                            ('${gamesID}', (SELECT teamname FROM teams WHERE teamname='${data['input-losingteam']}' ) )`
                            db.pool.query(query4, function(error, rows, fields) {
                                if (error) {
                                    console.log(error);
                                    res.sendStatus(400);
                                } else {
                                    res.redirect('/games')
                            }});
                    }});
            }});
    }})
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

router.delete('/delete', function(req, res, next) {
    let data = req.body;
    let idgame = data.id;
    let queryDeleteGame = 'DELETE FROM games WHERE idgame = ?';
    db.pool.query(queryDeleteGame, [idgame], function(error, rows, field) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        };
    });
});

module.exports = router;

