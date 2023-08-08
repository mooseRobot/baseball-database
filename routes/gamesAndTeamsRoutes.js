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

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Save the people
        let gamesTeams = rows;

        return res.render('gamesAndTeams', {data: gamesTeams});
        
    })
});

module.exports = router;
