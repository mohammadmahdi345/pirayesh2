
import pytest
from rest_framework.test import APIClient
from user.models import User
from ..models import HairStyle, Appointments , Off
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from datetime import timedelta

@pytest.mark.django_db
def test_appo_admin():
    user = User.objects.create_user(username='ali', password='ali1234', is_staff=True)
    client = APIClient()
    client.force_authenticate(user)

    hairstyle = HairStyle.objects.create(
        name='feed',
        description='dlkgfdg',
        time_excepted=timedelta(minutes=30),
        price=100000
    )

    appo = Appointments.objects.create(status='waiting', user=user, hairstyle=hairstyle)


    url = reverse('Appointments-admin', args=[appo.id])
    response = client.patch(url, data={'status': 'approved'})

    appo.refresh_from_db()
    assert response.status_code == 200
    assert appo.status == 'approved'




@pytest.mark.django_db
def test_hair():
    user = User.objects.create_user(username='ali', password='ali1234')
    client = APIClient()
    client.force_authenticate(user)

    HairStyle.objects.create(
        name='feed',
        description='dlkgfdg',
        time_excepted=timedelta(minutes=30),
        price=100000
    )
    HairStyle.objects.create(
        name='feed',
        description='dlkgfdg',
        time_excepted=timedelta(minutes=30),
        price=100000
    )

    url = reverse('hairs-list')
    response = client.get(url)

    assert response.status_code == 200
    assert len(response.data) == 2


@pytest.mark.django_db
def test_appo_get():
    user = User.objects.create_user(username='ali', password='ali1234')
    client = APIClient()
    client.force_authenticate(user)

    hair = HairStyle.objects.create(
    name='feed',
    description='dlkgfdg',
    time_excepted=timedelta(minutes=30),
    price=100000
)
    Appointments.objects.create(user=user, hairstyle=hair, status='waiting')
    Appointments.objects.create(user=user, hairstyle=hair, status='approved')

    url = reverse('off')  # اسم دقیق URL name در urls.py
    response = client.get(url)

    assert response.status_code == 200
    assert len(response.data['waiting reservs']) == 1
    assert len(response.data['approved reservs']) == 1


@pytest.mark.django_db
def test_appo_post():
    user = User.objects.create_user(username='ali', password='ali1234')
    client = APIClient()
    client.force_authenticate(user)

    hair = HairStyle.objects.create(
    name='feed',
    description='dlkgfdg',
    time_excepted=timedelta(minutes=30),
    price=100000
)

    data = {
        "hairstyle": hair.id
    }

    url = reverse('Appointments')
    response = client.post(url, data)


    assert response.status_code == 201
    assert "pk" in response.data
    assert response.data["status"] == "waiting"

@pytest.mark.django_db
def test_appo_post_off():
    user = User.objects.create_user(username='ali', password='ali1234')
    client = APIClient()
    client.force_authenticate(user)

    # ایجاد مدل HairStyle با قیمت و زمان مورد نظر
    hair = HairStyle.objects.create(
        name='feed',
        description='dlkgfdg',
        time_excepted=timedelta(minutes=30),
        price=100000
    )

    # ایجاد 3 نوبت تایید شده برای کاربر
    for _ in range(3):
        Appointments.objects.create(user=user, hairstyle=hair, status='approved')

    # ایجاد تخفیف فعال
    off = Off.objects.create(
        is_active=True,
        start_at=timezone.now() - timedelta(days=1),
        end_at=timezone.now() + timedelta(days=1),
        discount_percent=20
    )

    data = {
        "hairstyle": hair.id
    }

    # ارسال درخواست به URL مربوطه
    url = reverse('off')
    response = client.post(url, data)

    # بررسی کد وضعیت پاسخ
    assert response.status_code == 201

    # بررسی اینکه وضعیت نوبت "waiting" است
    assert response.data["status"] == "waiting"

    # بررسی اینکه فیلد 'off' در پاسخ وجود دارد
    assert "off" in response.data

    # بررسی صحت تخفیف (مقدار discount_percent باید برابر 20 باشد)
    assert response.data["off"]["discount_percent"] == 5


