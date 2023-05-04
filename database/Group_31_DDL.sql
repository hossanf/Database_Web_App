-- Data Definition Queries


SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- --------------------------------------------------------
--
-- Table structure for table bands
--
CREATE OR REPLACE TABLE bands (
  band_id int(11) NOT NULL AUTO_INCREMENT,
  band_name varchar(45) NOT NULL,
  PRIMARY KEY (band_id)
);
--
-- --------------------------------------------------------
--
-- Table structure for table albums
--
CREATE OR REPLACE TABLE albums (
  album_id int(11) NOT NULL AUTO_INCREMENT,
  album_name varchar(45) NOT NULL,
  release_date date,
  band_id int(11) NOT NULL,
  PRIMARY KEY (album_id),
  FOREIGN KEY (band_id) REFERENCES bands(band_id) ON DELETE CASCADE
);
--
-- --------------------------------------------------------
--
-- Table structure for table royalty_owners
--
CREATE OR REPLACE TABLE royalty_owners (
  royalty_owner_id int(11) NOT NULL AUTO_INCREMENT,
  royalty_owner_name varchar(145) NOT NULL,
  royalty_owner_address varchar(145) NOT NULL,
  royalty_owner_city varchar(45) NOT NULL,
  royalty_owner_state_abbr char(2) NOT NULL,
  royalty_owner_zip varchar(10) NOT NULL,
  PRIMARY KEY (royalty_owner_id)
);
--
-- --------------------------------------------------------
--
-- Table structure for table songs
--
CREATE OR REPLACE TABLE songs (
  song_id int(11) NOT NULL AUTO_INCREMENT,
  song_name varchar(145) NOT NULL,
  track_no int(11),
  monthly_streams int(11) DEFAULT 0,
  total_streams int(11) DEFAULT NULL,
  album_id int(11) NOT NULL,
  PRIMARY KEY (song_id),
  FOREIGN KEY (album_id) REFERENCES albums(album_id) ON DELETE CASCADE 
);
--
-- --------------------------------------------------------
--
-- Table structure for table royalty_types
--
CREATE OR REPLACE TABLE `royalty_types` (
  royalty_type_id int(11) NOT NULL AUTO_INCREMENT,
  royalty_type_name varchar(45) NOT NULL,
  PRIMARY KEY (royalty_type_id)
);
--
-- --------------------------------------------------------
--
-- Table structure for table royalty_rates
--
CREATE OR REPLACE TABLE royalty_rates (
  royalty_rate_id int(11) NOT NULL AUTO_INCREMENT,
  song_id int(11) NOT NULL,
  royalty_owner_id int(11) NOT NULL,
  royalty_type_id int(11) NULL,
  royalty_rate decimal(10,5) NOT NULL,
  PRIMARY KEY (royalty_rate_id),
  FOREIGN KEY (song_id) REFERENCES songs(song_id) ON DELETE CASCADE,
  FOREIGN KEY (royalty_owner_id) REFERENCES royalty_owners(royalty_owner_id) ON DELETE CASCADE,
  FOREIGN KEY (royalty_type_id) REFERENCES royalty_types(royalty_type_id) ON DELETE SET NULL ON UPDATE SET NULL
);
--
-- --------------------------------------------------------
--
-- Insert data to bands
--
INSERT INTO bands(band_name) 
VALUES
("Radiohead"),
("Modest Mouse"),
("Fleet Foxes");
--
-- --------------------------------------------------------
--
-- Insert data to albums
--
INSERT INTO albums(
    album_name,
    release_date,
    band_id
)
VALUES
("In Rainbows",
"2007-10-10",
(SELECT band_id FROM bands WHERE band_name = "Radiohead")),

("Good News for People Who Love Bad News",
"2004-04-06",
(SELECT band_id FROM bands WHERE band_name = "Modest Mouse")),

("Fleet Foxes",
"2008-06-03",
(SELECT band_id FROM bands WHERE band_name ="Fleet Foxes"));
--
-- --------------------------------------------------------
--
-- Insert data to songs
--
INSERT INTO songs(
    song_name,
    track_no,
    monthly_streams,
    album_id
)
VALUES
("15 Step", 1, 15,
(SELECT album_id FROM albums WHERE album_name = "In Rainbows")),
("Bodysnatchers", 2, 3,
(SELECT album_id FROM albums WHERE album_name = "In Rainbows")),
("Nude", 3, 10,
(SELECT album_id FROM albums WHERE album_name = "In Rainbows")),
("Weird Fishes/Arpeggi", 4, 11,
(SELECT album_id FROM albums WHERE album_name = "In Rainbows")),
("All I Need", 5, 5,
(SELECT album_id FROM albums WHERE album_name = "In Rainbows")),

