
import pytest
from rest_framework.test import APIClient
from user.models import User
from ..models import HairStyle, Appointments , Off
from payment.models import Payment
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from datetime import timedelta

@pytest.mark.django_db
def test_appo_admin():
    """ساخت آبجکت رزرو و فرستادن دیتا به ویو مورد نظر تا تست کنیم که وضعیت کاربر به درستی تغییر میکنه یا نه"""
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
@patch('yourapp.views.random.choice')  # آدرس درست جایگزین yourapp.views کن
def test_payment_success(mock_random_choice):
    """تست پرداخت موفق"""

    mock_random_choice.return_value = True  # تضمین موفق بودن پرداخت

    user = User.objects.create_user(username='ali', password='ali1234')
    client = APIClient()
    client.force_authenticate(user)

    hair = HairStyle.objects.create(
        name='feed',
        description='dlkgfdg',
        time_excepted=timedelta(minutes=30),
        price=100000
    )
    gateway = GateWay.objects.create(name='golpar', description='salammm')
    appo = Appointments.objects.create(user=user, hairstyle=hair, status='waiting')

    url = reverse('payment', args=[gateway.id])
    response = client.post(url, data={})

    assert response.status_code == 200
    assert response.data['detail'] == 'payment successful'
    assert response.data['user'] == user.username
    assert 'ref_id' in response.data

@pytest.mark.django_db
@patch('yourapp.views.random.choice')
def test_payment_failure(mock_random_choice):
    """تست پرداخت ناموفق"""

    mock_random_choice.return_value = False  # تضمین ناموفق بودن پرداخت

    user = User.objects.create_user(username='ali', password='ali1234')
    client = APIClient()
    client.force_authenticate(user)

    hair = HairStyle.objects.create(
        name='feed',
        description='dlkgfdg',
        time_excepted=timedelta(minutes=30),
        price=100000
    )
    gateway = GateWay.objects.create(name='golpar', description='salammm')
    appo = Appointments.objects.create(user=user, hairstyle=hair, status='waiting')

    url = reverse('payment', args=[gateway.id])
    response = client.post(url, data={})

    assert response.status_code == 402
    assert response.data['detail'] == 'payment unsuccessful'
    assert response.data['user'] == user.username
    assert 'ref_id' in response.data


@pytest.mark.django_db
def test_hair():
    " تست لیست مدل مو"

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
    """تست برای متود get ویو آف"""
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
def test_appo_post_off():
    """تست برای متود post ویو آف"""
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

