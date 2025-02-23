from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from apps.accounts.models import CustomUser

# ✅ Register CustomUser in Django Admin
class CustomUserAdmin(UserAdmin):
    list_display = ('id', 'username', 'email', 'is_staff', 'is_active')  # Display these fields in the admin panel
    search_fields = ('username', 'email')  # Allow searching by username and email
    list_filter = ('is_staff', 'is_superuser', 'is_active')  # Add filters
    ordering = ('id',)

# ✅ Register the custom user model
admin.site.register(CustomUser, CustomUserAdmin)
