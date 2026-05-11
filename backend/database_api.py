import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def inserer_database(offres_clean):
    try:
        conection = mysql.connector.connect(
            host = os.getenv("DB_HOST", "db"),
            user = os.getenv("MYSQL_USER"),
            password = os.getenv("MYSQL_PASSWORD"),
            database = os.getenv("MYSQL_DATABASE")
        )
        cursor = conection.cursor()

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
                conection.commit() 

            except mysql.connector.Error as e:
                print(f"Erreur sur une offre spécifique : {e}")
                continue

        cursor.close()
        conection.close()
        print("Insertion réussie dans le SQL !")

    except mysql.connector.Error as eer:
        print(f"Erreur MYSQL : {eer}")
    except Exception as e:
        print(f"Erreur inattendue : {e}")


def creer_utilisateur(email, hashed_password, competences, role_id=1):
    """Insère un nouvel utilisateur dans la base de données"""
    try:
        conection = mysql.connector.connect(
            host = os.getenv("DB_HOST", "db"),
            user = os.getenv("MYSQL_USER"),
            password = os.getenv("MYSQL_PASSWORD"),
            database = os.getenv("MYSQL_DATABASE")
        )
        cursor = conection.cursor()

        query = "INSERT INTO utilisateurs (email, password, competences, role_id) VALUES (%s, %s, %s, %s)"

        cursor.execute(query, (email, hashed_password, competences, role_id))

        conection.commit()
        cursor.close()
        conection.close()

        return True

    except mysql.connector.Error as eer:
        print(f"Erreur MYSQL : {eer}")
        return False
    except Exception as e:
        print(f"Erreur inattendue : {e}")
        return False

def get_all_jobs():
    try:
        conection = mysql.connector.connect(
            host = os.getenv("DB_HOST", "db"),
            user = os.getenv("MYSQL_USER"),
            password = os.getenv("MYSQL_PASSWORD"),
            database = os.getenv("MYSQL_DATABASE")
        )
        cursor = conection.cursor(dictionary=True)
        query = "SELECT * FROM offres"
        cursor.execute(query)
        jobs = cursor.fetchall()

        cursor.close()
        conection.close()
        return jobs

    except Exception as e:
        print(f"Erreur lors de la récupération des jobs : {e}")
        return []


def get_user_by_email(email):
    try:
        conection = mysql.connector.connect(
            host = os.getenv("DB_HOST", "db"),
            user = os.getenv("MYSQL_USER"),
            password = os.getenv("MYSQL_PASSWORD"),
            database = os.getenv("MYSQL_DATABASE")
        )

        cursor = conection.cursor(dictionary=True)

        query = """
            SELECT * FROM utilisateurs WHERE email = %s
        """


        cursor.execute(query, (email,))

        user = cursor.fetchone()

        cursor.close()
        conection.close()

        return user

    except mysql.connector.Error as eer:
        print(f"Erreur MYSQL : {eer}")
    except Exception as e:
        print(f"Erreur inattendue : {e}")
