
import random

from locust import HttpUser, task, between
import json


# بررسی علمکرد سیستم موقع صدا زدن url مدل مو
class Hairstyle(HttpUser):
    # زمان بین هر درخواست
    wait_time = between(1, 2)

    @task
    def hair_style(self):
        # ارسال درخواست GET به URL مورد نظر
        self.client.get("/hairs/")

# بررسی عملکرد سیستم موقع صدا زدن  url رزرو نوبت
users = [
    {"username": "mmd", "password": "mmd1234"},
    {"username": "mmd12", "password": "mmd12345"},
    {"username": "ali", "password": "ali23"},
]
class OffViewUser(HttpUser):
    wait_time = between(1, 2)
    token = None

    def on_start(self):
        user = random.choice(users)
        self.token = self.get_token(user["username"], user["password"])
# گرفتن توکن oauth از سه تا یوزر مختلف
    def get_token(self, username, password):
        url = "http://web:8005/o/token/"
        data = {
            "grant_type": "password",
            "username": username,
            "password": password,
            "client_id": "UwawV9d5vmuKjyR1aMGOiSeSsz56JDjrxTBOLla4",
            "client_secret": "J3b2d6z8mXziHxf5qm2eOhCb2OcwXH60P3GVbaY2XYOpfA1vGt3S2EKL1CsvA9wKg2cb4jujAsyJk2BUWV7XHr8CVUkPsFbyuPTGQNUzyvGdTpFLvVcSuZAhZsRWUYCM",
        }
        response = self.client.post(url, data=data)
        print("Token response:", response.status_code, response.text)
        token = response.json().get("access_token")
        if not token:
            raise Exception("❌ Access token not received.")
        return token
# فرستادن توکن در هدر و فرستادن درخواست get و post به url مورد نظر
    @task
    def post_off_view(self):
        url = "/offs/"
        data = {
            "hairstyle": 1
        }
        headers = {
            "Authorization": f"Bearer {self.token}"
        }
        response = self.client.post(url, json=data, headers=headers)
        print(response.status_code)
        print(response.json())
    @task
    def get_offs_view(self):
        headers = {"Authorization": f"Bearer {self.token}"}
        response = self.client.get("/offs/", headers=headers)
        print("GET:", response.status_code, response.json())

