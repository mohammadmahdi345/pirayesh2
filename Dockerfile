# FROM python:3.10.2
#
#
# WORKDIR /app
#
# ADD r.txt .
#
# RUN pip install -i https://mirrors.aliyun.com/pypi/simple/ -r r.txt
# RUN python manage.py collectstatic --noinput
#
# CMD ["gunicorn", "your_project_name.wsgi:application", "--bind", "0.0.0.0:8005"]
# EXPOSE 8005

FROM python:3.10.2

WORKDIR /app

ADD r.txt .

RUN pip install --upgrade pip && pip install -r r.txt

RUN python manage.py collectstatic --noinput || true

# CMD ["gunicorn", "pirayesh.wsgi:application", "--bind", "0.0.0.0:8005", "--reload"]
CMD python manage.py runserver 0.0.0.0:8005

EXPOSE 8005
