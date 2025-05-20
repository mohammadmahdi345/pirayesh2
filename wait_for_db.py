# import time
# import socket
# from decouple import config
# import os
#
#
# DB_HOST = config("DB_HOST", default="db")
# DB_PORT = config("DB_PORT", default=3306, cast=int)
#
# while True:
#     try:
#         socket.create_connection((DB_HOST, DB_PORT), timeout=5)
#         print("✅ Database is up!")
#         break
#     except OSError:
#         print("⏳ Waiting for database...")
#         time.sleep(2)
import time
import MySQLdb

DB_HOST = "db"  # اینجا باید اسم سرویس db که در docker-compose تعریف کرده‌ای وارد بشه
DB_USER = "dev_user"
DB_PASSWORD = "dev_mmd1234"
DB_NAME = "dev_db"

while True:
    try:
        connection = MySQLdb.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            db=DB_NAME
        )
        connection.close()
        break
    except MySQLdb.OperationalError:
        print("Database is not ready yet, retrying in 5 seconds...")
        time.sleep(5)