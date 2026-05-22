-- Création de la table des rôles
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Insertion des rôles de base
INSERT IGNORE INTO roles (id, name) VALUES (1, 'utilisateur'), (2, 'admin');

-- Création de la table des utilisateurs
CREATE TABLE IF NOT EXISTS utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    competences TEXT,
    role_id INT NOT NULL,
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS offres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre TEXT NOT NULL,
    entreprise_nom VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    salaire_min INT,
    salaire_max INT,
    location TEXT,
    date DATE NOT NULL,
    contract_type TEXT,
    source TEXT NOT NULL,
    url VARCHAR(500),
    competences TEXT,
    UNIQUE KEY idx_unique_offre (titre(100), entreprise_nom(100))
);

-- Création de la table des candidatures
CREATE TABLE IF NOT EXISTS candidatures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    job_id INT NOT NULL,
    company VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'En attente',
    color VARCHAR(20) DEFAULT 'orange'
);
