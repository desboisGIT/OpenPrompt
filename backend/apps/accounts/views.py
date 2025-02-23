from apps.accounts.serializers import UserSerializer, RegisterSerializer, PasswordResetRequestSerializer, EmailVerificationSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated
from social_core.exceptions import MissingBackend, AuthException
from django.contrib.auth.tokens import default_token_generator
from social_django.utils import load_strategy, load_backend
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.utils.encoding import force_str
from apps.accounts.models import CustomUser
from rest_framework.views import APIView
from rest_framework import status
from django.conf import settings
import requests


User = get_user_model()

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            EmailVerificationSerializer(instance=user).send_verification_email(request)
            return Response({"message": "User registered. Please verify your email."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Login (Set JWT in HTTP-Only Cookies)
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if user is None or not user.is_active:
            return Response({"error": "Invalid credentials or email not verified"}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        response = Response({"message": "Login successful"})
        self._set_auth_cookies(response, access_token, str(refresh))
        return response

    @staticmethod
    def _set_auth_cookies(response, access_token, refresh_token):
        """ Securely Set Authentication Cookies """
        response.set_cookie("access_token", access_token, httponly=True, secure=True, samesite='Lax')
        response.set_cookie("refresh_token", refresh_token, httponly=True, secure=True, samesite='Lax')
        
# Logout (Blacklist Token and Clear Cookies)
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({"message": "Logged out"})
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response

# Get yser profile (Uses my custom Authentication)
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

# Request Password Reset (Sends Email)
class PasswordResetRequestView(APIView):
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(request)
            return Response({"message": "Password reset link sent to email"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# Confirm Password Reset (Set New Password)
class PasswordResetConfirmView(APIView):
    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

        new_password = request.data.get("password")
        if not new_password:
            return Response({"error": "Password is required"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)
    
class SendEmailVerificationView(APIView):
    def post(self, request):
        user = request.user
        serializer = EmailVerificationSerializer(instance=user)
        serializer.send_verification_email(request)
        return Response({"message": "Verification email sent"}, status=status.HTTP_200_OK)
    
class VerifyEmailView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

        user.is_active = True
        user.save()
        return Response({"message": "Email verified. You can now log in."}, status=status.HTTP_200_OK)

class SocialAuthCallbackView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, provider):
        """
        handles OAuth callback by exchanging authorization code for access token.
        """
        code = request.data.get('code')
        if not code:
            return Response({'error': 'Authorization code is required'}, status=status.HTTP_400_BAD_REQUEST)

        if provider == "github":
            token_url = "https://github.com/login/oauth/access_token"
            client_id = settings.SOCIAL_AUTH_GITHUB_KEY
            client_secret = settings.SOCIAL_AUTH_GITHUB_SECRET

            payload = {
                "client_id": client_id,
                "client_secret": client_secret,
                "code": code,
            }
            headers = {"Accept": "application/json"}

        elif provider == "google":
            token_url = "https://oauth2.googleapis.com/token"
            client_id = settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY
            client_secret = settings.SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET
            redirect_uri = "http://localhost:8000/api/v1/accounts/social-auth/google/"

            payload = {
                "client_id": client_id,
                "client_secret": client_secret,
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": redirect_uri,
            }
            headers = {"Content-Type": "application/x-www-form-urlencoded"}

        else:
            return Response({"error": "Unsupported provider"}, status=status.HTTP_400_BAD_REQUEST)

        # Exchange code for access token
        response = requests.post(token_url, data=payload, headers=headers)
        print("Google Response:", response.status_code, response.text)  # Debugging

        if response.status_code != 200:
            return Response({'error': f'Failed to fetch access token: {response.text}'}, status=status.HTTP_400_BAD_REQUEST)

        access_token = response.json().get("access_token")

        if not access_token:
            return Response({"error": "Invalid access token response"}, status=status.HTTP_400_BAD_REQUEST)

        # Authenticate the user with the access token
        strategy = load_strategy(request)
        try:
            backend = load_backend(strategy, f"google-oauth2" if provider == "google" else provider, redirect_uri=None)
            user = backend.do_auth(access_token)
        except (MissingBackend, AuthException) as e:
            return Response({'error': f'Authentication failed: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

        if user:
            # Issue JWT tokens for the authenticated user
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            response = Response({
                "message": "Login successful",
                "access_token": access_token,
                "refresh_token": str(refresh),
            }, status=status.HTTP_200_OK)

            response.set_cookie("access_token", access_token, httponly=True, secure=True, samesite='Lax')
            response.set_cookie("refresh_token", str(refresh), httponly=True, secure=True, samesite='Lax')

            return response

        return Response({'error': 'Authentication failed'}, status=status.HTTP_400_BAD_REQUEST)