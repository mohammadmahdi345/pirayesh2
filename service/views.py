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

from .models import *
from .serializers import *

class HairStylesView(viewsets.ReadOnlyModelViewSet):
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

class AdminAppointmentsView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        appointments = get_object_or_404(Appointments, pk=pk)
        new_status = request.data.get('status')
        if new_status not in appointments.status.values:
            return Response({'detail': 'درخواست نامعتبر است'}, status=status.HTTP_400_BAD_REQUEST)
        appointments.status = new_status
        appointments.save()
        return Response({'detail': 'وضعیت تغییر کرد'}, status=status.HTTP_200_OK)


