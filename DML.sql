-- Query for add a new character functionality with colon : character being used to 
-- denote the variables that will have data from the backend programming language


-- Drop down queries
SELECT playername FROM players

----------------------
-- Teams page
----------------------
-- Get all teamnames, location, games won and lost for the Teams page
SELECT teamname AS team_name, location, gameswon AS games_won, gameslost AS games_lost FROM teams;

-- Add a new team
INSERT INTO teams (teamname, location, gameswon, gameslost) VALUES
(:teamnameInput, :locationInput, :gameswonInput, :gameslostInput);

-- Update a team
UPDATE teams
SET gameswon = :gameswonInput, gameslost = :gameslostInput
WHERE teams.teamname = ':teamnameInput'

-- Delete a team
DELETE FROM teams WHERE teamname = :teamnameInput;


----------------------
-- Players page
----------------------
-- Get all players for players page
-- CASE WHEN from here https://stackoverflow.com/questions/6008519/convert-bit-type-to-yes-or-no-by-query-sql-server-2005
SELECT
	players.playername, 
    players.age, 
    CASE WHEN players.ispitcher = 1 THEN 'Yes' ELSE 'No' END AS ispitcher, 
    CASE WHEN players.isretired = 1 THEN 'Yes' ELSE 'No' END AS isretired, 
    CASE WHEN players.isfreeagent = 1 THEN 'Yes' ELSE 'No' END AS isfree_agent, 
    players.teams_teamname AS teamname
FROM players
INNER JOIN teams ON teamname = teams.teamname
GROUP BY playername
ORDER BY players.playername ASC;

-- Add a new player
INSERT INTO players (playername, age, ispitcher, isretired, isfreeagent, teams_teamname) VALUES
(:playernameInput, :ageInput, :ispitcherInput, :isretiredInput, :isfreeagentInput, :teamnameInput);

-- Update a player
UPDATE players
SET playername = :playernameInput, age = :ageInput, ispitcher = :ispitcherInput, isretired = :isretiredInput, isfreeagent = :isfreeagentInput, teams_teamname = IF(:teamnameInput = '', NULL, :teamnameInput)
WHERE playername = :playernameInput;

-- Delete a player
DELETE FROM players WHERE playername = :playernameInput;


----------------------
-- Pitchers page
----------------------
-- Get all pitchers
SELECT pitchers.idpitcher, pitchers.players_playername AS name, pitchers.inningspitched AS innings_pitched, pitchers.earnedrunsaverage AS earned_runs_average
FROM pitchers
INNER JOIN players ON pitchers.players_playername = players.playername;

-- Add a pitcher
INSERT INTO pitchers (inningspitched, earnedrunsaverage, players_idplayer) VALUES
(:inningspitchedInput, :earnedrunsaverageInput, :players_playernameInput);

-- Update a pitcher
UPDATE pitchers
SET inningspitched = :inningspitchedInput, earnedrunsaverage = :earnedrunsaverageInput, players_playername = IF(:players_playernameInput = '', NULL, :players_playernameInput)
WHERE players_playername = :players_playernameInput

-- Delete a pitcher
DELETE FROM pitchers WHERE players_playername = :players_playernameInput


----------------------
-- Position Players page
----------------------
-- Get all position players and their position
SELECT position_players.players_playername AS player_name, position_players.position, position_players.battingaverage AS batting_average, position_players.homeruns, position_players.rbi
FROM position_players
INNER JOIN players ON position_players.players_playername = players.playername;

-- Add a position player
INSERT INTO position_players (position, battingaverage, homeruns, rbi, players_idplayer) VALUES
(:positionInput, :battingaverageInput, :homerunsInput, :rbiInput, :players_playernameInput);

-- Update a position player
UPDATE position_players
SET position = :positionInput, battingaverage = :battingaverageInput, homeruns = :homerunsInput, rbi = :rbiInput, players_playername = IF(:players_playernameInput = '', NULL, :players_playernameInput)
WHERE players_playername = :players_playernameInput;

-- Delete a position player
DELETE FROM position_players WHERE players_playername = :players_playernameInput;


----------------------
-- Games page
----------------------
-- Get all teams that played in games
SELECT games.idgame, winning.teamname AS winning_team, losing.teamname AS losing_team, games.winningscore AS winning_score, games.losingscore AS losing_score, games.location
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
SELECT coaches.idcoach, coaches.coachname AS coach_name, coaches.yearscoached AS years_coached, coaches.championshipswon AS championships_won, teams.teamname AS team_name
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