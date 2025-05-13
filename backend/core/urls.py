from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'routes', views.RouteViewSet)

urlpatterns = [
    path('test/', views.test),
    # path("routes/", views.RouteViewSet.as_view({
    #     "get": "list",
    #     "post": "create"
    # }), name='route-list'),
    # path('routes/<int:pk>/', views.RouteViewSet.as_view({
    #     'get': 'retrieve',       # GET request to get a specific route
    #     'delete': 'destroy'      # DELETE request to delete a route
    # }), name='route-detail'),
    # # Custom actions
    # path('routes/search/', views.RouteViewSet.as_view({
    #     'get': 'search',
    # }), name='route-search'),
    path('', include(router.urls))
]