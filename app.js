// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
PORT        = 10544;                 // Set a port number at the top so it's easy to change in the future


// app.js

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.



// Import route handlers
const homeRoutes = require('./routes/homeRoutes');
const teamRoutes = require('./routes/teamRoutes');
const playerRoutes = require('./routes/playerRoutes');
const pitchersRoutes = require('./routes/pitchersRoutes');
const positionPlayersRoutes = require('./routes/positionPlayersRoutes');
const gamesRoutes = require('./routes/gamesRoutes');

// Use the route handlers
app.use('/', homeRoutes);
app.use('/teams', teamRoutes);
app.use('/players', playerRoutes);
app.use('/pitchers', pitchersRoutes)
app.use('/positionplayers', positionPlayersRoutes);
app.use('/games', gamesRoutes);

/*
    LISTENER
*/
app.listen(PORT, function() {  // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});