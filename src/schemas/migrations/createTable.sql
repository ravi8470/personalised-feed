--Users Table

CREATE TABLE users (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    topics integer[],
    email VARCHAR(40)
);

--Topics Table

CREATE TABLE topics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50)
);

--Articles Table

CREATE TABLE articles(
id SERIAL PRIMARY KEY,
url VARCHAR NOT NULL,
title VARCHAR,
topic_id INTEGER REFERENCES topics(id)
);

--Sources Table
--Will contain URLs from which feed topics' data is fetched.
-- CREATE TABLE sources(
--     id SERIAL PRIMARY KEY,
--     name VARCHAR NOT NULL UNIQUE,
--     baseURL VARCHAR, --baseURL for api calls.
--     topic_ids integer[] --which all topics this source can serve
-- );

--Populating TOpics table
INSERT INTO topics(name) VALUES ('javascript'), ('coding'), ('Economics'), ('marketing'), ('environment'), ('history'), ('law'), ('math'),('Space'),('pokemon');

--Changing article_id to string so reddit ids can be used
ALTER TABLE articles ALTER COLUMN id TYPE VARCHAR;
ALTER TABLE articles ALTER COLUMN id DROP DEFAULT;--removing the auto-inc due to using the SERIAL type