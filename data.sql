CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE utilisateurs (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role_id INT NOT NULL,
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE offres (
    id SERIAL PRIMARY KEY,
    titre TEXT NOT NULL,
    entreprise_id TEXT NOT NULL,
    description TEXT NOT NULL,
    salaire_min INT,
    salaire_max INT,
    location TEXT,
    date DATE NOT NULL,
    contract_type TEXT,
    source TEXT NOT NULL
);
