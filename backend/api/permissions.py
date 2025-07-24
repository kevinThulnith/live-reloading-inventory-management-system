from rest_framework.permissions import BasePermission

# TODO: Create project permissions


class ProductPermission(BasePermission):
    """
    Product permission

    - Only authenticated users can create | read products.
    - Only the creator can update or delete their products.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return True
        return obj.created_by == request.user
