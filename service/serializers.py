from rest_framework import serializers

from .models import *

class HairStylesSerializer(serializers.ModelSerializer):

    class Meta:
        model = HairStyle
        fields = '__all__'


class AppointmentsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Appointments
        fields = '__all__'

        extra_kwargs = {
            'user':{'read_only':True},
            'status': {'read_only': True},
        }