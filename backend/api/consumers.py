import json
from channels.generic.websocket import AsyncWebsocketConsumer


class ProductConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Every connection has a unique channel_name.
        # We'll create a "group" to broadcast messages to all connected clients.
        self.group_name = "products"

        # Add this specific connection to our "products" group.
        await self.channel_layer.group_add(self.group_name, self.channel_name)

        # Accept the WebSocket connection. If you don't call this, the connection will be rejected.
        await self.accept()

    async def disconnect(self, close_code):
        # Remove this connection from the "products" group.
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    # This is a custom method. We'll call it from our model signals.
    # Its name MUST match the "type" of the message sent to the group.
    # (We'll send a message with `{"type": "product.update", ...}`)
    # Channels automatically converts the dot to an underscore.
    async def product_update(self, event):
        # The actual data is in the "payload" key of the event.
        payload = event["payload"]

        # Send the payload to the connected client as a JSON string.
        await self.send(text_data=json.dumps(payload))
