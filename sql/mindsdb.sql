CREATE DATABASE supabase
WITH ENGINE = "postgres",
PARAMETERS = {
    "user": "user",
    "password": "password",
    "host": "localhost",
    "port": "5432",
    "database": "postgres"
};

CREATE PREDICTOR mindsdb.feedback_predictor
FROM supabase
  (SELECT content, classification FROM feedback)
PREDICT classification;
