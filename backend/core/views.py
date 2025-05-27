from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Q
from rest_framework import viewsets, status, filters, generics
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import Route
from .serializers import RouteSerializer, UserSerializer

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # Allow any user to create an account

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class RouteViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Route.objects.all().order_by('-created_at')
    serializer_class = RouteSerializer
        
    def get_queryset(self):
        """
        Optionally restricts the returned routes to a given user,
        by filtering against a `user` query parameter in the URL.
        
        endpoints: /routes/?user=1
        or         /routes/?search=keyword
        or even    /routes/?user=1&search=keyword
        """
        
        # If user id is provided in the query parameters, filter by user
        user_term = self.request.query_params.get('user', None)
        if user_term:
            try:
                user_id = int(user_term)
                return self.queryset.filter(user_id=user_id)
            except (ValueError, TypeError):
                return self.queryset.none()
            
        # Allow filtering by query parameters
        queryset = super().get_queryset()
        search_term = self.request.query_params.get('search', None)
        
        if search_term:
            queryset = queryset.filter(
                Q(title__icontains=search_term) | 
                Q(description__icontains=search_term) |
                Q(starting_location__icontains=search_term) |
                Q(ending_location__icontains=search_term) |
                Q(tags__icontains=search_term)
            )
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def destroy(self, request, *args, **kwargs):
        """
        Override destroy method to ensure only the route owner or staff can delete
        """
        route = self.get_object()
        
        # Check if user is the owner or is staff
        if route.user == request.user or request.user.is_staff:
            return super().destroy(request, *args, **kwargs)
        else:
            return Response(
                {"detail": "You do not have permission to delete this route."},
                status=status.HTTP_403_FORBIDDEN
            )
    
    def update(self, request, *args, **kwargs):
        """
        Override update method to ensure only the route owner or staff can update
        """
        route = self.get_object()
        
        # Check if user is the owner or is staff
        if route.user == request.user or request.user.is_staff:
            return super().update(request, *args, **kwargs)
        else:
            return Response(
                {"detail": "You do not have permission to update this route."},
                status=status.HTTP_403_FORBIDDEN
            )
    
    def partial_update(self, request, *args, **kwargs):
        """
        Override partial_update method to ensure only the route owner or staff can update
        """
        route = self.get_object()
        
        # Check if user is the owner or is staff
        if route.user == request.user or request.user.is_staff:
            return super().partial_update(request, *args, **kwargs)
        else:
            return Response(
                {"detail": "You do not have permission to update this route."},
                status=status.HTTP_403_FORBIDDEN
            )
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_routes(self, request):
        """
        Custom action to get routes created by the current user.
        endpoints: /routes/my_routes/
        """
        user_routes = self.queryset.filter(user=request.user)
        serializer = self.get_serializer(user_routes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)