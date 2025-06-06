from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'routes', views.RouteViewSet)
router.register(r'user-details', views.UserDetailsViewSet, basename='user-details')

urlpatterns = [
    # Route Endpoints (CRUD operations automatically handled by the router)
    path('', include(router.urls)),
    
    # Authentication Endpoints
    path('user/register/', views.CreateUserView.as_view(), name='register'),
    path('user/current/', views.CurrentUserView.as_view(), name='current_user'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('', include(router.urls)),
]