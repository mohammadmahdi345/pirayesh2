from django.urls import path , include
from .views import RegisterView, CustomLoginView,UserGetView,UserView
#
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('users/', UserGetView.as_view(), name='users'),
    path('users/me/', UserView.as_view(), name='myuser'),
]