from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Route
import json

class TestViewTest(APITestCase):
    """Tests for the simple test view"""
    
    def test_test_view(self):
        """Test that the test view returns the expected message"""
        url = '/api/test/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), {"message": "Hello, world!"})


class RouteViewSetTests(APITestCase):
    """Tests for the RouteViewSet"""
    
    def setUp(self):
        """Create test data"""
        self.routes_url = reverse('route-list')
        
        # Create some test routes with valid coordinates
        self.route1 = Route.objects.create(
            title="Test Route 1",
            description="This is test route 1",
            starting_location="Start Point 1",
            ending_location="End Point 1",
            coordinates=[[40.7128, -74.0060], [40.7129, -74.0061], [40.7130, -74.0062]]  # NYC coordinates
        )
        
        self.route2 = Route.objects.create(
            title="Different Route 2",
            description="This is test route 2",
            starting_location="Start Point 2",
            ending_location="End Point 2",
            coordinates=[[34.0522, -118.2437], [34.0523, -118.2438]]  # LA coordinates
        )
        
        self.route3 = Route.objects.create(
            title="Special Route",
            description="This is a route with special keyword",
            starting_location="Special Start",
            ending_location="End Point 3",
            coordinates=[[41.8781, -87.6298], [41.8782, -87.6299], [41.8783, -87.6300]]  # Chicago coordinates
        )
    
    def test_get_all_routes(self):
        """Test retrieving all routes"""
        response = self.client.get(self.routes_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)  # Should return all 3 routes
    
    def test_get_single_route(self):
        """Test retrieving a single route"""
        url = reverse('route-detail', args=[self.route1.id])
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.route1.title)
        self.assertEqual(response.data['description'], self.route1.description)
        self.assertEqual(response.data['coordinates'], self.route1.coordinates)
    
    def test_create_route(self):
        """Test creating a new route"""
        new_route_data = {
            'title': 'New Test Route',
            'description': 'This is a new test route',
            'starting_location': 'New Start',
            'ending_location': 'New End',
            'coordinates': [[37.7749, -122.4194], [37.7750, -122.4195]]  # SF coordinates
        }
        
        response = self.client.post(
            self.routes_url,
            data=json.dumps(new_route_data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Route.objects.count(), 4)  # One more route added
        self.assertEqual(response.data['title'], new_route_data['title'])
        
        # Check that coordinates were saved correctly
        self.assertEqual(response.data['coordinates'], new_route_data['coordinates'])
    
    def test_update_route(self):
        """Test updating an existing route"""
        url = reverse('route-detail', args=[self.route1.id])
        updated_data = {
            'title': 'Updated Route Title',
            'description': self.route1.description,
            'starting_location': self.route1.starting_location,
            'ending_location': self.route1.ending_location,
            'coordinates': self.route1.coordinates  # Keep the same coordinates
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
        self.assertEqual(Route.objects.count(), 2)  # One less route
    
    def test_search_routes(self):
        """Test searching for routes"""
        # Search by title
        response = self.client.get(f"{self.routes_url}?search=Special")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], self.route3.title)
        
        # Search by description
        response = self.client.get(f"{self.routes_url}?search=special keyword")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
        # Search by starting location
        response = self.client.get(f"{self.routes_url}?search=special start")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
        # Should return multiple routes
        response = self.client.get(f"{self.routes_url}?search=route")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 1)
    
    def test_calculate_distance(self):
        """Test that route distance is calculated correctly"""
        url = reverse('route-detail', args=[self.route1.id])
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Distance should be included in response
        self.assertIn('distance', response.data)
        
        # Distance should be a number (not testing exact value as it's complex calculation)
        self.assertIsInstance(response.data['distance'], float)
        
        # Route with no coordinates should have 0 distance
        empty_route = Route.objects.create(
            title="Empty Route",
            description="Route with no coordinates",
            starting_location="Empty Start",
            ending_location="Empty End",
            coordinates=[]
        )
        
        empty_url = reverse('route-detail', args=[empty_route.id])
        empty_response = self.client.get(empty_url)
        
        self.assertEqual(empty_response.status_code, status.HTTP_200_OK)
        self.assertEqual(empty_response.data['distance'], 0)