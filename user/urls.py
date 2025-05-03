from django.urls import path , include
from .views import RegisterView, CustomLoginView
#
urlpatterns = [

  # مهم
    # path('api/login/', CustomLoginView.as_view(), name='custom_login'),
    path('auth/register/', RegisterView.as_view()),
    path('auth/login/', CustomLoginView.as_view()),

]