from django.core.validators import MinValueValidator
from django.contrib.auth.models import User
from django.db import models
from decimal import Decimal

# TODO: Create project models


class Product(models.Model):
    CATEGORY_CHOICES = [
        ("books", "Books"),
        ("other", "Other"),
        ("sports", "Sports"),
        ("clothing", "Clothing"),
        ("home", "Home & Garden"),
        ("electronics", "Electronics"),
    ]

    name = models.CharField(max_length=200, db_index=True, unique=True)
    description = models.TextField()
    category = models.CharField(
        max_length=50, choices=CATEGORY_CHOICES, default="other"
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.01"))],
        default=Decimal("0.01"),
    )
    quantity = models.PositiveIntegerField(default=0)
    image = models.ImageField(
        upload_to="product/", default="product/product.png", null=True, blank=True
    )

    # !Metadata
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="products"
    )

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["name"]),
            models.Index(fields=["price"]),
            models.Index(fields=["category"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        return self.name

    @property
    def is_in_stock(self):
        return self.quantity > 0

    @property
    def total_value(self):
        return self.price * self.quantity
