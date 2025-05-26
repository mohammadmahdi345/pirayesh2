from django.db import models
from django.conf import settings
from django.utils import timezone
from decimal import Decimal, ROUND_HALF_UP

class GateWay(models.Model):

    name = models.CharField(max_length=30)
    description = models.CharField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name






class Payment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    gateway = models.ForeignKey('GateWay', on_delete=models.CASCADE)  # چون تستی، رشته ساده
    reservation = models.ForeignKey('service.Appointments', on_delete=models.CASCADE)

    is_paid = models.BooleanField(default=False)
    ref_id = models.CharField(max_length=100, blank=True, null=True)
    paid_at = models.DateTimeField(blank=True, null=True)

    # @property
    # def price(self):
    #     return self.reservation.price
    @property
    def price(self):
        hairstyle_price = self.reservation.hairstyle.price
        off = getattr(self.reservation, 'off', None)
        if off and hasattr(off, 'is_valid') and off.is_valid() and off.discount_percent:
            discount = (hairstyle_price * Decimal(off.discount_percent)) / 100
            final_price = hairstyle_price - discount
        else:
            final_price = hairstyle_price
        return final_price.quantize(Decimal('0.01'))

    def __str__(self):
        return f'Payment for {self.user.username} - {self.price} تومان - Paid: {self.is_paid}'