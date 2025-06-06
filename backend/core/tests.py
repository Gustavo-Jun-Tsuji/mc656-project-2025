from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Route, UserDetails
import json

class AuthViewsTests(APITestCase):
    """Tests for the authentication views"""
    
    def setUp(self):
        """Create test data"""
        self.register_url = reverse('register')
        self.token_url = reverse('token_obtain_pair')
        self.token_refresh_url = reverse('token_refresh')
        self.current_user_url = reverse('current_user')
        
        # Test user data
        self.user_data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'testpassword123'
        }
        
        # Create a user for token refresh and current user tests
        self.user = User.objects.create_user(
            username='existinguser',
            email='existing@example.com',
            password='existingpassword123'
        )
    
    def get_tokens_for_user(self, user):
        """Helper method to get tokens for a user"""
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
    
    def test_register_user(self):
        """Test registering a new user"""
        response = self.client.post(self.register_url, self.user_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 2)  # including the user from setUp
        self.assertEqual(User.objects.get(username='testuser').username, 'testuser')
    
    def test_register_user_duplicate_username(self):
        """Test registering with a duplicate username"""
        # First create a user
        User.objects.create_user(username='testuser', email='other@example.com', password='pass123')
        
        # Try to register with the same username
        response = self.client.post(self.register_url, self.user_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_obtain_token(self):
        """Test obtaining JWT tokens"""
        # Try to login with the user created in setUp
        login_data = {
            'username': 'existinguser',
            'password': 'existingpassword123'
        }
        
        response = self.client.post(self.token_url, login_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
    
    def test_refresh_token(self):
        """Test refreshing a JWT token"""
        # Get tokens for the user
        tokens = self.get_tokens_for_user(self.user)
        
        # Try to refresh the token
        refresh_data = {'refresh': tokens['refresh']}
        response = self.client.post(self.token_refresh_url, refresh_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
    
    def test_current_user(self):
        """Test the current user endpoint"""
        # Get tokens for the user
        tokens = self.get_tokens_for_user(self.user)
        
        # Set the token in the header
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {tokens["access"]}')
        
        # Try to get the current user
        response = self.client.get(self.current_user_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user.username)
        self.assertEqual(response.data['email'], self.user.email)
    
    def test_unauthorized_access(self):
        """Test that unauthorized access is denied"""
        # Try to access current user without token
        response = self.client.get(self.current_user_url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class RouteViewSetTests(APITestCase):
    """Tests for the RouteViewSet"""
    
    def setUp(self):
        """Create test data"""
        self.routes_url = reverse('route-list')
        
        # Create a test user
        self.user = User.objects.create_user(
            username='routetestuser',
            email='routetest@example.com',
            password='routetestpass123'
        )
        
        # Get JWT token for this user
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        
        # Set the token in the header for all requests
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        
        # Create some test routes with valid coordinates
        self.route1 = Route.objects.create(
            title="Test Route 1",
            description="This is test route 1",
            starting_location="Start Point 1",
            ending_location="End Point 1",
            coordinates=[[40.7128, -74.0060], [40.7129, -74.0061], [40.7130, -74.0062]],  # NYC coordinates
            user=self.user  # Associate with the test user
        )
        
        self.route2 = Route.objects.create(
            title="Different Route 2",
            description="This is test route 2",
            starting_location="Start Point 2",
            ending_location="End Point 2",
            coordinates=[[34.0522, -118.2437], [34.0523, -118.2438]],  # LA coordinates
            user=self.user
        )
        
        self.route3 = Route.objects.create(
            title="Special Route",
            description="This is a route with special keyword",
            starting_location="Special Start",
            ending_location="End Point 3",
            coordinates=[[41.8781, -87.6298], [41.8782, -87.6299], [41.8783, -87.6300]],  # Chicago coordinates
            user=self.user
        )
        
        # Create another user for testing user isolation
        self.other_user = User.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='otherpass123'
        )
        
        # Create a route for the other user
        self.other_user_route = Route.objects.create(
            title="Other User's Route",
            description="This belongs to another user",
            starting_location="Other Start",
            ending_location="Other End",
            coordinates=[[42.3601, -71.0589], [42.3602, -71.0590]],  # Boston coordinates
            user=self.other_user
        )
    
    def test_get_all_routes_authenticated(self):
        """Test retrieving all routes when authenticated"""
        response = self.client.get(self.routes_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 4)
    
    def test_get_all_routes_unauthenticated(self):
        """Test that unauthenticated users cannot access routes"""
        # Remove credentials
        self.client.credentials()
        
        response = self.client.get(self.routes_url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_get_single_route_authenticated(self):
        """Test retrieving a single route when authenticated"""
        url = reverse('route-detail', args=[self.route1.id])
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.route1.title)
    
    def test_create_route_authenticated(self):
        """Test creating a new route when authenticated"""
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
        
        # Verify the route was created and associated with the current user
        new_route = Route.objects.get(title='New Test Route')
        self.assertEqual(new_route.user, self.user)
    
    def test_create_route_unauthenticated(self):
        """Test that unauthenticated users cannot create routes"""
        # Remove credentials
        self.client.credentials()
        
        new_route_data = {
            'title': 'Unauthenticated Route',
            'description': 'This should not be created',
            'starting_location': 'Start',
            'ending_location': 'End',
            'coordinates': [[1.0, 1.0], [2.0, 2.0]]
        }
        
        response = self.client.post(
            self.routes_url,
            data=json.dumps(new_route_data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_update_route_authenticated(self):
        """Test updating an existing route when authenticated"""
        url = reverse('route-detail', args=[self.route1.id])
        updated_data = {
            'title': 'Updated Route Title',
            'description': self.route1.description,
            'starting_location': self.route1.starting_location,
            'ending_location': self.route1.ending_location,
            'coordinates': self.route1.coordinates
        }
        
        response = self.client.put(
            url,
            data=json.dumps(updated_data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.route1.refresh_from_db()
        self.assertEqual(self.route1.title, 'Updated Route Title')
    
    def test_cannot_update_other_users_route(self):
        """Test that a user cannot update another user's route"""
        url = reverse('route-detail', args=[self.other_user_route.id])
        updated_data = {
            'title': 'Should Not Update',
            'description': self.other_user_route.description,
            'starting_location': self.other_user_route.starting_location,
            'ending_location': self.other_user_route.ending_location,
            'coordinates': self.other_user_route.coordinates
        }
        
        response = self.client.put(
            url,
            data=json.dumps(updated_data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Verify the title was not updated
        self.other_user_route.refresh_from_db()
        self.assertEqual(self.other_user_route.title, "Other User's Route")
    
    def test_delete_route_authenticated(self):
        """Test deleting a route when authenticated"""
        url = reverse('route-detail', args=[self.route1.id])
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Verify the route was deleted
        with self.assertRaises(Route.DoesNotExist):
            Route.objects.get(id=self.route1.id)
    
    def test_cannot_delete_other_users_route(self):
        """Test that a user cannot delete another user's route"""
        url = reverse('route-detail', args=[self.other_user_route.id])
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Verify the route was not deleted
        self.assertEqual(Route.objects.filter(id=self.other_user_route.id).count(), 1)
    
    def test_search_routes_authenticated(self):
        """Test searching for routes when authenticated"""
        # Clear existing routes for this test
        Route.objects.filter(user=self.user).delete()
        
        # Create specific test routes for this user
        special_route = Route.objects.create(
            title="Special Route",
            description="This is a special route",
            starting_location="Start Special",
            ending_location="End Special",
            coordinates=[[1.0, 1.0], [2.0, 2.0]],
            user=self.user
        )
        
        regular_route = Route.objects.create(
            title="Regular Route",
            description="This is a regular route",
            starting_location="Start Regular",
            ending_location="End Regular",
            coordinates=[[3.0, 3.0], [4.0, 4.0]],
            user=self.user
        )
        
        # Create a route for the other user with similar search terms
        other_special_route = Route.objects.create(
            title="Other Special Route",
            description="This should not appear in search results",
            starting_location="Start Special Other",
            ending_location="End Special Other",
            coordinates=[[5.0, 5.0], [6.0, 6.0]],
            user=self.other_user
        )
        
        # Search by title
        response = self.client.get(f"{self.routes_url}?search=Special")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)
    
    def test_calculate_distance(self):
        """Test that route distance is calculated correctly"""
        url = reverse('route-detail', args=[self.route1.id])
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('distance', response.data)
        self.assertIsInstance(response.data['distance'], float)
        
        # Route with no coordinates should have 0 distance
        empty_route = Route.objects.create(
            title="Empty Route",
            description="Route with no coordinates",
            starting_location="Empty Start",
            ending_location="Empty End",
            coordinates=[],
            user=self.user
        )
        
        empty_url = reverse('route-detail', args=[empty_route.id])
        empty_response = self.client.get(empty_url)
        
        self.assertEqual(empty_response.status_code, status.HTTP_200_OK)
        self.assertEqual(empty_response.data['distance'], 0)

    def test_upvote_route(self):
        """Test upvoting a route"""
        url = reverse('route-detail', args=[self.route1.id]) + 'vote/'
        response = self.client.post(url, {'vote_type': 'upvote'}, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['upvotes_count'], 1)
        self.assertEqual(response.data['downvotes_count'], 0)
        self.assertEqual(response.data['user_vote'], 'upvote')

        # Verify the upvote was added in the database
        self.route1.refresh_from_db()
        self.assertEqual(self.route1.upvotes.count(), 1)
        self.assertTrue(self.route1.upvotes.filter(id=self.user.id).exists())

    def test_downvote_route(self):
        """Test downvoting a route"""
        url = reverse('route-detail', args=[self.route1.id]) + 'vote/'
        response = self.client.post(url, {'vote_type': 'downvote'}, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['upvotes_count'], 0)
        self.assertEqual(response.data['downvotes_count'], 1)
        self.assertEqual(response.data['user_vote'], 'downvote')

        # Verify the downvote was added in the database
        self.route1.refresh_from_db()
        self.assertEqual(self.route1.downvotes.count(), 1)
        self.assertTrue(self.route1.downvotes.filter(id=self.user.id).exists())

    def test_remove_upvote(self):
        """Test removing an upvote by clicking upvote again"""
        # First upvote the route
        self.route1.upvotes.add(self.user)

        url = reverse('route-detail', args=[self.route1.id]) + 'vote/'
        response = self.client.post(url, {'vote_type': 'upvote'}, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['upvotes_count'], 0)
        self.assertEqual(response.data['user_vote'], None)

        # Verify the upvote was removed in the database
        self.route1.refresh_from_db()
        self.assertEqual(self.route1.upvotes.count(), 0)

    def test_remove_downvote(self):
        """Test removing a downvote by clicking downvote again"""
        # First downvote the route
        self.route1.downvotes.add(self.user)

        url = reverse('route-detail', args=[self.route1.id]) + 'vote/'
        response = self.client.post(url, {'vote_type': 'downvote'}, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['downvotes_count'], 0)
        self.assertEqual(response.data['user_vote'], None)

        # Verify the downvote was removed in the database
        self.route1.refresh_from_db()
        self.assertEqual(self.route1.downvotes.count(), 0)

    def test_change_vote_upvote_to_downvote(self):
        """Test changing vote from upvote to downvote"""
        # First upvote the route
        self.route1.upvotes.add(self.user)
        
        url = reverse('route-detail', args=[self.route1.id]) + 'vote/'
        response = self.client.post(url, {'vote_type': 'downvote'}, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['upvotes_count'], 0)
        self.assertEqual(response.data['downvotes_count'], 1)
        self.assertEqual(response.data['user_vote'], 'downvote')
        
        # Verify the vote was changed in the database
        self.route1.refresh_from_db()
        self.assertEqual(self.route1.upvotes.count(), 0)
        self.assertEqual(self.route1.downvotes.count(), 1)
        self.assertTrue(self.route1.downvotes.filter(id=self.user.id).exists())

    def test_change_vote_downvote_to_upvote(self):
        """Test changing vote from downvote to upvote"""
        # First downvote the route
        self.route1.downvotes.add(self.user)

        url = reverse('route-detail', args=[self.route1.id]) + 'vote/'
        response = self.client.post(url, {'vote_type': 'upvote'}, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['upvotes_count'], 1)
        self.assertEqual(response.data['downvotes_count'], 0)
        self.assertEqual(response.data['user_vote'], 'upvote')

        # Verify the vote was changed in the database
        self.route1.refresh_from_db()
        self.assertEqual(self.route1.upvotes.count(), 1)
        self.assertEqual(self.route1.downvotes.count(), 0)
        self.assertTrue(self.route1.upvotes.filter(id=self.user.id).exists())

    def test_vote_unauthenticated(self):
        """Test that unauthenticated users cannot vote"""
        # Remove credentials
        self.client.credentials()

        url = reverse('route-detail', args=[self.route1.id]) + 'vote/'
        response = self.client.post(url, {'vote_type': 'upvote'}, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Verify no votes were added
        self.route1.refresh_from_db()
        self.assertEqual(self.route1.upvotes.count(), 0)
        self.assertEqual(self.route1.downvotes.count(), 0)

    def test_invalid_vote_type(self):
        """Test that an invalid vote type returns an error"""
        url = reverse('route-detail', args=[self.route1.id]) + 'vote/'
        response = self.client.post(url, {'vote_type': 'invalid_type'}, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_vote_counts_in_route_detail(self):
        """Test that vote counts appear in route detail endpoint"""
        # Add upvotes from multiple users
        self.route1.upvotes.add(self.user)
        self.route1.upvotes.add(self.other_user)
        
        url = reverse('route-detail', args=[self.route1.id])
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['upvotes_count'], 2)
        self.assertEqual(response.data['downvotes_count'], 0)
        self.assertEqual(response.data['user_vote'], 'upvote')