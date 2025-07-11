from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Q
from rest_framework import viewsets, status, filters, generics
from rest_framework.decorators import api_view, action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import Route, UserDetails
from .serializers import RouteSerializer, UserSerializer, UserDetailsSerializer
from django.db.models import Count, F, Q, ExpressionWrapper, FloatField
from django.utils import timezone
import datetime

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
        
        queryset = super().get_queryset()
        
        search_term = self.request.query_params.get('search', None)
        user_term = self.request.query_params.get('user', None)
        order_by = self.request.query_params.get('order_by', None)
        
        if 'search' in self.request.query_params and not search_term:
            raise ValidationError({"error": "Search parameter cannot be empty"})

        if user_term:
            try:
                user_id = int(user_term)
                return queryset.filter(user_id=user_id)
            except (ValueError, TypeError):
                return self.queryset.none()
        
        if search_term:
            queryset = queryset.filter(
                Q(title__icontains=search_term) | 
                Q(description__icontains=search_term) |
                Q(starting_location__icontains=search_term) |
                Q(ending_location__icontains=search_term) |
                Q(tags__icontains=search_term)
            )
        
        if order_by:
            if order_by == 'liked':
                queryset = queryset.annotate(
                    upvote_count=Count('upvotes'),
                    downvote_count=Count('downvotes'),
                    net_votes=F('upvote_count') - F('downvote_count')
                ).order_by('-net_votes')
            elif order_by == 'trending':
                seven_days_ago = timezone.now() - datetime.timedelta(days=7)
            
                # Count recent upvotes and downvotes
                queryset = queryset.annotate(
                    recent_upvotes=Count('upvotes', filter=Q(upvotes__date_joined__gte=seven_days_ago)),
                    recent_downvotes=Count('downvotes', filter=Q(downvotes__date_joined__gte=seven_days_ago)),
                    trending_score=ExpressionWrapper(
                        F('recent_upvotes') * 3 - F('recent_downvotes') * 2,
                        output_field=FloatField()
                    )
                ).order_by('-trending_score')
            elif order_by in ['created_at', '-created_at']:
                    queryset = queryset.order_by(order_by)
            else:
                # Invalid order_by parameter, fall back to default
                queryset = queryset.order_by('-created_at')
        
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
        user_routes = self.get_queryset().filter(user=request.user)
        
        page = self.paginate_queryset(user_routes)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(user_routes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_liked_routes(self, request):
        """
        Custom action to get routes liked (upvoted) by the current user.
        endpoints: /routes/my_liked_routes/
        """
        liked_routes = self.get_queryset().filter(upvotes=request.user)
        
        page = self.paginate_queryset(liked_routes)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(liked_routes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def vote(self, request, pk=None):
        """
        Endpoint for upvoting/downvoting a route
        payload example: {"vote_type": "upvote"} or {"vote_type": "downvote"}
        """
        route = self.get_object()
        user = request.user
        vote_type = request.data.get('vote_type', '').lower()
        
        if vote_type == 'upvote':
            route.downvotes.remove(user)
            if user in route.upvotes.all():
                route.upvotes.remove(user)
                message = "Removed upvote"
            else:
                route.upvotes.add(user)
                message = "Added upvote"
        
        elif vote_type == 'downvote':
            route.upvotes.remove(user)
            if user in route.downvotes.all():
                route.downvotes.remove(user)
                message = "Removed downvote"
            else:
                route.downvotes.add(user)
                message = "Added downvote"
        
        else:
            return Response(
                {"error": "Unvalid vote. Use 'upvote' or 'downvote'."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        route.save()
        return Response({
            "message": message,
            "upvotes_count": route.upvotes.count(),
            "downvotes_count": route.downvotes.count(),
            "user_vote": self.get_user_vote(route, user)
        }, status=status.HTTP_200_OK)
    
    def get_user_vote(self, route, user):
        """Returns the users vote for the route"""
        if user in route.upvotes.all():
            return "upvote"
        elif user in route.downvotes.all():
            return "downvote"
        return None
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_to_history(self, request, pk=None):
        """
        Add a route to the user's view history
        """
        try:
            route = self.get_object()
            user_details = request.user.details
            
            # Add to history
            user_details.add_to_history(
                route_id=route.id,
                route_title=route.title
            )
            
            return Response({
                "message": "Added to history"
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                "error": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
        
class UserDetailsViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = UserDetailsSerializer
    
    def get_queryset(self):
        return UserDetails.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def route_history(self, request):
        """Get the user's route viewing history"""
        try:
            # Get the complete history without any limit
            history = request.user.details.get_history()
            
            detailed_history = []
            for entry in history:
                route_id = entry.get('route_id')
                try:
                    route = Route.objects.get(id=route_id)
                    # Use the RouteSerializer to serialize the route
                    route_serializer = RouteSerializer(route, context={'request': request})
                    # Merge the history entry with the serialized route data
                    detailed_entry = {
                        **entry,
                        **route_serializer.data
                    }
                    detailed_history.append(detailed_entry)
                except Route.DoesNotExist:
                    detailed_history.append(entry)
            
            return Response(detailed_history, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                "error": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
            
    @action(detail=False, methods=['delete'])
    def clear_history(self, request):
        """Clear the user's route history"""
        try:
            user_details = request.user.details
            user_details.route_history = []
            user_details.save()
            
            return Response({
                "message": "History cleared"
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                "error": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)