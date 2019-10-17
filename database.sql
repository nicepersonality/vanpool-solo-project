-- Create a PostgreSQL database named `vanpool`
-- Run these queries in order to create the tables and relationships

-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
-- username will be an email address
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL,
    "full_name" VARCHAR (80) NOT NULL,
    "display_name" VARCHAR (20) NOT NULL,
-- phone numbers will be formatted and parsed by the app
    "cell" VARCHAR (20),
-- admin must manually grant access
    "access_level" INT DEFAULT 0
);

CREATE TYPE "e_wkday" AS ENUM (
-- We probably won't use Sat or Sun but they're still days of the week 
	'Sun',
	'Mon',
	'Tue',
	'Wed',
	'Thu',
	'Fri',
	'Sat'
);

CREATE TABLE "days" (
-- the day primary key will be integers of the form YYYYMMDD
-- e.g., 20191017; it will generated in-app, not by Postgres
	"id" INT UNIQUE NOT NULL PRIMARY KEY,
	"date" DATE UNIQUE NOT NULL,
-- redundant; these will be set/used directly by Moment.js
-- it's a bit belt-and-suspenders but it's much easier to query
	"year" INT NOT NULL,
	"month" INT NOT NULL,
	"week" INT NOT NULL,
	"weekday" e_wkday NOT NULL,
	"day" INT NOT NULL,
-- there can be only one driver per day
	"driver_id" INT REFERENCES "user"
);

CREATE TABLE "user_days" (
-- many-to-many junction table
	"id" SERIAL PRIMARY KEY,
-- form the junctions
	"user_id" INT REFERENCES "user",
	"days_id" INT REFERENCES "days",
-- is the given user riding and/or driving on the given day?
	"riding" BOOLEAN DEFAULT false,
	"driving" BOOLEAN DEFAULT false,
-- did they pay for gas?
	"gas_credit" FLOAT DEFAULT 0
);

CREATE TABLE "messages" (
	"id" SERIAL PRIMARY KEY,
	"content" TEXT NOT NULL,
-- a message is posted at a specific time
	"time" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
-- by a specific user
	"user_id" INT REFERENCES "user",
-- but can apply to a different date
	"days_id" INT REFERENCES "days"
);

CREATE TABLE "routes" (
-- store global variables related to a vanpool route
-- currently, the app only supports a single route per instance
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR (20) NOT NULL,
	"description" TEXT,
-- only needed if the app is tracking finances too
	"show_charge" BOOLEAN DEFAULT false,
	"ride_fee" FLOAT DEFAULT 0,
	"drive_credit" FLOAT DEFAULT 0,
	"max_fee" FLOAT,
	"min_fee" FLOAT
);
