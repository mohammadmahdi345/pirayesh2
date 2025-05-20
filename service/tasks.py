import logging
from celery import shared_task
from django.core.mail import send_mail
from django.utils import timezone

from user.models import User

from .models import HallManagement, Appointments, Off

logger = logging.getLogger(__name__)  # ایجاد logger برای این ماژول

@shared_task
def send_post_notification():
    try:
        hall = HallManagement.objects.first()
        users = User.objects.filter(notification=True)

        for user in users:
            if hall.closed:
                send_mail(
                    subject=f'{hall.name} بسته است',
                    message=f"سلام {user.first_name}،\nوضعیت سالن {hall.name} تغییر کرده است.",
                    from_email="no-reply@yourdomain.com",
                    recipient_list=[user.email],
                    fail_silently=True
                )
                logger.info(f"Email sent to {user.email} : {hall.name} بسته است")
            else:
                send_mail(
                    subject=f'{hall.name} باز است',
                    message=f"سلام {user.first_name}،\nوضعیت سالن {hall.name} تغییر کرده است.",
                    from_email="no-reply@yourdomain.com",
                    recipient_list=[user.email],
                    fail_silently=True
                )
                logger.info(f"Email sent to {user.email} : {hall.name} باز است")

    except Exception as e:
        logger.error(f"[TASK ERROR]: {e}", exc_info=True)



from django.db.models import Count

@shared_task
def send_off_notification():
    users = User.objects.filter(notification=True)

    for user in users:
        approved_appointments_count = Appointments.objects.filter(
            user=user,
            status=Appointments.Status.approved
        ).count()

        if approved_appointments_count > 0 and approved_appointments_count % 3 == 0:
            off = Off.objects.filter(
                is_active=True,
                start_at__lte=timezone.now(),
                end_at__gte=timezone.now()
            ).first()

            if off:
                try:
                    send_mail(
                        subject='کد تخفیف آمادس!!',
                        message=(
                            f"سلام {user.first_name}،\n"
                            f"به دلیل سه سرویسی که برای شما با موفقیت انجام شد، "
                            f"رزرو بعدی شما شامل تخفیف {off.discount_percent}% است."
                        ),
                        from_email="no-reply@yourdomain.com",
                        recipient_list=[user.email],
                        fail_silently=False
                    )
                    logger.info(f"Email sent to {user.email}")
                except Exception as e:
                    logger.error(f"Failed to send email to {user.email}: {str(e)}", exc_info=True)