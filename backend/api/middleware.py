from urllib.parse import parse_qs
from channels.db import database_sync_to_async

# KEEP these imports at the top, they are safe.
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

# REMOVE the Django model imports from here.
# from django.contrib.auth.models import User, AnonymousUser


@database_sync_to_async
def get_user(token_key):
    """
    Asynchronously get the user from the database given a token.
    """
    # --- SOLUTION: Import the models right before you use them. ---
    from django.contrib.auth.models import User, AnonymousUser

    try:
        # Validate the token
        token = AccessToken(token_key)
        # Get the user ID from the token payload
        user_id = token.get("user_id")
        # Fetch the user from the database
        return User.objects.get(id=user_id)
    except (InvalidToken, TokenError, User.DoesNotExist):
        # If the token is invalid or the user doesn't exist, return an anonymous user
        return AnonymousUser()


class JWTAuthMiddleware:
    """
    Custom middleware for JWT authentication with WebSockets.
    """

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        query_string = scope.get("query_string", b"").decode("utf-8")
        query_params = parse_qs(query_string)
        token = query_params.get("token", [None])[0]

        if token:
            scope["user"] = await get_user(token)
        else:
            # We still need AnonymousUser here, so let's import it lazily as well.
            from django.contrib.auth.models import AnonymousUser

            scope["user"] = AnonymousUser()

        return await self.app(scope, receive, send)