("Horn Intro", 1, 7,
(SELECT album_id FROM albums WHERE album_name = "Good News for People Who Love Bad News")),
("The World at Large", 2, 23,
(SELECT album_id FROM albums WHERE album_name = "Good News for People Who Love Bad News")),
("Float On", 3, 51,
(SELECT album_id FROM albums WHERE album_name = "Good News for People Who Love Bad News")),
("Ocean Breathes Salty", 4, 33,
(SELECT album_id FROM albums WHERE album_name = "Good News for People Who Love Bad News")),
("Dig Your Grave", 5, 8,
(SELECT album_id FROM albums WHERE album_name = "Good News for People Who Love Bad News")),
("Bury Me with It", 6, 6,
(SELECT album_id FROM albums WHERE album_name = "Good News for People Who Love Bad News")),
("Dance Hall", 7, 14,
(SELECT album_id FROM albums WHERE album_name = "Good News for People Who Love Bad News")),
("Bukowski", 8, 13,
(SELECT album_id FROM albums WHERE album_name = "Good News for People Who Love Bad News")),

("Sun It Rises", 1, 11,
(SELECT album_id FROM albums WHERE album_name = "Fleet Foxes")),
("White Winter Hymnal", 2, 70,
(SELECT album_id FROM albums WHERE album_name = "Fleet Foxes")),
("Ragged Wood", 3, 63,
(SELECT album_id FROM albums WHERE album_name = "Fleet Foxes")),
("Tiger Mountain Peasant Song", 4, 22,
(SELECT album_id FROM albums WHERE album_name = "Fleet Foxes")),
("Quiet Houses", 5, 12,
(SELECT album_id FROM albums WHERE album_name = "Fleet Foxes"));
--
-- --------------------------------------------------------
--
-- Insert data to royalty_owners
--
INSERT INTO royalty_owners (
    royalty_owner_name,
    royalty_owner_address,
    royalty_owner_city,
    royalty_owner_state_abbr,
    royalty_owner_zip
)
VALUES (
    "Thom Yorke",
    "25 W 52nd St",
    "New York",
    "NY",
    "10019"
),
(
    "Robin Pecknold",
    "2130 7th Ave",
    "Seattle",
    "WA",
    "98121"
),
(
    "Isaac Brock",
    "1431 Hobart Road",
    "Issaquah",
    "WA",
    "98027"
),
(
    "Tom Peloso",
    "1433 Hobart Road",
    "Issaquah",
    "WA",
    "98027"
);
--
-- --------------------------------------------------------
--
-- Insert data to royalty_types
--
INSERT INTO royalty_types (royalty_type_name)
VALUES
	("Publisher"),
    ("Performing rights organization"),
    ("Mechanical rights agency"),
    ("Song Writer");
--
-- --------------------------------------------------------
--
-- Insert data to royalty_rates
--
INSERT INTO royalty_rates(
    song_id,
    royalty_owner_id,
    royalty_type_id,
    royalty_rate
)
VALUES
(
  (SELECT song_id FROM songs WHERE song_name = "15 Step"),
  (SELECT royalty_owner_id FROM royalty_owners WHERE royalty_owner_name = "Thom Yorke"),
  (SELECT royalty_type_id FROM royalty_types WHERE royalty_type_name = "Performing rights organization"),
  0.08
),
(
  (SELECT song_id FROM songs WHERE song_name = "All I Need"),
  (SELECT royalty_owner_id FROM royalty_owners WHERE royalty_owner_name = "Thom Yorke"),
  (SELECT royalty_type_id FROM royalty_types WHERE royalty_type_name = "Song Writer"),
  0.03
),
(
  (SELECT song_id FROM songs WHERE song_name = "Bukowski"),
  (SELECT royalty_owner_id FROM royalty_owners WHERE royalty_owner_name = "Isaac Brock"),
  (SELECT royalty_type_id FROM royalty_types WHERE royalty_type_name = "Song Writer"),
  0.05
),
(
  (SELECT song_id FROM songs WHERE song_name = "Bukowski"),
  (SELECT royalty_owner_id FROM royalty_owners WHERE royalty_owner_name = "Tom Peloso"),
  (SELECT royalty_type_id FROM royalty_types WHERE royalty_type_name = "Performing rights organization"),
  0.09
),
(
  (SELECT song_id FROM songs WHERE song_name = "White Winter Hymnal"),
  (SELECT royalty_owner_id FROM royalty_owners WHERE royalty_owner_name = "Robin Pecknold"),
  (SELECT royalty_type_id FROM royalty_types WHERE royalty_type_name = NULL),
  0.074
);
--
-- --------------------------------------------------------

SET FOREIGN_KEY_CHECKS=1;
COMMIT;
