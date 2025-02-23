# openpromptbank/settings/production.py
from .base import *

DEBUG = False

ALLOWED_HOSTS = ['openpromptbank.com']



EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')  


CORS_ALLOWED_ORIGINS = [
    "https://openpromptbank.com",
]

CORS_ALLOW_CREDENTIALS = True
CSRF_COOKIE_SECURE = True  # True in production with HTTPS
SESSION_COOKIE_SECURE = False
CSRF_USE_SESSIONS = True
CSRF_COOKIE_HTTPONLY = True

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('POSTGRES_DB'),
        'USER': env('POSTGRES_USER'),
        'PASSWORD': env('POSTGRES_PASSWORD'),
        'HOST': env('POSTGRES_HOST'),
        'PORT': env('POSTGRES_PORT'),
    }
}