DROP TABLE IF EXISTS TeamMatchEntry;

CREATE TABLE IF NOT EXISTS TeamMatchEntry(
  eventKey text NOT NULL,
  matchLevel text CHECK(matchLevel IN ('QUALIFICATION', 'PLAYOFF')) NOT NULL,
  matchNumber integer NOT NULL,
  teamNumber integer NOT NULL,
  alliance text CHECK(alliance IN ('Red', 'Blue')) NOT NULL,
  robotNumber integer CHECK(robotNumber IN (1, 2)) NOT NULL,
  deviceTeamNumber integer NOT NULL,
  deviceId text NOT NULL,
  scoutTeamNumber integer NOT NULL,
  scoutName text NOT NULL,
  flag text NOT NULL,

  noShow boolean NOT NULL,
  died boolean,
  comments text,

  autoNetZoneSamp integer,
  autoLowBasketSamp integer,
  autoHighBasketSamp integer,
  autoLowChamberSpec integer,
  autoHighChamberSpec integer,
  autoObservationZone boolean,
  autoL1Climb boolean,

  teleopNetZoneSamp integer,
  teleopLowBasketSamp integer,
  teleopHighBasketSamp integer,
  teleopLowChamberSpec integer,
  teleopHighChamberSpec integer,

  endgameObservationZone boolean,
  endgameL1Climb boolean,
  endgameL2Climb boolean,
  endgameL3Climb boolean,

  PRIMARY KEY (eventKey, matchLevel, matchNumber, alliance, robotNumber, deviceTeamNumber, deviceId)
);

DROP TABLE IF EXISTS Users;

CREATE TABLE IF NOT EXISTS Users(
  username text UNIQUE PRIMARY KEY NOT NULL,
  permLevel text CHECK(permLevel IN ('none', 'demo', 'team', 'datamanage', 'admin')) DEFAULT 'team',
  teamNumber integer NOT NULL,
  hashedPassword text NOT NULL
);


DROP TABLE IF EXISTS Matches;
DROP TABLE IF EXISTS Events;

CREATE TABLE IF NOT EXISTS Events(
  eventKey text PRIMARY KEY NOT NULL,
  eventName text NOT NULL
);

CREATE TABLE IF NOT EXISTS Matches(
  eventKey text NOT NULL,
  matchLevel text CHECK(matchLevel IN ('QUALIFICATION', 'PLAYOFF')) NOT NULL,
  matchNumber integer NOT NULL,
  red1 integer NOT NULL,
  red2 integer NOT NULL,
  blue1 integer NOT NULL,
  blue2 integer NOT NULL,
  PRIMARY KEY (eventKey, matchLevel, matchNumber),
  FOREIGN KEY(eventKey) REFERENCES Events(eventKey)
);
