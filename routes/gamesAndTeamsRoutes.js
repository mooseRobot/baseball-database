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

module.exports = router;
