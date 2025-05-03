from django.db import models
from django.conf import settings


class Time(models.Model):
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)



class HairStyle(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=750)
    time_excepted = models.DurationField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    is_off = models.BooleanField(default=False)
    off = models.DecimalField(max_digits=8, decimal_places=2,default=0)
    image = models.ImageField(upload_to='haircuts/')

    def __str__(self):
        return self.name

class Appointments(Time):
    # FILE_AUDIO = 1
    # FILE_VIDEO = 2
    # FILE_PDF = 3
    # FILE_TYPES = (
    #     (FILE_AUDIO, _('audio')),
    #     (FILE_VIDEO, _('video')),

    #     (FILE_PDF, _('pdf'))
    # )

    class Status(models.TextChoices):
        approved = 'approved'
        waiting = 'waiting'
        cancelled = 'cancelled'
    user = models.ForeignKey(to=settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    hairstyle = models.ForeignKey(HairStyle, on_delete=models.PROTECT)
    experience = models.CharField(max_length=750)
    status = models.CharField(max_length=50, choices=Status.choices, default=Status.waiting)


    def price(self):
        if self.hairstyle.is_off:
            return self.hairstyle.off
        else:
            return self.hairstyle.price

    def __str__(self):
        return self.user.username



class HallManagement(models.Model):
    info = models.TextField(max_length=5020)
    address = models.CharField(max_length=1000)
    phone_number = models.CharField(max_length=12)
    open_time = models.TimeField(null=True, blank=True)
    close_time = models.TimeField(null=True, blank=True)
    closed = models.BooleanField(default=False)
    images = models.ManyToManyField('service.HallImage')





class HallImage(models.Model):
    image = models.ImageField(upload_to='hall_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)


