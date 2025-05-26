from decimal import Decimal

from django.core.validators import MaxValueValidator, MinValueValidator
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.utils import timezone
from datetime import time, timedelta

from django.db import models
from django.conf import settings

# from service.tasks import send_post_notification

# مدل ابسترکت
class Time(models.Model):
    created_time = models.DateTimeField(auto_now_add=True,default=timezone.now)
    updated_time = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

# مدل مو
class HairStyle(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=750)
    time_excepted = models.DurationField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    off = models.ForeignKey('Off', on_delete=models.PROTECT, blank=True, null=True)
    image = models.ImageField(upload_to='haircuts/')


    def __str__(self):
        return self.name
# رزرو کاربران
class Appointments(models.Model):


    class Status(models.TextChoices):
        approved = 'approved', 'تایید شده'
        waiting = 'waiting', 'در انتظار'
        cancelled = 'cancelled', 'لغو شده'

    user = models.ForeignKey(to=settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    hairstyle = models.ForeignKey(HairStyle, on_delete=models.PROTECT)
    status = models.CharField(max_length=50, choices=Status.choices, default=Status.waiting)
    off = models.ForeignKey('Off', on_delete=models.PROTECT, blank=True, null=True)
    created_time = models.DateTimeField(auto_now_add=True)
    date = models.DateField()
    time_slot = models.ForeignKey('TimeSlot', on_delete=models.CASCADE)
    notified_before_slot = models.BooleanField(default=False)


    def price(self):
        if self.off and self.off.is_valid() and self.off.discount_percent:
            discount_amount = (self.hairstyle.price * Decimal(self.off.discount_percent)) / 100
            return self.hairstyle.price - discount_amount
        return self.hairstyle.price


    def __str__(self):
        return self.user.username
# سیگنال زیر برای اینه که اگه کاربر سه رزرو ثبت شده داشته باشه یا مضرب 3 باشه واسه رزرو بعدی تخفیف میگیره
@receiver(post_save, sender=Appointments)
def check_discount_condition(sender, instance, created, **kwargs):
    if created or instance.status != Appointments.Status.approved:
        return

    user = instance.user
    approved_count = Appointments.objects.filter(
        user=user,
        status=Appointments.Status.approved
    ).count()

    if approved_count > 0 and approved_count % 3 == 0:
        from .tasks import send_off_notification
        send_off_notification.delay()




# مدیریت سالن
class HallManagement(models.Model):
    name = models.CharField(max_length=30)
    info = models.TextField(max_length=5020)
    address = models.CharField(max_length=1000)
    phone_number = models.CharField(max_length=12)
    open_time = models.TimeField(null=True, blank=True)
    close_time = models.TimeField(null=True, blank=True)
    closed = models.BooleanField(default=True)
    images = models.ManyToManyField('service.HallImage')

#سیگنال های زیر برای اینن که اگه وضعیت سالن تغییر کرد تسک مربوط به ارسال نوتیف به کاربران اجرا شه
@receiver(pre_save, sender=HallManagement)
def cache_old_closed(sender, instance, **kwargs):
    if instance.pk:
        old_instance = sender.objects.get(pk=instance.pk)
        instance._old_closed = old_instance.closed
    else:
        instance._old_closed = None


@receiver(post_save, sender=HallManagement)
def notify_on_hall_status_change(sender, instance, created, **kwargs):
    if not created:
        if hasattr(instance, '_old_closed') and instance._old_closed != instance.closed:
            from .tasks import send_post_notification
            send_post_notification.delay()

# وقت های سالن
class TimeSlot(models.Model):
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_booked = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.start_time} - {self.end_time} {'(رزرو شده)' if self.is_booked else ''}"


# عکس های سالن
class HallImage(models.Model):
    image = models.ImageField(upload_to='hall_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

# مدل تخفیف
class Off(models.Model):

    code = models.CharField(max_length=10)
    description = models.CharField(max_length=700)
    start_at = models.DateTimeField()
    end_at = models.DateTimeField()
    is_active = models.BooleanField(default=False)
    discount_percent = models.PositiveIntegerField(null=True, blank=True)

    def is_valid(self):
        now = timezone.now()
        return self.is_active and self.start_at <= now <= self.end_at


    def __str__(self):
        return self.code


# مدل برای نظر کاربران
class Comment(models.Model):
    user = models.ForeignKey(to=settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='comments')
    description = models.TextField(max_length=1000, help_text='لطفا نظروانتقاد و پیشنهادات خود را بنویسید')
    point = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(5)])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user} - {self.point}⭐"



