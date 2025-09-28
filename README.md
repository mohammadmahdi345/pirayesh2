# 💈 پروژه سایت پیرایش مردانه  
**Frontend:** React  
**Backend:** Django & Django REST Framework  

این پروژه یک **سیستم رزرو نوبت آنلاین برای سالن پیرایش مردانه** است. کاربران می‌توانند به‌صورت مجازی وقت رزرو کنند، نظر بدهند و به کیفیت خدمات امتیاز دهند.  
احراز هویت با **OAuth2** پیاده‌سازی شده است.  

---

## ✨ ویژگی‌ها

- ثبت‌نام و ورود با نام کاربری و رمز عبور  
- رزرو نوبت آنلاین  
- سیستم نظردهی و امتیازدهی به خدمات  
- ارسال نوتیف خودکار با Celery در شرایط خاص  
- مدیریت امنیت با OAuth2  
- تست خودکار ویوها با `pytest`  
- پنل مدیریت قدرتمند Django Admin  
- طراحی سه‌بعدی برای ظاهر سایت  
- تست عملکرد سیستم تحت بار زیاد با **Locust**  
- استفاده از دیتابیس **MySQL**  

---

## 🔐 امنیت  

- [ ] فعال‌سازی HTTPS (`SECURE_SSL_REDIRECT = True`)  
- [ ] جلوگیری از CSRF و XSS  
- [ ] تنظیم `ALLOWED_HOSTS` و `DEBUG = False` در محیط Production  
- [ ] بررسی MIME type و محدودیت حجم فایل‌های آپلودی  
- [ ] محافظت در برابر brute-force (با `django-axes` یا Rate Limiting در DRF)  
- [ ] ذخیره مقادیر حساس در `.env` (با `django-environ`)  
- [ ] محدود کردن CORS فقط به دامنه فرانت‌اند (`django-cors-headers`)  
- [ ] استفاده از Permissionها مانند `IsAuthenticated`, `IsOwner`, `IsAdminUser`  

---

## ⚙️ پیش‌نیازها  

- Python 3.8+  
- Django 3.2+  
- Django REST Framework  
- MySQL  
- pip  

---

## 🚀 نصب و راه‌اندازی  

1. کلون کردن پروژه:
   ```bash
   git clone https://github.com/mohammadmahdi345/pirayesh2.git
   cd pirayesh2
