const express = require('express');
const router = express.Router();
const db = require('../database/db-connector');

router.get('/', function(req, res) {
    return res.render('positionPlayers')
})

module.exports = router;