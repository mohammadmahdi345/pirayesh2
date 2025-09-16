# ماژول های داخلی پایتون
from datetime import datetime
from random import random
from random import *
# ماژول های rest
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
# ماژول های جنگو
from django.utils import timezone
from django.db.models import Q
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from django.db.models import Avg
# ماژول های دیگر
from drf_spectacular.utils import extend_schema
#  ماژول های داخلی پروژه
from user.models import User
from .models import *
from .serializers import *


@extend_schema(summary="دیدن مدل مو های مختلف, تکی و یکجا")
class HairStylesView(viewsets.ReadOnlyModelViewSet):
    """لیست کل مدل موها و هر مدل مو رو نشون میده"""
    permission_classes = [AllowAny]
    queryset = HairStyle.objects.all()
    serializer_class = HairStylesSerializer

@extend_schema(summary="برای کنسل کردن رزرو توسط کاربر")
class AppointmentsView(APIView):
    """برای کنسل کردن رزرو توسط کاربر"""
    permission_classes = [IsAuthenticated]

    def patch(self, request,pk):
        appo = get_object_or_404(Appointments, pk=pk, user=request.user, status=Appointments.Status.waiting)
        appo.status = Appointments.Status.cancelled
        appo.save()
        return Response({'detail':'status cancelled'}, status=200)


@extend_schema(summary="عوض کردن وضعیت کاربر توسط کاربر ادمین", tags=["Admin"])
class AdminAppointmentsView(APIView):
    """برای عوض کردن وضعیت یک رزرو توسط ادمین"""
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        appo = get_object_or_404(Appointments, pk=pk)
        serializer = AppointmentStatusSerializer(data=request.data)
        
        if serializer.is_valid():
            appo.status = serializer.validated_data['status']
            appo.save()
            return Response({'detail': f'status changed to {appo.status}'}, status=200)
        
        return Response(serializer.errors, status=400)

class AllAppointmentView(APIView):
    permission_classes = [IsAdminUser]

    def get(self,request):
        appo = Appointments.objects.all()
        serializer = AppointmentCreateSerializer(appo,many=True)
        return Response(serializer.data,status=200)

class OneAppointmentView(APIView):
    permission_classes = [IsAdminUser]

    def get(self,request):
        try:
            appo = Appointments.objects.filter(user=request.user,status='waiting')
        except Appointments.DoesNotExist:
            return Response(status=404)
        serializer = AppointmentCreateSerializer(appo,many=True)
        return Response(serializer.data,status=200)

@extend_schema(
    summary="ایجاد رزرو با بررسی تخفیف",
    description="اگر کاربر تعداد رزرو تایید شده‌اش مضربی از 3 باشد، تخفیف فعال اعمال می‌شود.")
class OffView(APIView):
    '''این ویو رزرو ثبت میکنه واگر کاربر تعداد رزرو تایید شده‌اش مضربی از 3 باشد، تخفیف فعال اعمال می‌شود.
    همچنین در متود get رزرو هایی با وضعیت انجام شده و همچنین در حال انتظار و کنسل شده رو به کاربر نشون میده'''
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AppointmentCreateSerializer(data=request.data)
        if serializer.is_valid():

            user = request.user
            time_slot = serializer.validated_data['time_slot']
            date = serializer.validated_data['date']

            appo = Appointments.objects.filter(user=user, status='approved')
            is_ok = len(appo) > 0 and len(appo) % 3 == 0

            active_off = None 
            
            if is_ok:
                active_off = Off.objects.filter(
                    is_active=True,
                    start_at__lte=timezone.now(),
                    end_at__gte=timezone.now(),
                )
                if active_off:
                    off = active_off.first()

                    serializer.save(user=user, time_slot=time_slot, date=date, off=off, status=Appointments.Status.waiting)
                    return Response(
                        {
                            'detail': 'reserv sabt shod',
                            'pk': serializer.data['pk']
                        },
                        status=201
                    )
                else:
                    serializer.save(user=user, time_slot=time_slot, date=date, status=Appointments.Status.waiting)
                    return Response(
                        {
                            'detail': 'reserv approved without off',
                            'pk': serializer.data['pk']
                        }, status=201)

            serializer.save(user=user, time_slot=time_slot, date=date, status=Appointments.Status.waiting)
            return Response(
                {
                    'detail': 'reserv approved without off',
                    'pk': serializer.data['pk']
                }, status=201)

        return Response({'reserv sabt nashod':serializer.errors}, status=400)



    def get(self, request):
        approved_appo = Appointments.objects.filter(user=request.user, status='approved')
        other_appo = Appointments.objects.filter(user=request.user).exclude(status='approved')

        serializer1 = AppointmentCreateSerializer(approved_appo)
        serializer2 = AppointmentCreateSerializer(other_appo)

        return Response({
            'your_appoes':{'approved_appo':serializer1.data,
                        'other_appo':serializer2.data }
        }, status=200)
