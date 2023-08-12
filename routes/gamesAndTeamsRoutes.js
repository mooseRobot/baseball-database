const express = require('express');
const router = express.Router();
const db = require('../database/db-connector');

router.get('/', (req, res) => {
    let query1;

    if (req.query.idgame === undefined)
    {
        query1 = `
                SELECT
                    games_idgame as game_id,
                    teams_teamname as team_name
                FROM games_has_teams;`;
    } else {
        query1 = `
                SELECT
                    games_idgame as game_id,
                    teams_teamname as team_name
                FROM games_has_teams
                WHERE games_idgame LIKE "${req.query.idgame}%";`;
    }

    // For delete statement
    let query2 = `
                SELECT
                    games_idgame as game_id
                FROM games_has_teams
                GROUP BY game_id`

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Save the people
        let gamesTeams = rows;
        
        // Run second query
        db.pool.query(query2, function(error, rows, fields) {
            let gameIds = rows;

            return res.render('gamesAndTeams', {data: gamesTeams, gameIds: gameIds});
        });
    });
});

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
