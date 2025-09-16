import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings.dev')

app = Celery('pirayesh')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

app.conf.beat_schedule = {
    'check-appointments-every-15-minutes': {
        'task': 'service.tasks.send_time_slot_notification',
        'schedule': crontab(minute='*/15'),  # هر ۱۵ دقیقه
    },
}