#________________________________________________________________________________________________________________________
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from datetime import datetime
from .models import Appointments, TimeSlot
from .serializers import TimeslotSerializer

class AvailableTimeSlotsAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        date_str = request.query_params.get('date')
        if not date_str:
            return Response({'error': 'لطفا تاریخ را وارد کنید'}, status=400)

        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response({'error': 'فرمت تاریخ باید به صورت YYYY-MM-DD باشد'}, status=400)

        booked_times = Appointments.objects.filter(date=date).values_list('time_slot_id', flat=True)
        available_slots = TimeSlot.objects.exclude(id__in=booked_times)

        data = [
            {
                'id': slot.id,
                'start_time': slot.start_time,
                'end_time': slot.end_time,
            }
            for slot in available_slots
        ]
        return Response(data, status=200)


@extend_schema(summary="مدیریت سالن")
class HallManagementView(APIView):
    

    def get(self, request):
        hall = HallManagement.objects.first()
        serializer = HallManagementSerializer(hall)
        return Response(serializer.data, status=status.HTTP_200_OK)

        
@extend_schema(summary="سرچ بین مدل موها")
class SearchView(APIView):
    '''سرچ در بین مدل موها'''

    def get(self, request, name):

        search = HairStyle.objects.filter(name__icontains=name)
        serializer = HairStylesSerializer(search, many=True)
        return Response(serializer.data, status=200)

@extend_schema(
    summary="ایجاد نظر",
    description="اگر کاربر حداقل یک رزرو(چه انجام شده چه در حال انتظار)"
                " میتونه نظر بده.")
class CommentView(APIView):
    """ایجاد نظرو دادن امتیاز توسط کاربر به شرطی که یک رزرو(چه انجام شده چه در حال انتظار) داشته باشه"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if Appointments.objects.filter(user=request.user).exists():
            serializer = CommentSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user=request.user)
                return Response({'detail':'نظر شما ثبت شد'}, status=200)
            return Response(serializer.errors, status=400)
        else:
            return Response({'detail':'لطفا اول رزروی ثبت کنید'}, status=400)



@extend_schema(summary="میانگین امتیاز و نظرات هر کاربر", tags=["Admin"])
class CommentStatsView(APIView):
    """میانگین امتیاز و نظرات هر کاربر رو نشون میده """
    permission_classes = [IsAdminUser]

    def get(self, request):

        avarage_point = User.objects.annotate(
            avarage_point= Avg('comments__point')
        )

        data = []
        for user in avarage_point:
            if user.avarage_point is None:
                countinue

            comments = Comment.objects.filter(user=user).order_by('created_at')

            comment_list = [
                {
                    'comment': comment.description,
                    'point': comment.point,
                    'created_at': comment.created_at
                }
                for comment in comments
            ]

            data.append(
                {
                    'user_id': user.id,
                    'username': user.username,
                    'avarage_point': round(user.avarage_point, 2),
                    'comments': comment_list
                }
            )

            return Response(data, status=200)


@extend_schema(summary="میانگین امتیازات کلی کاربران و کل نظرات ", tags=["Admin"])
class CommentAllStatsView(APIView):
    """میانگین کلی امتیازات و کل نظرات رو نشون میده"""
    permission_classes = [IsAdminUser]

    def get(self, request):
        average_point = Comment.objects.aggregate(avg_point=Avg('point'))['avg_point']
        comments = Comment.objects.all()

        serializer = CommentSerializer(comments, many=True)

        return Response({
            'average_point': round(average_point or 0, 2),
            'comments': serializer.data
        }, status=200)
