from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import ProductSerializer
from .permissions import ProductPermission
from rest_framework.views import APIView
from .serializers import UserSerializer
from rest_framework import generics
from .models import Product

# TODO: Crate API Views


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get(self, request):
        user = request.user
        return Response({"username": user.username, "email": user.email})


class ProductViewSet(viewsets.ModelViewSet):
    """
    Product API ViewSet

    - User must be authenticated to access this viewset.
    - GET | POST - all users can view and create products.
    - PUT | PATCH | DELETE - only the creator can update or delete their products.
    """

    queryset = Product.objects.select_related("created_by").all()
    serializer_class = ProductSerializer
    permission_classes = [ProductPermission]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    # !Filtering
    search_fields = ["name", "description"]
    filterset_fields = ["category", "is_active"]
    ordering_fields = ["name", "price", "quantity", "created_at"]

    @action(detail=False, methods=["get"])
    def my_products(self, request):
        user_products = self.queryset.filter(created_by=request.user)
        serializer = self.get_serializer(user_products, many=True)
        return Response(serializer.data)
