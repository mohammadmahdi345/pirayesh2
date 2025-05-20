from rest_framework import serializers

from .models import *

class HairStylesSerializer(serializers.ModelSerializer):
    # final_price = serializers.SerializerMethodField()

    class Meta:
        model = HairStyle
        fields = ['pk', 'name', 'price']

    # def get_final_price(self, obj):
    #     return obj.get_final_price()


class AppointmentsSerializer(serializers.ModelSerializer):
    price = serializers.SerializerMethodField()

    class Meta:
        model = Appointments
        fields = ['pk', 'user', 'hairstyle', 'status', 'price']
        extra_kwargs = {
            'user':{'read_only':True},
            'status': {'read_only': True},
        }

    def get_price(self, obj):
        return obj.price()

class OffSerializer(serializers.ModelSerializer):
    price = serializers.SerializerMethodField()

    off = serializers.SerializerMethodField()

    class Meta:
        model = Appointments
        fields = ['pk', 'user', 'hairstyle', 'status','off', 'price']

        extra_kwargs = {
            'user': {'read_only': True},
            'status': {'read_only': True},
            'off': {'read_only': True},
        }
    def get_price(self, obj):
        return obj.price()

    def get_off(self, obj):
        if obj.off:
            return {
                'id': obj.off.id,
                'discount_percent': obj.off.discount_percent
            }
        return None


class HallManagementSerializer(serializers.ModelSerializer):
    # final_price = serializers.SerializerMethodField()

    class Meta:
        model = HallManagement
        fields = '__all__'
    # def get_final_price(self, obj):
    #     return obj.get_final_price()

class CommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = '__all__'
        extra_kwargs = {
            'user': {'read_only': True}
        }

