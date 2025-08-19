CREATE DATABASE GameTracker;

CREATE TABLE Users (
	user_id SERIAL PRIMARY KEY,
	user_username VARCHAR(20) NOT NULL,
	user_password VARCHAR(25) NOT NULL,
	user_email VARCHAR(50),
	user_image BYTEA
);

CREATE TABLE Games (
	game_id SERIAL PRIMARY KEY,
	game_name VARCHAR(50) NOT NULL,
	game_finished BOOLEAN DEFAULT FALSE,
	game_totalAchievements INT,
	game_achievementsEarned INT,
	game_image BYTEA,
	game_playTime VARCHAR(100),
	user_id INT,
	CONSTRAINT userNeeded
		FOREIGN KEY (user_id)
		REFERENCES	 Users (user_id)
		ON DELETE CASCADE
);