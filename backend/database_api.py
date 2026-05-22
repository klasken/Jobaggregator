import mysql.connector
import os
from dotenv import load_dotenv
from datetime import datetime
from collections import defaultdict

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
            INSERT IGNORE INTO offres (titre, entreprise_nom, description, salaire_min, salaire_max, location, date, contract_type, source)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        for offre in offres_clean:
            try:
                params = [
                    str(offre.get("titre", "")),
                    str(offre.get("entreprise_nom", "")),
                    str(offre.get("description", "")),
                    int(offre.get("salaire_min", 0)),
                    int(offre.get("salaire_max", 0)),
                    str(offre.get("location", "")),
                    str(offre.get("date", "")),
                    str(offre.get("contract_type", "")),
                    str(offre.get("source", ""))
                ]

                cursor.execute(insert_query, tuple(params))
                connection.commit()

            except mysql.connector.Error as e:
                print(f"Erreur sur une offre spécifique : {e}")
                continue

        cursor.close()
        connection.close()
        print("Insertion réussie dans le SQL !")

    except Exception as e:
        print(f"Erreur globale lors de l'insertion : {e}")

def creer_utilisateur(email, hashed_password, competences, nom="Utilisateur", role_id=1):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        query = """
            INSERT INTO utilisateurs (email, password, competences, role_id, nom)
            VALUES (%s, %s, %s, %s, %s)
        """
        comp_text = competences if competences else ""
        nom_text = nom.strip() if (nom and nom.strip() != "") else "Utilisateur"

        cursor.execute(query, (email, hashed_password, comp_text, role_id, nom_text))
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

def update_user_profile(email, nom, competences):
    """Met à jour le nom et les compétences d'un utilisateur dans la base de données."""
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        query = "UPDATE utilisateurs SET nom = %s, competences = %s WHERE email = %s"
        cursor.execute(query, (nom, competences, email))

        connection.commit()
        cursor.close()
        connection.close()
        return True
    except Exception as e:
        print(f"Erreur lors de la mise à jour du profil : {e}")
        return False


def get_filtered_jobs(location: str = None, contract: str = None):
    """Récupère les offres filtrées pour le dashboard."""
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        query = """
        SELECT id, titre, entreprise_nom, description,
        salaire_min, salaire_max, location, date,
        contract_type, competences, url
        FROM offres
        WHERE 1=1
        """
        params = []

        if location and location.strip() != "" and location != "undefined" and location != "null":
            query += " AND location LIKE %s"
            params.append(f"%{location}%")

        if contract and contract.strip() != "" and contract != "undefined" and contract != "null":
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


# =====================================================================
#                      FONCTIONS POUR LE PANEL ADMIN
# =====================================================================

def get_all_users():
    """Récupère tous les utilisateurs enregistrés avec le nom de leur rôle."""
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        query = """
            SELECT u.id, u.nom AS name, u.email, r.name AS role
            FROM utilisateurs u
            JOIN roles r ON u.role_id = r.id
        """
        cursor.execute(query)
        users = cursor.fetchall()
        cursor.close()
        connection.close()
        return users
    except Exception as e:
        print(f"Erreur récupération globale des utilisateurs : {e}")
        return []

def get_admin_jobs():
    """Récupère toutes les offres d'emploi formatées pour le tableau d'administration."""
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        query = "SELECT id, titre AS title, entreprise_nom AS company, location AS city FROM offres"
        cursor.execute(query)
        jobs = cursor.fetchall()
        cursor.close()
        connection.close()
        return jobs
    except Exception as e:
        print(f"Erreur récupération globale des offres admin : {e}")
        return []

def delete_user(user_id: int):
    """Supprime définitivement un utilisateur de la base de données."""
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        query = "DELETE FROM utilisateurs WHERE id = %s"
        cursor.execute(query, (user_id,))
        connection.commit()
        cursor.close()
        connection.close()
        return True
    except Exception as e:
        print(f"Erreur lors de la suppression de l'utilisateur {user_id} : {e}")
        return False

def delete_job(job_id: int):
    """Supprime définitivement une offre d'emploi de la base de données."""
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        query = "DELETE FROM offres WHERE id = %s"
        cursor.execute(query, (job_id,))
        connection.commit()
        cursor.close()
        connection.close()
        return True
    except Exception as e:
        print(f"Erreur lors de la suppression de l'offre {job_id} : {e}")
        return False

def add_application(user_email, job_id, company, position):
    """Enregistre une nouvelle candidature."""
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        date_str = datetime.now().strftime("%Y-%m-%d")
        query = """
            INSERT INTO candidatures (user_email, job_id, company, position, date, status, color)
            VALUES (%s, %s, %s, %s, %s, 'En attente', 'orange')
        """
        cursor.execute(query, (user_email, job_id, company, position, date_str))
        connection.commit()
        cursor.close()
        connection.close()
        return True
    except Exception as e:
        print(f"Erreur ajout candidature: {e}")
        return False

def get_applications(user_email):
    """Récupère les candidatures d'un utilisateur."""
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM candidatures WHERE user_email = %s ORDER BY id DESC"
        cursor.execute(query, (user_email,))
        apps = cursor.fetchall()
        cursor.close()
        connection.close()
        return apps
    except Exception as e:
        print(f"Erreur recup candidatures: {e}")
        return []

def get_monthly_stats_from_db(user_email):
    """Calcule les statistiques des 6 derniers mois pour le graphique du dashboard."""
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        query = "SELECT date, status FROM candidatures WHERE user_email = %s"
        cursor.execute(query, (user_email,))
        apps = cursor.fetchall()
        cursor.close()
        connection.close()

        months_map = {1: 'Janv.', 2: 'Févr.', 3: 'Mars', 4: 'Avril', 5: 'Mai', 6: 'Juin',
                      7: 'Juil.', 8: 'Août', 9: 'Sept.', 10: 'Oct.', 11: 'Nov.', 12: 'Déc.'}

        # Initialiser les 6 derniers mois avec des 0
        today = datetime.now()
        stats_dict = {}
        for i in range(5, -1, -1):
            m = (today.month - i - 1) % 12 + 1
            label = f"{months_map[m]}"
            stats_dict[label] = {"mois": label, "envoyees": 0, "acceptees": 0, "refusees": 0}

        # Remplir avec les vraies données
        for app in apps:
            try:
                # La date est au format YYYY-MM-DD
                d = datetime.strptime(app['date'], "%Y-%m-%d")
                label = months_map[d.month]
                if label in stats_dict:
                    stats_dict[label]["envoyees"] += 1
                    if app['status'] == 'Accepté':
                        stats_dict[label]["acceptees"] += 1
                    elif app['status'] == 'Refusé':
                        stats_dict[label]["refusees"] += 1
            except Exception:
                continue

        return list(stats_dict.values())

    except Exception as e:
        print(f"Erreur stats graphiques mensuelles: {e}")
        return []
