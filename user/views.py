import requests
from django.conf import settings
from .models import User
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from decouple import config
from django.contrib.auth.models import User


class CustomLoginView(APIView):
    authentication_classes = []  # احراز هویت غیرفعال می‌شود
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "Username and password required"}, status=400)

        # data = {
        #     "grant_type": "password",  # نوع گرانت
        #     "username": username,
        #     "password": password,
        #     "client_id": config("OAUTH_CLIENT_ID"),  # گرفتن client_id از .env
        #     "client_secret": config("OAUTH_CLIENT_SECRET"),  # گرفتن client_secret از .env
        # }
        data = {
            "grant_type": "password",  # نوع گرانت
            "username": username,
            "password": password,
            "client_id": 'UwawV9d5vmuKjyR1aMGOiSeSsz56JDjrxTBOLla4',  # گرفتن client_id از .env
            "client_secret": 'J3b2d6z8mXziHxf5qm2eOhCb2OcwXH60P3GVbaY2XYOpfA1vGt3S2EKL1CsvA9wKg2cb4jujAsyJk2BUWV7XHr8CVUkPsFbyuPTGQNUzyvGdTpFLvVcSuZAhZsRWUYCM'  # گرفتن client_secret از .env
        }

        # token_url = request.build_absolute_uri("http://web:8005/o/token/")
        token_url = "http://web:8005/o/token/"
        response = requests.post(token_url, data=data)

        if response.status_code != 200:
            print(response.text)  # برای مشاهده پیام خطای دقیق
            return Response(response.json(), status=response.status_code)

        return Response(response.json(), status=200)






class RegisterView(APIView):
    authentication_classes = []  # احراز هویت غیرفعال می‌شود
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "Username and password required"}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=400)

        # ساخت کاربر
        User.objects.create_user(username=username, password=password)

        # گرفتن توکن
        data = {
            "grant_type": "password",
            "username": username,
            "password": password,
            "client_id": 'UwawV9d5vmuKjyR1aMGOiSeSsz56JDjrxTBOLla4',  # گرفتن client_id از .env
            "client_secret": 'J3b2d6z8mXziHxf5qm2eOhCb2OcwXH60P3GVbaY2XYOpfA1vGt3S2EKL1CsvA9wKg2cb4jujAsyJk2BUWV7XHr8CVUkPsFbyuPTGQNUzyvGdTpFLvVcSuZAhZsRWUYCM'
        }

        token_url = "http://web:8005/o/token/"
        response = requests.post(token_url, data=data)

        if response.status_code != 200:
            return Response({
                "message": "User created, but failed to get token.",
                "token_error": response.json()
            }, status=400)

        return Response({
            "message": "User created and logged in successfully.",
            "tokens": response.json()
        }, status=201)