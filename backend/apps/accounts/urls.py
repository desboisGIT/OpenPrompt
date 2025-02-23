from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset'),
    path('password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('email-verify/', SendEmailVerificationView.as_view(), name='send-email-verification'),
    path('email-verify/<uidb64>/<token>/', VerifyEmailView.as_view(), name='email-verify'),
    
    path('social-auth/<str:provider>/', SocialAuthCallbackView.as_view(), name='social-auth-callback'),
]
