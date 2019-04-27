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