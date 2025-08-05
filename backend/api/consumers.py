import json
from channels.generic.websocket import AsyncWebsocketConsumer


class ProductConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """
        Called when the websocket is trying to connect.
        This is where we perform the authentication check.
        """
        # self.scope['user'] is populated by our JWTAuthMiddleware
        user = self.scope["user"]

        if not user.is_authenticated:
            # If the user is not authenticated, reject the connection.
            await self.close()
            return

        # If authenticated, proceed with the connection.
        self.group_name = "products"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        await self.send(
            text_data=json.dumps(
                {
                    "type": "connection_established",
                    "message": "You are now connected to the live product feed.",
                }
            )
        )

    async def disconnect(self, close_code):
        """Called when the websocket disconnects."""
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    # ... (the rest of your consumer code remains the same)
    async def product_update(self, event):
        payload = event["payload"]
        await self.send(text_data=json.dumps(payload))
