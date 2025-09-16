
from rest_framework.routers import SimpleRouter
from django.urls import path
from .views import (HairStylesView, AppointmentsView, AdminAppointmentsView,
                    OffView, HallManagementView, SearchView, CommentView, CommentStatsView, CommentAllStatsView
                    , AllAppointmentView,OneAppointmentView,AvailableTimeSlotsAPIView)

router = SimpleRouter()
router.register('hairs', HairStylesView, basename='hairs')



urlpatterns = [
    path('Appointments/cancelled/<int:pk>/', AppointmentsView.as_view(), name='Appointments'),
    path('Appointments/admin/<int:pk>/', AdminAppointmentsView.as_view(), name='Appointments-admin'),
    path('Appointments/all/', AllAppointmentView.as_view(), name='all-Appointments'),
    path('Appointments/', OneAppointmentView.as_view(), name='one-Appointments'),
    path('offs/', OffView.as_view(), name='off'),
    path('hall/', HallManagementView.as_view(), name='hall'),
    path('search/<str:name>/', SearchView.as_view(), name='search'),
    path('comment/', CommentView.as_view(), name='comment'),
    path('timeslots/', AvailableTimeSlotsAPIView.as_view(), name='timeslots'),
    path('comment/admin/', CommentStatsView.as_view(), name='commen-admin'),
    path('comment/admin/all/', CommentAllStatsView.as_view(), name='commen-admin-all'),

] + router.urls