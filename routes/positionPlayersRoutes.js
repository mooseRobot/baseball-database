const express = require('express');
const router = express.Router();
const db = require('../database/db-connector');

router.get('/', function(req, res) {
    let query1;

    if (req.query.playername === undefined)
    {
        query1 = `
                SELECT
                    position_players.players_playername AS player_name,
                    position_players.position,
                    position_players.battingaverage AS batting_average,
                    position_players.homeruns, position_players.rbi
                FROM position_players
                INNER JOIN players ON position_players.players_playername = players.playername;`;
    } else {
        query1 = `
                SELECT
                    position_players.players_playername AS player_name,
                    position_players.position,
                    position_players.battingaverage AS batting_average,
                    position_players.homeruns, position_players.rbi
                FROM position_players
                INNER JOIN players ON position_players.players_playername = players.playername
                WHERE position_players.players_playername LIKE "${req.query.playername}%"`;
    }

    db.pool.query(query1, function(error, rows, fields){

        let players = rows;

        return res.render('positionPlayers', {data: players})
})});


module.exports = router;