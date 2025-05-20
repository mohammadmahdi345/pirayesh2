from .base import *

DEBUG = True  # True برای توسعه

SECRET_KEY = 'mmdi1234'
ALLOWED_HOSTS = ['*']

# تنظیمات دیتابیس مخصوص محیط توسعه (این‌جا می‌تونید از SQLite استفاده کنید یا MySQL محلی)
# DATABASES['default']['NAME'] = config('DB_DEV_NAME', default='dev_db')
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'dev_db',  # نام دیتابیس
        'USER': 'dev_user',  # نام کاربری
        'PASSWORD': 'dev_mmd1234',  # پسورد
        'HOST': 'db',  # نام سرویس پایگاه داده در docker-compose.yml
        'PORT': '3306',  # پورت پایگاه داده
    }
}
CELERY_BROKER_URL = 'redis://redis:6379/0'
CELERY_RESULT_BACKEND = 'redis://redis:6379/0'
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
# INSTALLED_APPS += [
#     'debug_toolbar',
# ]
#
# MIDDLEWARE += [
#     'debug_toolbar.middleware.DebugToolbarMiddleware',
# ]
