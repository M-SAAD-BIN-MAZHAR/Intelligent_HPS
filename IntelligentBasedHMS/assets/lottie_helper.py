import json
import requests


def load_lottie_animation(url: str):
   response = requests.get(url)
   if response.status_code != 200:
      return None
   return json.loads(response.content.decode('utf-8'))