
from rest_framework.routers import SimpleRouter
from django.urls import path
from .views import (HairStylesView, AppointmentsView, AdminAppointmentsView,
                    Off, OffView, HallManagementView, SearchView, CommentView, CommentStatsView, CommentAllStatsView)

router = SimpleRouter()
router.register('hairs', HairStylesView, basename='hairs')



urlpatterns = [
    path('Appointments/cancelled', AppointmentsView.as_view(), name='Appointments'),
    path('Appointments/admin/<int:pk>/', AdminAppointmentsView.as_view(), name='Appointments-admin'),
    path('offs/', OffView.as_view(), name='off'),
    path('hall/', HallManagementView.as_view(), name='hall'),
    path('search/<str:name>/', SearchView.as_view(), name='search'),
    path('comment/', CommentView.as_view(), name='comment'),
    path('comment/admin/', CommentStatsView.as_view(), name='commen-admin'),
    path('comment/admin/all/', CommentAllStatsView.as_view(), name='commen-admin-all'),

] + router.urls