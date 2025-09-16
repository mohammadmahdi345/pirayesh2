from django.urls import path
from .views import GateWayView, PaymentView
from rest_framework.routers import SimpleRouter

router = SimpleRouter()
router.register('gateway', GateWayView, basename='gateway')

urlpatterns = [
    path('payment/<int:pk>/', PaymentView.as_view(), name='payment'),
    ] + router.urls