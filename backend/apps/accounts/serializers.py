from rest_framework.serializers import ModelSerializer, CharField, EmailField, ValidationError
from apps.accounts.models import CustomUser
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.password_validation import validate_password
from django.core.mail import send_mail
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.urls import reverse
from django.conf import settings

User = get_user_model()

# ✅ User Serializer
class UserSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'avatar']

# ✅ Register Serializer
class RegisterSerializer(ModelSerializer):
    password = CharField(write_only=True)
    email = EmailField()

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password']

    def validate_username(self, value):
        if CustomUser.objects.filter(username=value).exists():
            raise ValidationError("Username already exists")
        return value

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        user.is_active = False  # ✅ Require email verification
        user.save()
        return user

# ✅ Password Reset Request Serializer
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email does not exist.")
        return value

    def save(self, request):
        user = User.objects.get(email=self.validated_data['email'])
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        reset_url = request.build_absolute_uri(reverse('password-reset-confirm', kwargs={'uidb64': uid, 'token': token}))
        
        send_mail(
            subject="[OpenPromptBank] Reset Your Password",
            message=f"Click the link to reset your password: {reset_url}",
            from_email=settings.DEFAULT_FROM_EMAIL,  # ✅ Use env variable
            recipient_list=[user.email],
        )

# ✅ Email Verification Serializer
class EmailVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email']

    def send_verification_email(self, request):
        user = self.instance
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        verify_url = request.build_absolute_uri(reverse('email-verify', kwargs={'uidb64': uid, 'token': token}))

        send_mail(
            subject="[OpenPromptBank] Verify Your Email",
            message=f"Click the link to verify your email: {verify_url}",
            from_email=settings.DEFAULT_FROM_EMAIL,  # ✅ Use env variable
            recipient_list=[user.email],
        )
