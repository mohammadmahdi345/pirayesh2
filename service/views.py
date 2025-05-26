# ماژول های داخلی پایتون
from datetime import datetime
from random import random
from random import *
# ماژول های rest
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
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

    def patch(self, request, pk):
        appointments = get_object_or_404(Appointments, pk=pk, user=request.user)
        if appointments.status != 'waiting':
            return Response({'detail':'فقط رزروهای در انتظار را می‌توان لغو کرد'}, status=status.HTTP_400_BAD_REQUEST)
        appointments.status = 'cancelled'
        appointments.save()
        return Response({'detail':'رزرو کنسل شد'}, status=status.HTTP_200_OK)

@extend_schema(summary="عوض کردن وضعیت کاربر توسط کاربر ادمین", tags=["Admin"])
class AdminAppointmentsView(APIView):
    """برای عوض کردن وضعیت یک رزرو توسط ادمین"""
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        appointments = get_object_or_404(Appointments, pk=pk)
        new_status = request.data.get('status')
        valid_statuses = [status[0] for status in Appointments.Status.choices]
        if new_status not in valid_statuses:
            return Response({'detail': 'درخواست نامعتبر است'}, status=status.HTTP_400_BAD_REQUEST)
        appointments.status = new_status
        appointments.save()
        return Response({'detail': 'وضعیت تغییر کرد'}, status=status.HTTP_200_OK)


@extend_schema(
    summary="ایجاد رزرو با بررسی تخفیف",
    description="اگر کاربر تعداد رزرو تایید شده‌اش مضربی از 3 باشد، تخفیف فعال اعمال می‌شود.")
class OffView(APIView):
    '''این ویو رزرو ثبت میکنه واگر کاربر تعداد رزرو تایید شده‌اش مضربی از 3 باشد، تخفیف فعال اعمال می‌شود.
    همچنین در متود get رزرو هایی با وضعیت انجام شده و همچنین در حال انتظار و کنسل شده رو به کاربر نشون میده'''
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = AppointmentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        date = serializer.validated_data['date']
        time_slot = serializer.validated_data['time_slot']

        approved_appointments = Appointments.objects.filter(user=user, status=Appointments.Status.approved)
        is_eligible_for_discount = len(approved_appointments) > 0 and len(approved_appointments) % 3 == 0

        if is_eligible_for_discount:
            active_offs = Off.objects.filter(
                is_active=True,
                start_at__lte=timezone.now(),
                end_at__gte=timezone.now()
            )
            if active_offs.exists():
                off = active_offs.first()
                # ثبت رزرو با تخفیف
                serializer.save(user=user, status=Appointments.Status.waiting, off=off,
                                    date=date, time_slot=time_slot)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

        # ثبت رزرو بدون تخفیف
        serializer.save(user=user, date=date, time_slot=time_slot,
                                                  status=Appointments.Status.waiting)
        return Response({"message": "رزرو ثبت شد(بدون تخفیف)", "id": serializer.instance.id}, status=status.HTTP_201_CREATED)

    def get(self, request):
        appo_approved = Appointments.objects.filter(user=request.user, status="approved")
        appo = Appointments.objects.filter(user=request.user).exclude(status="approved")
        serializer1 = AppointmentCreateSerializer(appo_approved)
        serializer2 = AppointmentCreateSerializer(appo)

        return Response({'detail':f'your Appointments:',
                         'approved_Appointment':serializer1.data,
                         'other_Appointment':serializer2.data})
#________________________________________________________________________________________________________________________
@extend_schema(summary="نشان دادن وقت های خالی")
class AvailableTimeSlotsAPIView(APIView):
    '''این ویو طبق ورودی کاربر نوبت های خالی اون روز رو بدست میاره'''
    permission_classes = [permissions.AllowAny]  # اجازه دسترسی بدون لاگین

    def get(self, request):
        date_str = request.query_params.get('date')

        if not date_str:
            return Response({'detail':'لطفا مقدار روز رو اورد کنید'},status=status.HTTP_404_NOT_FOUND)
        try:
            date = datetime.strptime(date_str, '%y-%m-%d')
        except ValueError:
            return Response({'detail':'لطفا مقدار درست وارد کنید'}, status=400)

        booked_time = Appointments.filter(date=date).values_list('time_slot_id', flat=True)
        available_time = TimeSlot.objects.exclude(id__in=booked_time)

        data = [
            {
                'start_time':slot.start_time,
                'end_time': slot.end_time,
                'id': slot.id,
            }
            for slot in available_time
        ]
        return Response(data, status=200)

@extend_schema(summary="مدیریت سالن")
class HallManagementView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        hall = HallManagement.objects.first()
        serializer = HallManagementSerializer(hall)
        return Response(serializer.data, status=status.HTTP_200_OK)

        
@extend_schema(summary="سرچ بین مدل موها")
class SearchView(APIView):
    '''سرچ در بین مدل موها'''

    def get(self, request, name):
        search = request.data.get('search')
        search = HairStyle.objects.filter(name__icontains=name)
        serializer = HairStylesSerializer(search, many=True)
        return Response(serializer.data, 200)

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
            else:
                return Response(serializer.errors, status=400)
        else:
            return Response({'detail':'لطفا اول رزروی ثبت کنید'}, status=400)



@extend_schema(summary="میانگین امتیاز و نظرات هر کاربر", tags=["Admin"])
class CommentStatsView(APIView):
    """میانگین امتیاز و نظرات هر کاربر رو نشون میده """
    permission_classes = [IsAdminUser]

    def get(self, request):

        avarage_user = User.objects.annotate(
            avarage_point=Avg('comments__point')
        ).order_by('avarage_point')

        data = []
        for user in avarage_user:
            if user.avarage_point is None:
                continue

            comments = Comment.objects.filter(user=user).order_by('created_at')
            comment_list = [
                {
                    'comments_point': comment.point,
                    'comments_description': comment.description,
                    'comments_created_at': comment.created_at
                }
                for comment in comments
            ]

            data.append({
                'user_id': user.id,
                'user_username': user.username,
                'avarage_point': round(user.avarage_point, 2),
                'comments': comment_list
            })

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
