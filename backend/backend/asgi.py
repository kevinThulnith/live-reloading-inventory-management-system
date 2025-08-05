import os
from django.core.asgi import get_asgi_application

# Step 1: Set the settings module environment variable. This is always first.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

# Step 2: Initialize the Django application. This is the crucial step that
# loads all apps and populates the app registry. It MUST be done before
# importing any of your own application code (like routing or middleware).
django_asgi_app = get_asgi_application()

# Step 3: Now that Django is fully loaded, it's safe to import Channels
# and your own application's routing and middleware.
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from api.middleware import JWTAuthMiddleware
import api.routing

# Step 4: Define the final application router.
application = ProtocolTypeRouter(
    {
        # Use the already initialized Django app for standard HTTP requests.
        "http": django_asgi_app,

        # Set up the WebSocket router. The imports for this are now safe.
        "websocket": AllowedHostsOriginValidator(
            JWTAuthMiddleware(URLRouter(api.routing.websocket_urlpatterns))
        ),
    }
)