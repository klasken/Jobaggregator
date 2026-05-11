import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    """Helper pour centraliser la configuration de la connexion MySQL."""
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "db"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        database=os.getenv("MYSQL_DATABASE")
    )


def inserer_database(offres_clean):
    """Insère les offres d'emploi collectées dans la base de données."""
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        insert_query = """
            INSERT IGNORE INTO offres (titre, entreprise_id, description, salaire_min, salaire_max, location, date, contract_type, source)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        for offre in offres_clean:
            try:
                params = []
                cles_a_inserer = ["titre", "entreprise_id", "description", "salaire_min", "salaire_max", "location", "date", "contract_type", "source"]

                for cle in cles_a_inserer:
                    valeur = offre.get(cle)
                    if isinstance(valeur, list):
                        params.append(", ".join(map(str, valeur)))
                    else:
                        params.append(valeur)

                # Exécution pour CETTE offre
                cursor.execute(insert_query, tuple(params))

                # Valide l'insertion de CETTE offre immédiatement
                connection.commit()

            except mysql.connector.Error as e:
                print(f"Erreur sur une offre spécifique : {e}")
                continue

        cursor.close()
        connection.close()
        print("Insertion réussie dans le SQL !")

    except mysql.connector.Error as eer:
        print(f"Erreur MYSQL : {eer}")
    except Exception as e:
        print(f"Erreur inattendue : {e}")

def creer_utilisateur(email, hashed_password, competences, role_id=1):
    """Crée un nouvel utilisateur dans la base de données."""
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        query = "INSERT INTO utilisateurs (email, password, competences, role_id) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (email, hashed_password, competences, role_id))

        connection.commit()
        cursor.close()
        connection.close()
        return True
    except Exception as e:
        print(f"Erreur lors de la création du compte : {e}")
        return False

def get_all_jobs():
    """Récupère la liste complète des offres."""
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM offres")
        jobs = cursor.fetchall()
        cursor.close()
        connection.close()
        return jobs
    except Exception as e:
        print(f"Erreur récupération jobs : {e}")
        return []

def get_user_by_email(email):
    """Récupère un utilisateur par son email pour l'authentification ou le profil."""
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM utilisateurs WHERE email = %s"
        cursor.execute(query, (email,))
        user = cursor.fetchone()
        cursor.close()
        connection.close()
        return user
    except Exception as e:
        print(f"Erreur recherche utilisateur : {e}")
        return None

def get_filtered_jobs(location: str = None, contract: str = None):
    """Récupère les offres filtrées pour le dashboard."""
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        query = "SELECT * FROM offres WHERE 1=1"
        params = []

        if location:
            query += " AND location LIKE %s"
            params.append(f"%{location}%")
        if contract:
            query += " AND contract_type LIKE %s"
            params.append(f"%{contract}%")

        cursor.execute(query, tuple(params))
        jobs = cursor.fetchall()
        cursor.close()
        connection.close()
        return jobs
    except Exception as e:
        print(f"Erreur SQL filtre: {e}")
        return []


def get_stats():
    """Calcule les statistiques pour les compteurs du dashboard."""
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT
                COUNT(*) as total,
                SUM(CASE WHEN contract_type LIKE '%CDI%' THEN 1 ELSE 0 END) as cdi_count
            FROM offres
        """
        cursor.execute(query)
        stats = cursor.fetchone()
        cursor.close()
        connection.close()

        if stats and stats['cdi_count'] is None:
            stats['cdi_count'] = 0

        return stats
    except Exception as e:
        print(f"Erreur stats : {e}")
        return {"total": 0, "cdi_count": 0}
