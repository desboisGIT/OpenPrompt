from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        """
        Custom authentication that first checks for Authorization header,
        and if missing, falls back to checking cookies.
        """
        # ✅ First, check if Authorization header exists
        header = request.headers.get('Authorization')
        if header and header.startswith('Bearer '):
            token = header.split(' ')[1]
        else:
            # ✅ If no header, check for JWT in cookies
            token = request.COOKIES.get('access_token')

        if not token:
            return None  # DRF will return 401 automatically

        try:
            validated_token = self.get_validated_token(token)
            return self.get_user(validated_token), validated_token
        except AuthenticationFailed:
            return None  # Invalid token results in 401
