#
# from .base import *
#
# DEBUG = False  # False برای پروداکشن
#
# ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com']  # دامنه‌هایی که پروژه باید از آنها درخواست‌ها رو قبول کنه
#
#
#
# # تنظیمات دیتابیس
# DATABASES['default']['NAME'] = config('DB_NAME')
# DATABASES['default']['USER'] = config('DB_USER')
# DATABASES['default']['PASSWORD'] = config('DB_PASSWORD')
#
# # برای امنیت بیشتر
# SECURE_SSL_REDIRECT = True  # اطمینان از اینکه همه ارتباطات از طریق HTTPS انجام بشه
# CSRF_COOKIE_SECURE = True
# SESSION_COOKIE_SECURE = True
#
# INSTALLED_APPS += ['corsheaders']
#
# # MIDDLEWARE += [
# #     'corsheaders.middleware.CorsMiddleware', # باید قبل از CommonMiddleware باشه
# # ]
# REST_FRAMEWORK += {
# 'DEFAULT_THROTTLE_CLASSES': [
#         'rest_framework.throttling.UserRateThrottle',  # برای کاربر لاگین‌شده
#         'rest_framework.throttling.AnonRateThrottle',  # برای کاربر ناشناس (غیر لاگین‌شده)
#     ],
#     'DEFAULT_THROTTLE_RATES': {
#         'user': '1000/day',  # هر کاربر لاگین‌شده حداکثر ۱۰۰۰ درخواست در روز
#         'anon': '100/day',   # هر کاربر غیرلاگین‌شده حداکثر ۱۰۰ درخواست در روز
#     }
# }
#
# X_FRAME_OPTIONS = 'DENY'
# SECURE_BROWSER_XSS_FILTER = True
# SECURE_CONTENT_TYPE_NOSNIFF = True
#
# # فقط به این دامنه اجازه بده به API دست بزنه:
# # CORS_ALLOWED_ORIGINS = [
# #     "https://frontend.yourdomain.com",
# #     "http://localhost:3000",  # برای توسعه
#
# # استفاده از Gunicorn برای اجرای سرور در پروداکشن
# # می‌توانید Gunicorn رو به‌جای `runserver` استفاده کنید.