from random import random
from django.utils import timezone
from django.db.models import Q
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from random import *
from rest_framework.permissions import AllowAny
from .models import *
from .serializers import *
from django.db.models import Q
from drf_spectacular.utils import extend_schema
from django.db.models import Avg
from user.models import User


class HairStylesView(viewsets.ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    queryset = HairStyle.objects.all()
    serializer_class = HairStylesSerializer

class AppointmentsView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = AppointmentsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user, status='waiting')
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def patch(self, request, pk):
        appointments = get_object_or_404(Appointments, pk=pk, user=request.user)
        if appointments.status != 'waiting':
            return Response({'detail':'فقط رزروهای در انتظار را می‌توان لغو کرد'}, status=status.HTTP_400_BAD_REQUEST)
        appointments.status = 'cancelled'
        appointments.save()
        return Response({'detail':'رزرو کنسل شد'}, status=status.HTTP_200_OK)

@extend_schema(summary="عوض کردن وضعیت کاربر", tags=["Admin"])
class AdminAppointmentsView(APIView):
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


# class OffView(APIView):
#     permission_classes = [IsAuthenticated]
#
#     def get(self, request):
#         try:
#             appoint = Appointments.objects.filter(user=request.user, status='approved')
#         except Exception as e:
#             return Response({'error':str(e), 'type':e.__class__.__name__}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#         if len(appoint) % 3 == 1:
#             offs = Off.objects.filter(is_active=True, start_at__lte=timezone.now(), end_at__gte=timezone.now())
#             if offs.exists():
#                 # برای سادگی اولین تخفیف معتبر را برمی‌گردانیم
#                 off = offs.first()
#
#                 off.is_active = True
#                 return Response({
#                     "code": off.code,
#                     "discount_percent": off.discount_percent,
#                     "description": off.description
#                 })
#         else:
#             return Response(len(appoint), status=status.HTTP_403_FORBIDDEN)
#
#             return Response({"detail": "No valid discount available."})
# class OffView(APIView):
#     permission_classes = [IsAuthenticated]
#
#     def post(self, request):
#         try:
#             appoint = Appointments.objects.filter(user=request.user, status='approved')
#         except Exception as e:
#             serializer = AppointmentsSerializer(data=request.data)
#             serializer.is_valid(raise_exception=True)
#             serializer.save(user=request.user, status='waiting')
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         if len(appoint) % 3 == 1:
#             offs = Off.objects.filter(is_active=True, start_at__lte=timezone.now(), end_at__gte=timezone.now())
#             if offs.exists():
#                 # برای سادگی اولین تخفیف معتبر را برمی‌گردانیم
#                 off = offs.first()
#                 off.is_active = True
#                 serializer = OffSerializer(data=request.data)
#                 serializer.is_valid(raise_exception=True)
#                 serializer.save(user=request.user, status='waiting', off=off)
#                 return Response(serializer.data, status=status.HTTP_201_CREATED)
#
#                 # return Response({
#                 #     "appointment_id": appointment.id,
#                 #     "hairstyle": hairstyle.name,
#                 #     "original_price": str(hairstyle.price),
#                 #     "final_price": str(appointment.price()),
#                 #     "discount_applied": off.code if off else None,
#                 # }, status=status.HTTP_201_CREATED)
#         else:
#             return Response(len(appoint), status=status.HTTP_403_FORBIDDEN)
#
#             return Response({"detail": "No valid discount available."})
@extend_schema(summary="ایجاد رزرو و بررسی تعداد رزرو های پیشین(اگر باقی مونده تعداد رزرو های موفق به 3 صفر باشه تخفیف اعمال میشه)")
class OffView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        approved_appointments = Appointments.objects.filter(user=request.user, status=Appointments.Status.approved)
        # total = approved_appointments + 1
        # چک می‌کنیم آیا نوبت جدید واجد شرایط تخفیف هست یا نه
        is_eligible_for_discount = len(approved_appointments) % 3 == 0

        # اگر واجد شرایط تخفیف است
        if is_eligible_for_discount:
            active_offs = Off.objects.filter(
                is_active=True,
                start_at__lte=timezone.now(),
                end_at__gte=timezone.now()
            )
            if active_offs.exists():
                off = active_offs.first()
                serializer = OffSerializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                serializer.save(user=request.user, status='waiting', off=off)
                # response_data = OffSerializer(appointment).data
                response_data = serializer.data
                return Response(response_data, status=status.HTTP_201_CREATED)

        # در غیر این صورت، نوبت بدون تخفیف ثبت می‌شود
        serializer = AppointmentsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user, status='waiting')
        return Response({
            'len': is_eligible_for_discount,
            'appointment': serializer.data
        }, status=status.HTTP_201_CREATED)

    def get(self, request):

        reservs1 = Appointments.objects.filter(user=request.user, status='waiting')
        reservs2 = Appointments.objects.filter(user=request.user, status='approved')

        serializer1 = OffSerializer(reservs1, many=True)
        serializer2 = OffSerializer(reservs2, many=True)

        return Response({'waiting reservs': serializer1.data,
                         'approved reservs': serializer2.data},
                        status=status.HTTP_200_OK)



class HallManagementView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        hall = HallManagement.objects.first()
        serializer = HallManagementSerializer(hall)
        return Response(serializer.data, status=status.HTTP_200_OK)

        

class SearchView(APIView):

    def get(self, name):
        search = request.data.get('search')
        search = HairStyle.objects.filter(name__icontains=name)
        serializer = HairStylesSerializer(search, many=True)
        return Response(serializer.data, 200)

@extend_schema(summary="امتیاز و نظر کاربرانی راجب سرویس")
class CommentView(APIView):
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



@extend_schema(summary="میانگین امتیاز کاربران", tags=["Admin"])
class CommentStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        users_with_avg = User.objects.annotate(
            average_point=Avg('comments__point')
        ).order_by('-average_point')

        data = []
        for user in users_with_avg:
            if user.average_point is None:
                continue  # کاربرانی که هنوز نظری ندادن رد می‌کنیم

            # لیست کامنت‌هاش رو می‌گیریم
        comments = Comment.objects.filter(user=user).order_by('-created_at')
        comments_data = [
            {
                "point": comment.point,
                "description": comment.description,
                "created_at": comment.created_at,
            }
            for comment in comments
        ]

        data.append({
            "user_id": user.id,
            "username": user.username,
            "average_point": round(user.average_point, 2),
            "comments": comments_data,
        })

        return Response(data)
