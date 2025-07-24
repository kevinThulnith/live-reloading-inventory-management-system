from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Product
from decimal import Decimal
from faker import Faker
import random


class Command(BaseCommand):
    help = "Populate database with sample products"

    def add_arguments(self, parser):
        parser.add_argument("--count", type=int, default=50)

    def handle(self, *args, **options):
        fake = Faker()
        count = options["count"]

        # Get all users from the database
        users = list(User.objects.all())
        if not users:
            self.stdout.write(self.style.ERROR("No users found in database"))
            return

        categories = ["electronics", "clothing", "books", "home", "sports"]

        for i in range(count):
            Product.objects.create(
                name=fake.catch_phrase(),
                description=fake.text(max_nb_chars=200),
                category=random.choice(categories),
                price=Decimal(str(round(random.uniform(10, 500), 2))),
                quantity=random.randint(0, 100),
                created_by=random.choice(users),
                is_active=random.choice([True, True, True, False]),  # 75% active
            )

        self.stdout.write(self.style.SUCCESS(f"Successfully created {count} products"))
