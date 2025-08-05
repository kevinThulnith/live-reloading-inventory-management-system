import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from channels.auth import AuthMiddlewareStack
import api.routing

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

# This is the router. It checks the protocol type of the incoming connection.
application = ProtocolTypeRouter(
    {
        # If it's a normal HTTP request, handle it with the standard Django app.
        "http": get_asgi_application(),
        # If it's a WebSocket request, handle it with our custom routing.
        "websocket": AllowedHostsOriginValidator(
            AuthMiddlewareStack(URLRouter(api.routing.websocket_urlpatterns))
        ),
    }
)
