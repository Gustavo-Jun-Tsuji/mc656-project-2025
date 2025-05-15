import builtins
from unittest.mock import patch
from django.test import TestCase
from core.models import Route, FeedbackRoute, PointOfInterest, FeedbackPOI
from django.core.exceptions import ValidationError
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Route
import json

class TestViewTest(APITestCase):
    """Tests for the simple test view"""
    
    def test_test_view(self):
        """Test that the test view returns the expected message"""
        url = '/test/'  # Update this if your URL is different
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), {"message": "Hello, world!"})


class RouteViewSetTests(APITestCase):
    """Tests for the RouteViewSet"""
    
    def setUp(self):
        """Create test data"""
        self.routes_url = reverse('route-list')  # Assumes you've named your route 'route-list'
        
        # Create some test routes
        self.route1 = Route.objects.create(
            title="Test Route 1",
            description="This is test route 1",
            starting_location="Start Point 1",
            ending_location="End Point 1",
            distance=10.5
        )
        
        self.route2 = Route.objects.create(
            title="Different Route 2",
            description="This is test route 2",
            starting_location="Start Point 2",
            ending_location="End Point 2",
            distance=5.2
        )
        
        self.route3 = Route.objects.create(
            title="Another Route",
            description="Route with special keyword",
            starting_location="Special Start",
            ending_location="End Point 3",
            distance=7.8
        )
    
    def test_get_all_routes(self):
        """Test retrieving all routes"""
        response = self.client.get(self.routes_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)
    
    def test_get_single_route(self):
        """Test retrieving a single route"""
        url = reverse('route-detail', args=[self.route1.id])
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.route1.title)
        self.assertEqual(response.data['description'], self.route1.description)
    
    def test_create_route(self):
        """Test creating a new route"""
        new_route_data = {
            'title': 'New Test Route',
            'description': 'This is a new test route',
            'starting_location': 'New Start',
            'ending_location': 'New End',
            'distance': 15.3
        }
        
        response = self.client.post(
            self.routes_url, 
            data=json.dumps(new_route_data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Route.objects.count(), 4)
        self.assertEqual(response.data['title'], new_route_data['title'])
    
    def test_update_route(self):
        """Test updating an existing route"""
        url = reverse('route-detail', args=[self.route1.id])
        updated_data = {
            'title': 'Updated Route Title',
            'description': self.route1.description,
            'starting_location': self.route1.starting_location,
            'ending_location': self.route1.ending_location,
            'distance': self.route1.distance
        }
        
        response = self.client.put(
            url,
            data=json.dumps(updated_data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.route1.refresh_from_db()
        self.assertEqual(self.route1.title, 'Updated Route Title')
    
    def test_delete_route(self):
        """Test deleting a route"""
        url = reverse('route-detail', args=[self.route1.id])
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Route.objects.count(), 2)
    
    def test_search_routes(self):
        """Test searching routes"""
        # Search by title
        response = self.client.get(f"{self.routes_url}?search=Different")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], self.route2.title)
        
        # Search by description
        response = self.client.get(f"{self.routes_url}?search=special keyword")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], self.route3.title)
        
        # Search by starting location
        response = self.client.get(f"{self.routes_url}?search=Special Start")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], self.route3.title)
        
        # Search with no results
        response = self.client.get(f"{self.routes_url}?search=nonexistent")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

