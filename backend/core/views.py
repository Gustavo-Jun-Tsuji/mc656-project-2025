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
            # Split the search term into words for more accurate searching
            search_words = search_term.strip().split()
            
            # Start with empty Q object
            query = Q()
            
            # Add each word as a condition
            for word in search_words:
                if word:  # Skip empty strings
                    query |= (
                        Q(title__icontains=word) | 
                        Q(description__icontains=word) |
                        Q(starting_location__icontains=word) |
                        Q(ending_location__icontains=word)
                    )
            
            # Apply the query only if we have valid search terms
            if query:
                queryset = queryset.filter(query)
        
        return queryset