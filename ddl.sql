-- Liam Pestrella
-- Felix Gerard Pidlaoan
-- Project 2 Draft: Normalized Schema and DDL with Sample Data

-- Disable autocommit and FK check
SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- Create teams table. 
CREATE TABLE teams (
    teamname VARCHAR(55) NOT NULL,
    location VARCHAR(45) NOT NULL,
    gameswon int NOT NULL,
    gameslost int NOT NULL,
    PRIMARY KEY (teamname)
);

-- teams sample data
INSERT INTO teams (teamname, location, gameswon, gameslost) VALUES
('Rays', 'Tampa Bay', 58, 35),
('Guardians', 'Cleveland', 45, 45),
('Rangers', 'Texas', 52, 39),
('Braves', 'Atlanta', 60, 29),
('Reds', 'Cincinnati', 50, 41),
('Dodgers', 'Los Angeles', 51, 38),
('Padres', 'San Diego', 44, 48),
('Cardinals', 'St. Louis', 38, 53),
('Angels', 'Anaheim', 45, 47);


-- Create games table
CREATE TABLE games (
    idgame INT AUTO_INCREMENT NOT NULL,
    winningteam VARCHAR(45) NOT NULL,
    losingteam VARCHAR(45) NOT NULL,
    winningscore INT NOT NULL,
    losingscore INT NOT NULL,
    location VARCHAR(45) NOT NULL,
    PRIMARY KEY (idgame)
);

-- games sample data

INSERT INTO games (winningteam, losingteam, winningscore, losingscore, location)
VALUES ("Braves", "Dodgers", 4, 3, "Atlanta"),
("Rays", "Braves", 10, 4, "Tampa Bay"),
("Dodgers", "Reds", 6, 0, "Cincinnati");


-- Create games_has_teams intersection table
CREATE TABLE games_has_teams (
    games_idgame INT NOT NULL,
    teams_teamname VARCHAR(45) NOT NULL,
    FOREIGN KEY (games_idgame) REFERENCES games(idgame)
    ON DELETE CASCADE,
    FOREIGN KEY (teams_teamname) REFERENCES teams(teamname)
    ON DELETE CASCADE
);

-- games_has_teams sample data

INSERT INTO games_has_teams ( games_idgame, teams_teamname )
VALUES (1, (SELECT teamname FROM teams WHERE teamname="Dodgers" ) ),
( 2, (SELECT teamname FROM teams WHERE teamname="Rays" ) ),
( 3, (SELECT teamname FROM teams WHERE teamname="Reds" ) );





-- Create coaches table
CREATE TABLE coaches (
    idcoach INT AUTO_INCREMENT,
    coachname VARCHAR(45) NOT NULL,
    yearscoached INT NOT NULL,
    championshipswon INT NOT NULL,
    teams_teamname VARCHAR(45) NOT NULL,
    PRIMARY KEY (idcoach),
    FOREIGN KEY (teams_teamname) REFERENCES teams(teamname)
    ON DELETE CASCADE
);


-- coaches sample data

INSERT INTO coaches ( coachname, yearscoached, championshipswon, teams_teamname)
VALUES ("Dave Roberts", 8, 1, (SELECT teamname FROM teams WHERE teamname="Dodgers" )),
("Kevin Cash", 8, 0, (SELECT teamname FROM teams WHERE teamname="Rays" )),
("Brian Snitker", 7, 1, (SELECT teamname FROM teams WHERE teamname="Braves" ));



-- Create players table
CREATE TABLE players (
    playername VARCHAR(45) NOT NULL,
    age INT NOT NULL,
    ispitcher TINYINT(2) NOT NULL,
    isretired TINYINT(1) NOT NULL,
    isfreeagent TINYINT(1) NOT NULL,
    teams_teamname VARCHAR(45) NOT NULL,
    PRIMARY KEY (playername),
    FOREIGN KEY (teams_teamname) REFERENCES teams(teamname)
    ON DELETE CASCADE
);

-- players sample data
INSERT INTO players (playername, age, ispitcher, isretired, isfreeagent, teams_teamname) VALUES
('Blake Snell', 30, 1, 0, 0, (SELECT teamname FROM teams WHERE teamname="Padres")),
( 'Clayton Kershaw', 35, 1, 0, 0, (SELECT teamname FROM teams WHERE teamname="Dodgers")),
( 'Joe Musgrove', 30, 1, 0, 0, (SELECT teamname FROM teams WHERE teamname="Padres") ),
( 'Mookie Betts', 30, 0, 0, 0, (SELECT teamname FROM teams WHERE teamname="Dodgers")),
( 'Shohei Ohtani', 29, 2, 0, 0, (SELECT teamname FROM teams WHERE teamname="Angels")),
( 'Albert Pujols', 43, 0, 1, 0, (SELECT teamname FROM teams WHERE teamname="Cardinals"));


-- Create pitchers table
CREATE TABLE pitchers (
    idpitcher INT NOT NULL AUTO_INCREMENT,
    inningspitched FLOAT NOT NULL, 
    earnedrunsaverage FLOAT NOT NULL,
    players_playername VARCHAR(45) NOT NULL,
    PRIMARY KEY (idpitcher),
    FOREIGN KEY (players_playername) REFERENCES players(playername)
    ON DELETE CASCADE
);

-- pitchers sample data
INSERT INTO pitchers (inningspitched, earnedrunsaverage, players_playername) VALUES
( 98, 2.85, (SELECT playername FROM players WHERE playername="Blake Snell")),
( 79.1, 2.39, (SELECT playername FROM players WHERE playername="Joe Musgrove")),
( 95.1, 2.55, (SELECT playername FROM players WHERE playername="Clayton Kershaw")),
( 100.1, 3.32, (SELECT playername FROM players WHERE playername="Shohei Ohtani"));


-- Create position players table
CREATE TABLE position_players (
    position VARCHAR(45) NOT NULL,
    battingaverage FLOAT NOT NULL,
    homeruns INT NOT NULL,
    rbi INT NOT NULL,
    players_playername VARCHAR(45) NOT NULL,
    PRIMARY KEY (position),
    FOREIGN KEY (players_playername) REFERENCES players(playername)
    ON DELETE CASCADE
);

-- position players sample data

INSERT INTO position_players (position, battingaverage, homeruns, rbi, players_playername) 
VALUES ('right field', 0.276, 26, 62, (SELECT playername FROM players WHERE playername="Mookie Betts")),
('designated hitter', .296, 703, 2218,  (SELECT playername FROM players WHERE playername="Albert Pujols") ),
('n/a', .302, 32, 71, (SELECT playername FROM players WHERE playername="Shohei Ohtani"));


-- Turn FK check on and commit
SET FOREIGN_KEY_CHECKS=1;
COMMIT;


