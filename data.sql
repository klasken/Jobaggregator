CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

INSERT IGNORE INTO roles (id, name) VALUES (1, 'utilisateur'), (2, 'admin');

CREATE TABLE IF NOT EXISTS utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role_id INT NOT NULL,
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE offres (
    id INT AUTO_INCREMENT PRIMARY KEY,
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
