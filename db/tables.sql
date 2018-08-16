DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS sources;
-- DROP TABLE IF EXISTS users;
-- DROP TABLE IF EXISTS posts;
-- DROP TABLE IF EXISTS friendships;
--
--
-- CREATE TABLE friendships (
--     id SERIAL PRIMARY KEY,
--     sender_id INT REFERENCES users(id),
--     receiver_id INT REFERENCES users(id),
--     status INT DEFAULT 1,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP
-- );
--
-- CREATE TABLE posts (
--     id SERIAL PRIMARY KEY,
--     sender_id INT REFERENCES users(id),
--     profile_pic VARCHAR(300),
--     first_name VARCHAR(100) NOT NULL,
--     last_name VARCHAR(100) NOT NULL,
--     receiver_id INT REFERENCES users(id),
--     post VARCHAR(300),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP
-- );

-- CREATE TABLE users (
-- id SERIAL PRIMARY KEY,
-- first_name VARCHAR(100) NOT NULL,
-- last_name VARCHAR(100) NOT NULL,
-- full_name VARCHAR(100) NOT NULL,
-- email VARCHAR(100) NOT NULL UNIQUE,
-- hashed_password VARCHAR(100) NOT NULL,
-- user_pic VARCHAR(300),
-- bio VARCHAR(300),
-- admin INT DEFAULT 0,
-- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

CREATE TABLE sources (
id SERIAL PRIMARY KEY,
source_name VARCHAR(100) NOT NULL,
source_pic VARCHAR(300),
source_contact_id INT NOT NULL REFERENCES users(id),
source_contact_name VARCHAR(300),
description VARCHAR(300),
total_hours NUMERIC,
sources_status VARCHAR(100) DEFAULT 'Draft',
creator_id INT NOT NULL REFERENCES users(id),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP
);

CREATE TABLE requests (
id SERIAL PRIMARY KEY,
requester_id INT NOT NULL REFERENCES users(id),
subject  VARCHAR(300),
business_questions VARCHAR(300),
preferred_source_id INT NOT NULL REFERENCES sources(id),
preferred_source_name VARCHAR(300),
preferred_analyst VARCHAR(300),
background_report VARCHAR(300),
severity_level VARCHAR(300),
requested_hours NUMERIC,
commited_hours NUMERIC,
actual_hours NUMERIC,
deadline VARCHAR(300),
request_status VARCHAR(300) DEFAULT 'draft',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP
);
