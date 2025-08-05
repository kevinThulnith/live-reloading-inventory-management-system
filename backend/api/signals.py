from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import Product
from .serializers import ProductSerializer


# This decorator means the `product_change_handler` function
# will be called every time a Product instance is saved or deleted.
@receiver([post_save, post_delete], sender=Product)
def product_change_handler(sender, instance, **kwargs):
    """
    Handles sending updates to the WebSocket group when a Product changes.
    """
    # Determine if the action was a creation/update or a deletion
    if "created" in kwargs:  # This key exists for post_save
        action = "create" if kwargs["created"] else "update"
    else:  # This is a post_delete signal
        action = "delete"

    # Serialize the product data. We use a dummy 'request' context
    # so the ImageField URL is generated correctly.
    class DummyRequest:
        def build_absolute_uri(self, location):
            return location

    serializer = ProductSerializer(instance, context={"request": DummyRequest()})

    payload = {"action": action, "data": serializer.data}

    # Get the channel layer (our "post office")
    channel_layer = get_channel_layer()

    # Send a message to the "products" group.
    # `async_to_sync` is needed because we're calling an async function
    # (group_send) from a synchronous one (the signal handler).
    async_to_sync(channel_layer.group_send)(
        "products",  # The name of the group to send to
        {
            "type": "product.update",  # The name of the consumer method to call
            "payload": payload,
        },
    )
