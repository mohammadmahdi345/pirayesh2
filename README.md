# شبیه سازی سایتی برای سالن پیرایش مردانه – Backend with Django & DRF

این یک پروژه **سایت پیرایش مردانه** است که با استفاده از **Django REST Framework** ساخته شده. هدف پروژه پیاده‌سازی قابلیت رزرو نوبت مجازی برای یک سالن پیرایش است
این پروژه از سیستم oauth به عنوان احراز هویت استفاده میکند

## ویژگی‌ها:

- امکان ثبت‌نام و ورود با نام کاربری و پسوورد
- سیستم نظردهی و امتیازدهی به سطح کیفی سرویس و رزرو
- پیاده سازی تسک های مختلف برای ارسال نوتیف به کاربر در شرایط خاص
- مدیریت امنیت با oauth
- تست خودکار ویو ها با `pytest`
  - تست عملکرد سیستم زیر فشار زیاد با 'Locust'
  - 

## 🔐 امنیت

- [ ] فعال بودن HTTPS (`SECURE_SSL_REDIRECT = True`)
- [ ] جلوگیری از CSRF و XSS
- [ ] استفاده از `ALLOWED_HOSTS` و `DEBUG = False` در Production
- [ ] بررسی MIME type و حجم فایل‌های آپلودی
- [ ] محافظت در برابر brute-force (با `django-axes` یا rate limiting DRF)
- [ ] ذخیره مقادیر حساس در `.env` (با `django-environ`)
- [ ] CORS محدود فقط به دامنه‌ی فرانت‌اند (با `django-cors-headers`)
- [ ] محدودسازی دسترسی با `IsAuthenticated`, `IsOwner`, `IsAdminUser` و غیره

---
## پیش‌نیازها:

برای راه‌اندازی این پروژه به موارد زیر نیاز دارید:

- Python 3.8+
- Django 3.2+
- Django REST Framework
- mysql
- pip (برای نصب بسته‌ها)

## نصب و راه‌اندازی:

1. پروژه را کلون کنید:
    ```bash
    git clone https://github.com/mohammadmahdi345/pirayesh2.git
    cd pirayesh2
    ```


 # - این پروژه از دو فایل داکرکامپوز یکی برای محیط توسعه و دیگری برای محیط اصلی استفاده میکنه 
 
## ساختار پروژه

- `Dockerfile` : تعریف ساخت ایمیج داکر پروژه  
- `docker-compose.dev.yml` : تنظیمات محیط توسعه 
- `docker-compose.prod.yml` : تنظیمات محیط اصلی (پروداکشن)  

### اجرای پروژه در محیط توسعه (با Docker Compose)

```bash
docker-compose -f docker-compose.dev.yml up -d --build برای اجرای کانتینرها
docker-compose -f docker-compose.dev.yml down برای توقف کانتینرها
docker-compose -f docker-compose.dev.yml exec web pytest   اجرای تست ها با پایتست
locust -f locustfile.py اجرای تست عملکردی سیستم با 

- 📚 مستندات API

مستندات کامل و تعاملی API از طریق Swagger UI در دسترس است:

🔗 http://localhost:8005/api/docs/

این رابط به شما امکان می‌دهد تمام Endpointهای API را بررسی، تست و با احراز هویت استفاده کنید.
🔐 احراز هویت (OAuth2)

برخی از مسیرهای API نیاز به احراز هویت از طریق OAuth2 دارند.
نحوه استفاده از احراز هویت در Swagger:

    وارد آدرس مستندات Swagger شوید.

    روی دکمه‌ی "Authorize" در بالا سمت راست کلیک کنید.

    به صفحه ورود OAuth2 هدایت می‌شوید.

    پس از وارد کردن اطلاعات و تأیید دسترسی، Swagger توکن دسترسی را ذخیره می‌کند و در درخواست‌ها ارسال می‌کند.

    حالا می‌توانید به Endpointهای محافظت‌شده دسترسی داشته باشید. 
  

6. حالا می‌تونی به پروژه دسترسی پیدا کنی:
    - آدرس: (http://localhost:8005)


## مشارکت در پروژه:

اگر مایل به مشارکت در این پروژه هستید، می‌توانید از مراحل زیر پیروی کنید:

1. فورک کنید پروژه رو.
2. یک شاخه جدید بسازید (`git checkout -b feature-name`).
3. تغییرات مورد نظر رو اعمال کنید.
4. تغییرات رو کامیت کنید (`git commit -am 'Add new feature'`).
5. شاخه‌تون رو به گیت‌هاب پوش کنید (`git push origin feature-name`).
6. درخواست کشش (Pull Request) بدید.
