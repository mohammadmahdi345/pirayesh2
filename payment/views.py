from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status, permissions
from django.utils import timezone
import uuid
from rest_framework.views import APIView

from service.models import Appointments
from .models import Payment, GateWay
from .serializers import GateWaySerializer
import random

@extend_schema(summary="نشان دادن درگاه پرداخت های فعال")
class GateWayView(viewsets.ReadOnlyModelViewSet):
    """درگاه پرداخت های فعال رو نشون میده"""
    permission_classes = [IsAuthenticated]
    queryset = GateWay.objects.filter(is_active=True)
    serializer_class = GateWaySerializer


@extend_schema(summary="ویو پرداخت",
               description="ایدی درگاه رو میگیریم بعد اخرین آبجکت رزرو کاربر رو میگیرم و آبجکت"
                        "پرداخت میسازیم و تو دو حالت متفاوت(پرداخت موفق و غیر موفق)رو شبیه سازی کردم")
class PaymentView(APIView):
    """ویو پرداخت"""
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):

        gateway = get_object_or_404(GateWay, pk=pk) # ایدی درگاه رو از کاربر میگیریم

        try: # اخرین آبجکت رزرو کاربر رو میگیریم
            appo = Appointments.objects.filter(user=request.user, status=Appointments.Status.waiting).last()
        except Appointments.DoesNotExists:
            return Response({'detail': 'you have not reserv yet'}, status=404)

        payment = Payment.objects.create(
            user=request.user,
            gateway=gateway,
            reservation=appo,
            paid_at=timezone.now(),
            ref_id=str(uuid.uuid4())
        )

        is_paid = random.choice([True, False]) # دو سناریو مختلف رو برررسی میکنیم

        if is_paid: # اگه پرداخت موفق بود
            payment.is_paid = True
            payment.save()
            return Response({
                'detail':'payment successful',
                'user': payment.user.username,
                'paid_at': payment.paid_at,
                'ref_id':payment.ref_id
            }, status=200)
        else: # اگه پرداخت موفق نبود
            payment.is_paid = False
            payment.save()
            return Response({
                'detail':'payment unsuccessful',
                'user': payment.user.username,
                'ref_id':payment.ref_id
            }, status=402)


