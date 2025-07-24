from api.views import CreateUserView, UserInfoView
from django.conf.urls.static import static
from django.urls import path, include
from django.contrib import admin
from django.conf import settings
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenBlacklistView,
    TokenRefreshView,
)

# TODO: Set up backend urls
urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/user/", UserInfoView.as_view(), name="user_info"),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh_token"),
    path("api/token/blacklist/", TokenBlacklistView.as_view(), name="blacklist_token"),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include("api.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
