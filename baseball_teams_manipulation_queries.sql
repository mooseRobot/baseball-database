-- Query for add a new character functionality with colon : character being used to 
-- denote the variables that will have data from the backend programming language


-- Drop down queries
SELECT playername FROM players

----------------------
-- Teams page
----------------------
-- Get all teamnames, location, games won and lost for the Teams page
SELECT teamname, location, gameswon, gameslost FROM teams;

-- Add a new team
INSERT INTO teams (teamname, location, gameswon, gameslost) VALUES
(:teamnameInput, :locationInput, :gameswonInput, :gameslostInput);

-- Update a team
UPDATE teams
SET teamname = :teamnameInput, location = :locationInput, gameswon = :gameswonInput, gameslost = :gameslostInput;

-- Delete a team
DELETE FROM teams WHERE teamname = :teamnameInput;


----------------------
-- Players page
----------------------
-- Get all players for players page
SELECT players.playername, players.age,  players.ispitcher, players.isretired, players.isfreeagent, players.teams_teamname AS teamname
FROM players
INNER JOIN teams ON teamname = teams.teamname
GROUP BY playername
ORDER BY players.playername ASC;

-- Add a new player
INSERT INTO players (playername, age, ispitcher, isretired, isfreeagent, teams_teamname) VALUES
(:playernameInput, :ageInput, :ispitcherInput, :isretiredInput, :isfreeagentInput, :teamnameInput);

-- Update a player
UPDATE players
SET playername = :playernameInput, age = :ageInput, ispitcher = :ispitcherInput, isretired = :isretiredInput, isfreeagent = :isfreeagentInput, teams_teamname = :teamnameInput
WHERE playername = :playernameInput;

-- Delete a player
DELETE FROM players WHERE playername = :playernameInput;


----------------------
-- Pitchers page
----------------------
-- Get all pitchers
SELECT pitchers.idpitcher, pitchers.players_playername, pitchers.inningspitched, pitchers.earnedrunsaverage
FROM pitchers
INNER JOIN players ON pitchers.players_playername = players.playername;


-- Add a pitcher
INSERT INTO pitchers (inningspitched, earnedrunsaverage, players_idplayer) VALUES
(:inningspitchedInput, :earnedrunsaverageInput, :players_playernameInput);

-- Update a pitcher
UPDATE pitchers
SET inningspitched = :inningspitchedInput, earnedrunsaverage = :earnedrunsaverageInput
WHERE players_playername = :players_playernameInput

-- Delete a pitcher
DELETE FROM pitchers WHERE players_playername = :players_playernameInput


----------------------
-- Position Players page
----------------------
-- Get all position players and their position
SELECT position_players.players_playername, position_players.position, position_players.battingaverage, position_players.homeruns, position_players.rbi
FROM position_players
INNER JOIN players ON position_players.players_playername = players.playername;

-- Add a position player
INSERT INTO position_players (position, battingaverage, homeruns, rbi, players_idplayer) VALUES
(:positionInput, :battingaverageInput, :homerunsInput, :rbiInput, :players_playernameInput);

-- Update a position player
UPDATE position_players
SET position = :positionInput, battingaverage = :battingaverageInput, homeruns = :homerunsInput, rbi = :rbiInput
WHERE players_playername = :players_playernameInput;

-- Delete a position player
DELETE FROM position_players WHERE players_playername = :players_playernameInput;


----------------------
-- Games page
----------------------
-- Get all teams that played in games
SELECT games.idgame, winning.teamname AS winning_team, losing.teamname AS losing_team, games.winningscore, games.losingscore, games.location
FROM games
INNER JOIN teams AS winning ON games.winningteam = winning.teamname
INNER JOIN teams AS losing ON games.losingteam = losing.teamname;

-- Add new game
INSERT INTO games (winningteam, losingteam, winningscore, losingscore, location) VALUES
(:winningteamInput, :losingteamInput, :winningscoreInput, :losingscoreInput, :locationInput);

-- Update game
UPDATE games
SET winningteam = :winningteamInput, losingteam = :losingteamInput, winningscore = :winningscoreInput, losingscore = :losingscoreInput, location = :locationInput
WHERE idgame = :idgameInput;

-- Delete Game
DELETE FROM games WHERE idgame = :idgameInput;


----------------------
-- Coaches page
----------------------
-- Get all coaches
SELECT coaches.idcoach, coaches.coachname, coaches.yearscoached, coaches.championshipswon, teams.teamname
FROM coaches
INNER JOIN teams ON coaches.teams_teamname = teams.teamname
GROUP BY teamname
ORDER BY idcoach ASC;

-- Add a new coach
INSERT INTO coaches ( coachname, yearscoached, championshipswon, teams_teamname) VALUES
(:coachnameInput, :yearscoachedInput, :championshipswonInput, :teamnameInput)

-- Update coach
UPDATE coaches
SET coachname = :coachnameInput, yearscoached = :yearscoachedInput, championshipswon = :championshipswonInput
WHERE idcoach = :idcoachInput

-- Delete coach
DELETE FROM coaches WHERE idcoach = :idcoachInput


----------------------
-- games_has_team query
----------------------
-- Get gameid and teams that played
SELECT games.idgame, winning.teamname AS winning_team, losing.teamname AS losing_team
FROM games
INNER JOIN teams AS winning ON games.winningteam = winning.teamname
INNER JOIN teams AS losing ON games.losingteam = losing.teamname;

-- Add team and game
INSERT INTO games_has_teams ( games_idgame, teams_teamname ) VALUES
(:gamesidInput, :teamnameInput)