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
from drf_spectacular.utils import extend_schema
#
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
        gateway = GateWay.objects.first()

        appo = get_object_or_404(Appointments,user=request.user,pk=pk,status='waiting')

        payment = Payment.objects.create(
            user=request.user,
            gateway= gateway,
            reservation= appo,
            paid_at= timezone.now(),
            ref_id=str(uuid.uuid4())
        )

        is_paid = random.choice([True,False])

        if is_paid:
            payment.is_paid = True
            payment.save()
            return Response({
                'detail':'payment is succesful',
                'user': payment.user.username,
                'paid_at': payment.paid_at,
                'ref_id': payment.ref_id,
                'pk': pk,
            }, status=201)
        else:
            return Response({
                'detail': 'payment is unsuccesful',
                'user': payment.user.username,
                'ref_id': payment.ref_id,
                'pk': pk,
            }, status=402)


