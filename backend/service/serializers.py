from rest_framework import serializers

from user.serializers import UserSerializer

from .models import *

class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = '__all__'

class HairStylesSerializer(serializers.ModelSerializer):
    """سریالایزر برای مدل مو"""

    category = CategorySerializer()

    class Meta:
        model = HairStyle
        fields = ['pk', 'name', 'description', 'price','image','time_excepted','category']


# class AppointmentsSerializer(serializers.ModelSerializer):
#     """سریالایزر برای مدل رزرو"""
#     price = serializers.SerializerMethodField()
#
#     class Meta:
#         model = Appointments
#         fields = ['pk', 'user', 'hairstyle', 'status', 'price']
#         extra_kwargs = {
#             'user':{'read_only':True},
#             'status': {'read_only': True},
#         }

    # def get_price(self, obj):
    #     return obj.price()

# class OffSerializer(serializers.ModelSerializer):
#     """سریالایزر برای مدل رزرو که متود قیمت رو اجرا و آف(اگه باشه)رو هم مشخصاتشو مینویسه"""
#
#     price = serializers.SerializerMethodField()
#
#     off = serializers.SerializerMethodField()
#
#     class Meta:
#         model = Appointments
#         fields = ['pk', 'user', 'hairstyle', 'status','off', 'price',]
#
#         extra_kwargs = {
#             'user': {'read_only': True},
#             'status': {'read_only': True},
#             'off': {'read_only': True},
#         }
#     def get_price(self, obj):
#         return obj.price()
#
#     def get_off(self, obj):
#         if obj.off:
#             return {
#                 'id': obj.off.id,
#                 'discount_percent': obj.off.discount_percent
#             }
#         return None


class AppointmentCreateSerializer(serializers.ModelSerializer):
    """سریالایزر برای مدل رزرو که متود قیمت رو اجرا و آف(اگه باشه)رو هم مشخصاتشو مینویسه
    همینطور فیلد دیت و تایم اسلات رو مقداردهی و شرط گذاری میکنه"""

    price = serializers.SerializerMethodField()

    off = serializers.SerializerMethodField()

    date = serializers.DateField()

    user = UserSerializer(read_only=True)

    time_slot = serializers.PrimaryKeyRelatedField(queryset=TimeSlot.objects.all())

    class Meta:
        model = Appointments
        fields = ['pk', 'user', 'hairstyle', 'status','off', 'price','date', 'time_slot']
        extra_kwargs = {
            'user': {'read_only': True},
            'status': {'read_only': True},
            'off': {'read_only': True}
        }

    def validate(self, attrs):
        date = attrs.get('date')
        time_slot = attrs.get('time_slot')

        # چک رزرو قبلی روی این تاریخ و تایم‌اسلات
        if Appointments.objects.filter(date=date, time_slot=time_slot).exists():
            raise serializers.ValidationError("این ساعت در این تاریخ قبلا رزرو شده است.")
        return attrs

    def get_price(self, obj):
        return obj.price()

    def get_off(self, obj):
        if obj.off:
            return {
                'id': obj.off.id,
                'discount_percent': obj.off.discount_percent
            }
        return None


class HallImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = HallImage
        fields = ['id', 'image']

    def get_image(self, obj):
        request = self.context.get('request', None)
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url


class HallManagementSerializer(serializers.ModelSerializer):
    images = HallImageSerializer(many=True, read_only=True)

    class Meta:
        model = HallManagement
        fields = '__all__'




class CommentSerializer(serializers.ModelSerializer):
    """سریالایزر برای نظرات"""

    class Meta:
        model = Comment
        fields = '__all__'
        extra_kwargs = {
            'user': {'read_only': True}
        }


class AppointmentStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Appointments.Status.choices)



class TimeslotSerializer(serializers.ModelSerializer):

    class Meta:
        model = TimeSlot
        fields = '__all__'


class AppointmentCancelSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    time_slot = TimeslotSerializer(read_only=True)
    hairstyle_name = serializers.CharField(source='hairstyle.name', read_only=True)
    status = serializers.CharField(read_only=True)

    class Meta:
        model = Appointments
        fields = ['pk', 'user', 'hairstyle_name', 'date', 'time_slot', 'status']



class AppointmentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    hairstyle = HairStylesSerializer(read_only=True)   # nested hairstyle
    time_slot = TimeslotSerializer(read_only=True)      # nested time slot
   
    class Meta:
        model = Appointments
        fields = ['pk', 'user', 'hairstyle', 'status', 'date', 'time_slot', 'created_time']

