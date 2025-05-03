from django.urls import path

from .views import HairStylesView, AppointmentsView, AdminAppointmentsView

urlpatterns = [
    path('hairstyles/', HairStylesView.as_view(), name='hairstyles'),
    path('Appointments/', AppointmentsView.as_view(), name='Appointments'),
    path('Appointments/admin/', AdminAppointmentsView.as_view(), name='Appointments-admin'),
]