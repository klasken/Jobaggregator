CREATE TABLE offres (
    id INT PRIMARY KEY NOT NULL,
    title TEXT,
    description TEXT,
    company TEXT,
    location TEXT,
    contract_type TEXT,
    date DATE,
    salary TEXT,
    duration int,
    poster TEXT
)

CREATE TABLE utilisateurs (
    id INT PRIMARY KEY,
    email TEXT UNIQUE,
    password TEXT,
    role_id INT
)

CREATE TABLE roles (
    id INT PRIMARY KEY,
    name TEXT
)
