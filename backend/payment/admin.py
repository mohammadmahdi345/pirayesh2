from django.contrib import admin

from payment.models import GateWay, Payment

admin.site.register(GateWay)
admin.site.register(Payment)

