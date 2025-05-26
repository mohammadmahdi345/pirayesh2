from rest_framework import serializers

from payment.models import GateWay, Payment
from service.serializers import AppointmentsSerializer


class GateWaySerializer(serializers.ModelSerializer):

    class Meta:
        model = GateWay
        fields = '__all__'


class PaymentSerializer(serializers.ModelSerializer):
    reservation = AppointmentsSerializer(read_only=True)
    class Meta:
        model = Payment
        fields = '__all__'
        extra_kwargs = {
            'user': {'read_only': True},
            'status': {'read_only': True},
        }
