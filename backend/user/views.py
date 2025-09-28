import requests
from settings import base
from .models import User
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from decouple import config
from .serializers import UserSerializer
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated


class CustomLoginView(APIView):
    """برای لاگین کاربر با استفاده از سیستم احراز هویت oauth(که با یوزرنیم و پسوورد انجام میشه)"""
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"error": "Username and password required"}, status=400)

        data = {
            'grant_type': 'password',
            'username': username,
            'password': password,
            "client_id": base.OAUTH_CLIENT_ID,
            "client_secret": base.OAUTH_CLIENT_SECRET
        }

        token_url = 'http://localhost:8005/o/token/'
        response = requests.post(token_url, data=data)


        logger.debug(f"Token response: {response.status_code=} {response.text=}")

        if response.status_code != 200:
            return Response({
                "message": "نام کاربری یا رمز عبور صحیح نمی‌باشد",
                "token_error": response.json()
            }, status=400)

        return Response({
            "message": "logged in successfully.",
            "tokens": response.json()
        }, status=201)



import logging

logger = logging.getLogger(__name__)


class RegisterView(APIView):
    """برای ثبت نام کاربر با استفاده از سیستم احراز هویت oauth(که با یوزرنیم و پسوورد انجام میشه)"""
    authentication_classes = []
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        first_name = request.data.get("first_name", "")
        last_name = request.data.get("last_name", "")
        email = request.data.get("email", "")

        if not username or not password:
            return Response({"error": "نام کاربری و رمز عبور نیاز است"}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({"error": "نام کاربری از قبل موجود است"}, status=400)

        user = User.objects.create_user(
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name,
            email=email
        )

    # بقیه دریافت توکن و بازگشت پاسخ همون قبلی



        data = {
            "grant_type": "password",
            "username": username,
            "password": password,
            "client_id": base.OAUTH_CLIENT_ID,
            "client_secret": base.OAUTH_CLIENT_SECRET
        }
        


        token_url = 'http://localhost:8005/o/token/'
        response = requests.post(token_url, data=data)


        logger.debug(f"Token response: {response.status_code=} {response.text=}")

        if response.status_code != 200:
            return Response({
                "message": "User created, but failed to get token.",
                "token_error": response.json()
            }, status=400)

        return Response({
            "message": "User created and logged in successfully.",
            "tokens": response.json()
        }, status=201)


class UserGetView(APIView):
    permission_classes = [AllowAny]

    def get(self,request):
        users = User.objects.all()
        serializer = UserSerializer(users,many=True)
        return Response(serializer.data,status=200)


class UserView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self,request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data,status=200)