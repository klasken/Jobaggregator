import requests
from dotenv import load_dotenv
import os
import time
dotenv = load_dotenv()
api_welovedevs = os.getenv("WELOVEDEVS_API_KEY")


def request_api_welovedevs():
    response = requests.get("https://epi-api.welovedevs.com/offers", headers={"Authorization" : f"Bearer {api_welovedevs}"})
    time.sleep(1)
    donne = response.json()
    print(donne)

test = request_api_welovedevs()
print(test)
