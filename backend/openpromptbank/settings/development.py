# openpromptbank/settings/development.py
from rest_framework.settings import APISettings
from datetime import timedelta
from pathlib import Path
from .base import *
import environ
import os

BASE_DIR = Path(__file__).resolve().parent.parent.parent
env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

DEBUG = True

########################################## EMAIL ##########################################

# For testing (prints emails to console)
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
DEFAULT_FROM_EMAIL = 'no-reply@openpromptbank.com'

################################### CORS RELATED & AUTH ###################################

AUTHENTICATION_BACKENDS = (
    'social_core.backends.github.GithubOAuth2',
    'social_core.backends.google.GoogleOAuth2',
    'django.contrib.auth.backends.ModelBackend',
)

redirect_uri = "http://localhost:8000/api/v1/accounts/social-auth/google/"


CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]

CORS_ALLOW_CREDENTIALS = True
CSRF_COOKIE_SECURE = False  # True in production with HTTPS
SESSION_COOKIE_SECURE = False
CSRF_USE_SESSIONS = True
CSRF_COOKIE_HTTPONLY = True

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_COOKIE': 'access_token',
    'AUTH_COOKIE_HTTP_ONLY': True,  # Prevent JavaScript access
    'AUTH_COOKIE_SECURE': False,  # Change to True in production
    'AUTH_COOKIE_SAMESITE': 'Lax',  # Prevents CSRF attacks
}