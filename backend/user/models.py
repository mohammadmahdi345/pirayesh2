from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    notification = models.BooleanField(default=True)
