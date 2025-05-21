from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Q
from rest_framework import viewsets, status, filters
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from .models import Route
from .serializers import RouteSerializer

def test(request):
    return JsonResponse({"message": "Hello, world!"})

class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all().order_by('-created_at')
    serializer_class = RouteSerializer
    
    def get_queryset(self):
        """
        Allow filtering by query parameters
        """
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