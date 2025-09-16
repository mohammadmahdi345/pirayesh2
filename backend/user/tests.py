from decouple import config

print(config('OAUTH_CLIENT_ID', default='NOT FOUND'))