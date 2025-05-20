# import os
# import django
#
# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings.dev")
# django.setup()
import random

from locust import HttpUser, task, between
import json
# import random
# import string
# from service.urls import *

# یک کلاس برای شبیه‌سازی کاربر مجازی ایجاد می‌کنیم
class Hairstyle(HttpUser):
    # زمان بین هر درخواست
    wait_time = between(1, 2)

    @task
    def hair_style(self):
        # ارسال درخواست GET به URL مورد نظر
        self.client.get("/hairs/")

# class OffTest(HttpUser):
#         # زمان بین هر درخواست
#     wait_time = between(1, 2)
#
#     @task
#     def off(self):
#             # ارسال درخواست GET به URL مورد نظر
#         self.client.get("/offs/")

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

    def get_token(self, username, password):
        url = "http://web:8005/o/token/"  # URL مربوط به گرفتن توکن
        data = {
            "grant_type": "password",
            "username": username,  # یوزرنیم واقعی
            "password": password,
            "client_id": "UwawV9d5vmuKjyR1aMGOiSeSsz56JDjrxTBOLla4",
            "client_secret": "J3b2d6z8mXziHxf5qm2eOhCb2OcwXH60P3GVbaY2XYOpfA1vGt3S2EKL1CsvA9wKg2cb4jujAsyJk2BUWV7XHr8CVUkPsFbyuPTGQNUzyvGdTpFLvVcSuZAhZsRWUYCM",
        }
        response = self.client.post(url, data=data)
        print("Token response:", response.status_code, response.text)  # 🔍 بررسی
        token = response.json().get("access_token")
        if not token:
            raise Exception("❌ Access token not received.")
        return token

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

    # # می‌توانید چندین تابع @task تعریف کنید
    # @task(2)  # اولویت این تابع بیشتر است (عدد 2 یعنی 2 برابر بیشتر از تابع قبلی اجرا می‌شود)
    # def another_task(self):
    #     self.client.get("/hairs/", headers={})


#
# def random_username(length=8):
#     return "user_" + ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))
#
# class AuthUser(HttpUser):
#     wait_time = between(1, 2)
#
#     @task
#     def register_and_login(self):
#         username = random_username()
#         password = "12345678"
#
#         # مرحله ثبت‌نام
#         register_data = {
#             "username": username,
#             "password": password
#         }
#         with self.client.post("/register/", data=register_data, catch_response=True) as response:
#             if response.status_code == 201:
#                 response.success()
#             else:
#                 response.failure(f"Register failed: {response.text}")
#                 return
#
#         # مرحله لاگین (دستی، چون ثبت‌نام خودش توکن می‌ده)
#         login_data = {
#             "grant_type": "password",
#             "username": username,
#             "password": password,
#             "client_id": "UwawV9d5vmuKjyR1aMGOiSeSsz56JDjrxTBOLla4",
#             "client_secret": "J3b2d6z8mXziHxf5qm2eOhCb2OcwXH60P3GVbaY2XYOpfA1vGt3S2EKL1CsvA9wKg2cb4jujAsyJk2BUWV7XHr8CVUkPsFbyuPTGQNUzyvGdTpFLvVcSuZAhZsRWUYCM"
#         }
#         with self.client.post("/login/", data=login_data, catch_response=True) as login_response:
#             if login_response.status_code == 200:
#                 login_response.success()
#             else:
#                 login_response.failure(f"Login failed: {login_response.text}")