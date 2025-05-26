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
    """برای لاگین کاربر با استفاده از سیستم احراز هویت oauth(که با یوزرنیم و پسوورد انجام میشه)"""
    authentication_classes = []
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "Username and password required"}, status=400)

        data = {
            "grant_type": "password",
            "username": username,
            "password": password,
            "client_id": settings.OAUTH_CLIENT_ID,
            "client_secret": settings.OAUTH_CLIENT_SECRET  # گرفتن client_secret از .env
        }


        token_url = "http://web:8005/o/token/"
        response = requests.post(token_url, data=data)

        if response.status_code != 200:
            print(response.text)  # برای مشاهده پیام خطای دقیق
            return Response(response.json(), status=response.status_code)

        return Response(response.json(), status=200)






class RegisterView(APIView):
    """برای ثبت نام کاربر با استفاده از سیستم احراز هویت oauth(که با یوزرنیم و پسوورد انجام میشه)"""
    authentication_classes = []
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "Username and password required"}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=400)


        User.objects.create_user(username=username, password=password)


        data = {
            "grant_type": "password",
            "username": username,
            "password": password,
            "client_id": settings.OAUTH_CLIENT_ID,
            "client_secret": settings.OAUTH_CLIENT_SECRET
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