# @pytest.mark.django_db
# def test_hairstyle():
#     client = APIClient()
#     user = User.objects.create_user(username='ali', password='ali1234')
#     client.force_authenticate(user)
#     HairStyle.objects.create(name='feed az jelo', description='good model')
#     HairStyle.objects.create(name='feed az aghab', description='very good model')
#
#     url = reverse('hairs')  # فرض بر اینکه Route اسم داره
#     response = client.get(url)
#
#     assert response.status_code == 200
#     assert len(response.data) == 2
#
#
# @pytest.mark.django_db
# def test_APPOINT():
#     client = APIClient()
#     user = User.objects.create_user(username='ali', password='ali1234')
#     client.force_authenticate(user)
#     hair = HairStyle.objects.create(name='test', description='desc')
#     reserv1 = Appointments.objects.create(hairstyle=hair, user=user, status='waiting')
#     reserv2 = Appointments.objects.create(hairstyle=hair, user=user, status='approved')
#     url = reverse('offs')  # فرض بر اینکه Route اسم داره
#     response = client.get(url)
#
#     assert response.status_code == 200
#     assert len(response.data['waiting reservs']) == 1
#     assert len(response.data['approved reservs']) == 1
#
#
# @pytest.mark.django_db
# def test_create_APPOINT():
#     client = APIClient()
#     user = User.objects.create_user(username='ali', password='ali1234')
#     client.force_authenticate(user)
#     hair = HairStyle.objects.create(name='fade', description='good')
#     url = reverse('appointments')  # یا نامی که تو urls.py براش گذاشتی
#     response = client.post(url, {'hairstyle': hair.id})
#
#     assert response.status_code == 201
#     assert Appointments.objects.first().hairstyle == 1
#
#
#
#

@pytest.fixture
def api_client():
    return APIClient()

from unittest.mock import patch


@pytest.mark.django_db
def test_login_with_mock_token(api_client):
    # اطلاعات کاربری که در دیتابیس برای تست ایجاد می‌شود
    data = {
        "username": "newuser",
        "password": "newpassword"
    }

    # استفاده از mocking برای شبیه‌سازی دریافت توکن
    with patch('requests.post') as mock_post:
        # شبیه‌سازی پاسخ موفق از سرور
        mock_post.return_value.status_code = 200
        mock_post.return_value.json.return_value = {
            'access_token': 'fake_token',  # توکن جعلی
            'refresh_token': 'fake_refresh_token'
        }

        url = reverse('login')  # URL مربوط به لاگین
        response = api_client.post(url, data=data)  # ارسال درخواست لاگین

        # بررسی کد وضعیت پاسخ
        assert response.status_code == status.HTTP_200_OK
        assert 'access_token' in response.data
        assert response.data['access_token'] == 'fake_token'


@pytest.mark.django_db
def test_register_with_mock_token(api_client):
    # اطلاعات ثبت‌نام کاربر جدید
    data = {
        "username": "newuser",
        "password": "newpassword"
    }

    # استفاده از mocking برای شبیه‌سازی دریافت توکن
    with patch('requests.post') as mock_post:
        # شبیه‌سازی پاسخ موفق از سرور
        mock_post.return_value.status_code = 200
        mock_post.return_value.json.return_value = {
            'access_token': 'fake_token',  # توکن جعلی
            'refresh_token': 'fake_refresh_token'
        }

        url = reverse('register')  # URL مربوط به ثبت‌نام
        response = api_client.post(url, data=data)  # ارسال درخواست ثبت‌نام

        # بررسی کد وضعیت پاسخ
        assert response.status_code == status.HTTP_201_CREATED
        assert 'tokens' in response.data
        assert response.data['tokens']['access_token'] == 'fake_token'

