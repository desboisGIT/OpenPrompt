# openpromptbank/settings/__init__.py
try:
    from .development import *
except ImportError:
    from .base import *
