from django.contrib import admin

from .models import *

@admin.register(Appointments)
class AppoAdmin(admin.ModelAdmin):
    list_display = ('status', 'is_off', 'created_time')

    def is_off(self, obj):
        if obj.off:
            return obj.off.is_valid()
        return None



# admin.site.register(Appointments, AppoAdmin)
admin.site.register(HairStyle)
admin.site.register(HallManagement)
admin.site.register(HallImage)
admin.site.register(Off)


