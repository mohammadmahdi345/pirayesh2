# name: Django
# CI / CD
# Pipeline
#
# on:
# push:
# branches:
# - main  # یا هر برانچی که برای دیپلوی استفاده می‌کنید
# pull_request:
# branches:
# - main
#
# jobs:
# test:
# runs - on: ubuntu - latest  # سیستم عامل برای اجرای کارها
#
# steps:
# - name: Checkout
# repository
# uses: actions / checkout @ v2  # این عمل برای چک کردن کد از مخزن است
#
# - name: Set
# up
# Python
# uses: actions / setup - python @ v2
# with:
#     python - version: '3.8'  # نسخه پایتون مورد استفاده در پروژه
#
# - name: Install
# dependencies
# run: |
# python - m
# pip
# install - -upgrade
# pip
# pip
# install - r
# requirements.txt  # نصب پکیج‌های مورد نیاز
#
# - name: Run
# tests
# run: |
# python
# manage.py
# test  # اجرای تست‌ها برای اطمینان از صحت کد
#
# deploy:
# runs - on: ubuntu - latest
# needs: test  # اطمینان از اینکه ابتدا تست‌ها موفقیت‌آمیز باشند
#
# steps:
# - name: Checkout
# repository
# uses: actions / checkout @ v2
#
# - name: Set
# up
# Python
# uses: actions / setup - python @ v2
# with:
#     python - version: '3.8'
#
# - name: Install
# dependencies
# run: |
# python - m
# pip
# install - -upgrade
# pip
# pip
# install - r
# requirements.txt
#
# - name: Deploy
# to
# Production
# run: |
# # دستوراتی که برای دیپلوی به سرور خود نیاز دارید
# ssh
# user @ yourserver.com
# 'cd /path/to/your/project && git pull && docker-compose up -d'
# # این دستور با SSH به سرور شما وصل می‌شود و کدهای جدید را دیپلوی می‌کند
