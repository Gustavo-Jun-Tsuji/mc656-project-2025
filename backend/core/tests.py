from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Route, UserDetails
import json
from django.db import connection


class AuthViewsTests(APITestCase):
    """Tests for the authentication views"""

    def setUp(self):
        """Create test data"""
        self.register_url = reverse("register")
        self.token_url = reverse("token_obtain_pair")
        self.token_refresh_url = reverse("token_refresh")
        self.current_user_url = reverse("current_user")

        # Test user data
        self.user_data = {
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "testpassword123",
        }

        # Create a user for token refresh and current user tests
        self.user = User.objects.create_user(
            username="existinguser",
            email="existing@example.com",
            password="existingpassword123",
        )

    def get_tokens_for_user(self, user):
        """Helper method to get tokens for a user"""
        refresh = RefreshToken.for_user(user)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

    def test_register_user(self):
        """Test registering a new user (valid class)"""
        response = self.client.post(self.register_url, self.user_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 2)  # including the user from setUp
        self.assertEqual(User.objects.get(username="testuser").username, "testuser")

    def test_register_user_duplicate_username(self):
        """Test registering with a duplicate username (invalid class)"""
        # First create a user
        User.objects.create_user(
            username="testuser", email="other@example.com", password="pass123"
        )

        # Try to register with the same username
        response = self.client.post(self.register_url, self.user_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_user_username_too_long(self):
        """Test registering with a username that exceeds the maximum length (boundary value)"""
        long_username = "a" * 151

        long_username_data = {
            "username": long_username,
            "email": "longuser@example.com",
            "password": "testpassword123",
        }

        response = self.client.post(
            self.register_url, long_username_data, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.filter(username=long_username).count(), 0)

    def test_register_user_password_too_long(self):
        """Test registering a user with maximum length password (boundary value)"""
        max_length_password = "x" * 129

        max_password_data = {
            "username": "maxpassuser",
            "email": "maxpass@example.com",
            "password": max_length_password,
        }

        # Attempt to register with the maximum length password
        response = self.client.post(self.register_url, max_password_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.filter(username="maxpassuser").count(), 0)

    def test_register_user_invalid_email(self):
        """Test registering with an invalid email format (invalid class)"""
        invalid_email_data = {
            "username": "invalidemail",
            "email": "not-an-email-format",
            "password": "testpassword123",
        }

        response = self.client.post(
            self.register_url, invalid_email_data, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.filter(username="invalidemail").count(), 0)

    def test_register_user_missing_fields(self):
        """Test registering with missing required fields (invalid class)"""
        missing_data = {
            "username": "missingfields",
            # Missing email and password
        }
        response = self.client.post(self.register_url, missing_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_valid_credentials(self):
        """Test login with valid credentials (valid class)"""
        test_login_user = User.objects.create_user(
            username="logintest",
            email="logintest@example.com",
            password="correctpassword123",
        )

        login_data = {"username": "logintest", "password": "correctpassword123"}

        response = self.client.post(self.token_url, login_data, format="json")

        # Verify successful login
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify tokens are returned
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

        # Verify token works by using it to access a protected endpoint
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.data["access"]}')
        user_response = self.client.get(self.current_user_url)

        # Verify we can access user data with the token
        self.assertEqual(user_response.status_code, status.HTTP_200_OK)
        self.assertEqual(user_response.data["username"], "logintest")
        self.assertEqual(user_response.data["email"], "logintest@example.com")

    def test_login_nonexistent_user(self):
        """Test login with nonexistent username (invalid class)"""
        nonexistent_login_data = {
            "username": "nonexistentuser",
            "password": "somepassword",
        }

        response = self.client.post(
            self.token_url, nonexistent_login_data, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("detail", response.data)

    def test_login_wrong_password(self):
        """Test login with wrong password (invalid class)"""
        wrong_password_data = {"username": "existinguser", "password": "wrongpassword"}

        response = self.client.post(self.token_url, wrong_password_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("detail", response.data)

    def test_login_missing_fields(self):
        """Test login with missing required fields (invalid class)"""
        missing_username = {"password": "existingpassword123"}
        missing_password = {"username": "existinguser"}

        response1 = self.client.post(self.token_url, missing_username, format="json")
        response2 = self.client.post(self.token_url, missing_password, format="json")

        self.assertEqual(response1.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)

    def test_obtain_token(self):
        """Test obtaining JWT tokens"""
        # Try to login with the user created in setUp
        login_data = {"username": "existinguser", "password": "existingpassword123"}

        response = self.client.post(self.token_url, login_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_refresh_token(self):
        """Test refreshing a JWT token"""
        # Get tokens for the user
        tokens = self.get_tokens_for_user(self.user)

        # Try to refresh the token
        refresh_data = {"refresh": tokens["refresh"]}
        response = self.client.post(self.token_refresh_url, refresh_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

    def test_current_user(self):
        """Test the current user endpoint"""
        # Get tokens for the user
        tokens = self.get_tokens_for_user(self.user)

        # Set the token in the header
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {tokens["access"]}')

        # Try to get the current user
        response = self.client.get(self.current_user_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], self.user.username)
        self.assertEqual(response.data["email"], self.user.email)

    def test_unauthorized_access(self):
        """Test that unauthorized access is denied"""
        # Try to access current user without token
        response = self.client.get(self.current_user_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class RouteViewSetTests(APITestCase):
    """Tests for the RouteViewSet"""

    def setUp(self):
        """Create test data"""
        self.routes_url = reverse("route-list")

        # Create a test user
        self.user = User.objects.create_user(
            username="routetestuser",
            email="routetest@example.com",
            password="routetestpass123",
        )

        # Get JWT token for this user
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)

        # Set the token in the header for all requests
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")

        # Create some test routes with valid coordinates
        self.route1 = Route.objects.create(
            title="Test Route 1",
            description="This is test route 1",
            starting_location="Start Point 1",
            ending_location="End Point 1",
            coordinates=[
                [40.7128, -74.0060],
                [40.7129, -74.0061],
                [40.7130, -74.0062],
            ],  # NYC coordinates
            user=self.user,  # Associate with the test user
        )

        self.route2 = Route.objects.create(
            title="Different Route 2",
            description="This is test route 2",
            starting_location="Start Point 2",
            ending_location="End Point 2",
            coordinates=[[34.0522, -118.2437], [34.0523, -118.2438]],  # LA coordinates
            user=self.user,
        )

        self.route3 = Route.objects.create(
            title="Special Route",
            description="This is a route with special keyword",
            starting_location="Special Start",
            ending_location="End Point 3",
            coordinates=[
                [41.8781, -87.6298],
                [41.8782, -87.6299],
                [41.8783, -87.6300],
            ],  # Chicago coordinates
            user=self.user,
        )

        # Create another user for testing user isolation
        self.other_user = User.objects.create_user(
            username="otheruser", email="other@example.com", password="otherpass123"
        )

        # Create a route for the other user
        self.other_user_route = Route.objects.create(
            title="Other User's Route",
            description="This belongs to another user",
            starting_location="Other Start",
            ending_location="Other End",
            coordinates=[
                [42.3601, -71.0589],
                [42.3602, -71.0590],
            ],  # Boston coordinates
            user=self.other_user,
        )

    def test_get_all_routes_authenticated(self):
        """Test retrieving all routes when authenticated"""
        response = self.client.get(self.routes_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 4)

    def test_get_all_routes_unauthenticated(self):
        """Test that unauthenticated users cannot access routes"""
        # Remove credentials
        self.client.credentials()

        response = self.client.get(self.routes_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_single_route_authenticated(self):
        """Test retrieving a single route when authenticated"""
        url = reverse("route-detail", args=[self.route1.id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], self.route1.title)

    def test_create_route_authenticated(self):
        """Test creating a new route when authenticated"""
        new_route_data = {
            "title": "New Test Route",
            "description": "This is a new test route",
            "starting_location": "New Start",
            "ending_location": "New End",
            "coordinates": [
                [37.7749, -122.4194],
                [37.7750, -122.4195],
            ],  # SF coordinates
        }

        response = self.client.post(
            self.routes_url,
            data=json.dumps(new_route_data),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Verify the route was created and associated with the current user
        new_route = Route.objects.get(title="New Test Route")
        self.assertEqual(new_route.user, self.user)

    def test_create_route_unauthenticated(self):
        """Test that unauthenticated users cannot create routes"""
        # Remove credentials
        self.client.credentials()

        new_route_data = {
            "title": "Unauthenticated Route",
            "description": "This should not be created",
            "starting_location": "Start",
            "ending_location": "End",
            "coordinates": [[1.0, 1.0], [2.0, 2.0]],
        }

        response = self.client.post(
            self.routes_url,
            data=json.dumps(new_route_data),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_route_authenticated(self):
        """Test updating an existing route when authenticated"""
        url = reverse("route-detail", args=[self.route1.id])
        updated_data = {
            "title": "Updated Route Title",
            "description": self.route1.description,
            "starting_location": self.route1.starting_location,
            "ending_location": self.route1.ending_location,
            "coordinates": self.route1.coordinates,
        }

        response = self.client.put(
            url, data=json.dumps(updated_data), content_type="application/json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.route1.refresh_from_db()
        self.assertEqual(self.route1.title, "Updated Route Title")

    def test_cannot_update_other_users_route(self):
        """Test that a user cannot update another user's route"""
        url = reverse("route-detail", args=[self.other_user_route.id])
        updated_data = {
            "title": "Should Not Update",
            "description": self.other_user_route.description,
            "starting_location": self.other_user_route.starting_location,
            "ending_location": self.other_user_route.ending_location,
            "coordinates": self.other_user_route.coordinates,
        }

        response = self.client.put(
            url, data=json.dumps(updated_data), content_type="application/json"
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Verify the title was not updated
        self.other_user_route.refresh_from_db()
        self.assertEqual(self.other_user_route.title, "Other User's Route")

    def test_delete_route_authenticated(self):
        """Test deleting a route when authenticated"""
        url = reverse("route-detail", args=[self.route1.id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Verify the route was deleted
        with self.assertRaises(Route.DoesNotExist):
            Route.objects.get(id=self.route1.id)

    def test_cannot_delete_other_users_route(self):
        """Test that a user cannot delete another user's route"""
        url = reverse("route-detail", args=[self.other_user_route.id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Verify the route was not deleted
        self.assertEqual(Route.objects.filter(id=self.other_user_route.id).count(), 1)

    def test_search_routes_authenticated(self):
        """Test searching for routes when authenticated (valid class)"""
        # Clear existing routes for this test
        Route.objects.filter(user=self.user).delete()

        # Create specific test routes for this user
        special_route = Route.objects.create(
            title="Special Route",
            description="This is a special route",
            starting_location="Start Special",
            ending_location="End Special",
            coordinates=[[1.0, 1.0], [2.0, 2.0]],
            user=self.user,
        )

        regular_route = Route.objects.create(
            title="Regular Route",
            description="This is a regular route",
            starting_location="Start Regular",
            ending_location="End Regular",
            coordinates=[[3.0, 3.0], [4.0, 4.0]],
            user=self.user,
        )

        # Create a route for the other user with similar search terms
        other_special_route = Route.objects.create(
            title="Other Special Route",
            description="This should not appear in search results",
            starting_location="Start Special Other",
            ending_location="End Special Other",
            coordinates=[[5.0, 5.0], [6.0, 6.0]],
            user=self.other_user,
        )

        # Search by title
        response = self.client.get(f"{self.routes_url}?search=Special")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)

    def test_search_routes_unauthenticated(self):
        """Test that unauthenticated users cannot search routes (invalid class)"""
        # Remove credentials
        self.client.credentials()

        response = self.client.get(f"{self.routes_url}?search=Special")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_search_routes_empty_database(self):
        """Test searching when database has no routes (valid class)"""
        # Clear existing routes for this test
        Route.objects.filter(user=self.user).delete()
        Route.objects.filter(user=self.other_user).delete()

        response = self.client.get(f"{self.routes_url}?search=%20")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 0)

    def test_search_route_by_different_fields(self):
        """Test searching for a route by its different fields (valid class)"""
        # Clear existing routes for this test
        Route.objects.filter(user=self.user).delete()
        Route.objects.filter(user=self.other_user).delete()

        different_fields_route = Route.objects.create(
            title="Title",
            description="Description",
            starting_location="Start",
            ending_location="End",
            coordinates=[[1.0, 1.0], [2.0, 2.0]],
            tags=["passeio"],
            user=self.user,
        )

        # Test search by title
        response = self.client.get(f"{self.routes_url}?search=Title")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

        # Test search by description
        response = self.client.get(f"{self.routes_url}?search=Description")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

        # Test search by starting location
        response = self.client.get(f"{self.routes_url}?search=Start")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

        # Test search by ending location
        response = self.client.get(f"{self.routes_url}?search=End")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

        # Test search by tags
        response = self.client.get(f"{self.routes_url}?search=passeio")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

        # Test search by coordinates (should not match)
        response = self.client.get(f"{self.routes_url}?search=1.0")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 0)

        # Test search by two or more fields combined (should not match)
        response = self.client.get(f"{self.routes_url}?search=Title%20Start")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 0)

    def test_search_routes_partial_matching(self):
        """Test partial word matching in route search (valid class)"""
        # Clear existing routes for this test
        Route.objects.filter(user=self.user).delete()
        Route.objects.filter(user=self.other_user).delete()

        partial_matching_route = Route.objects.create(
            title="Partial Matching Search Test",
            description="Regular description",
            starting_location="Regular start",
            ending_location="Regular end",
            coordinates=[[10.0, 10.0], [11.0, 11.0]],
            user=self.user,
        )

        # Test beginning of a word
        response = self.client.get(f"{self.routes_url}?search=Part")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

        # Test middle of a word
        response = self.client.get(f"{self.routes_url}?search=script")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

        # Test end of a word
        response = self.client.get(f"{self.routes_url}?search=art")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

        # Test search with multiple word parts
        response = self.client.get(f"{self.routes_url}?search=ching%20Sea")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

    def test_search_routes_nonexistent_term(self):
        """Test searching with a term that doesn't exist in any route (valid class)"""
        response = self.client.get(f"{self.routes_url}?search=ThisTermDoesntExist")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 0)

    def test_search_routes_no_parameter(self):
        """Test searching when no search parameter is provided (invalid class)"""
        response = self.client.get(f"{self.routes_url}?search=")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_search_routes_very_long_term(self):
        """Test searching with very long search term (valid class)"""
        very_long_term = "x" * 500

        response = self.client.get(f"{self.routes_url}?search={very_long_term}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_search_routes_case_insensitivity(self):
        """Test case insensitivity in route search (valid class)"""
        case_route = Route.objects.create(
            title="UPPERCASE mixedCASE lowercase",
            description="Regular description",
            starting_location="Regular start",
            ending_location="Regular end",
            coordinates=[[1.0, 1.0], [2.0, 2.0]],
            user=self.user,
        )

        # Test lowercase searches
        response = self.client.get(f"{self.routes_url}?search=uppercase")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

        response = self.client.get(f"{self.routes_url}?search=mixedcase")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

        # Test uppercase searches
        response = self.client.get(f"{self.routes_url}?search=LOWERCASE")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

        response = self.client.get(f"{self.routes_url}?search=MIXEDCASE")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

        # Test multiple-word searches with mixed cases
        response = self.client.get(
            f"{self.routes_url}?search=uppercase%20MIXEDcase%20LOWERCASE"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

    def test_search_route_special_characters(self):
        """Test searching a route with special characters (valid class)"""

        # Check if SQLite is being used
        if connection.vendor == "sqlite":
            self.skipTest("Special character search behaves differently in SQLite")

        # Clear existing routes for this test
        Route.objects.filter(user=self.user).delete()
        Route.objects.filter(user=self.other_user).delete()

        special_chars_route = Route.objects.create(
            title="Spéçial!@#$% Route",
            description="Contains spêcial-charàcters & symbols",
            starting_location="🗺 start",
            ending_location="汉字/漢字",
            coordinates=[[1.0, 1.0], [2.0, 2.0]],
            user=self.user,
        )

        response = self.client.get(f"{self.routes_url}?search=Spéçial!@#$%")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

        response = self.client.get(f"{self.routes_url}?search=spÊcial-charÀcters%20&")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

        response = self.client.get(f"{self.routes_url}?search=🗺")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

        response = self.client.get(f"{self.routes_url}?search=汉字/漢字")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

        response = self.client.get(f"{self.routes_url}?search=%20")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

    def test_search_routes_with_filters(self):
        """Test search with user and ordering filters (valid class)"""
        # Clear existing routes for this test
        Route.objects.filter(user=self.user).delete()
        Route.objects.filter(user=self.other_user).delete()

        route1 = Route.objects.create(
            title="Test Kinda Popular Route",
            description="This route has 1 upvote",
            starting_location="Kinda popular start",
            ending_location="Kinda popular end",
            coordinates=[[1.0, 1.0], [2.0, 2.0]],
            user=self.other_user,
        )
        route1.upvotes.add(self.user)  # Add 1 upvote

        route2 = Route.objects.create(
            title="Test Popular Route",
            description="This route has 2 upvotes",
            starting_location="Popular start",
            ending_location="Popular end",
            coordinates=[[3.0, 3.0], [4.0, 4.0]],
            user=self.user,
        )
        route2.upvotes.add(self.user, self.other_user)  # Add 2 upvotes

        route3 = Route.objects.create(
            title="Test Unpopular Route",
            description="This route has no upvotes",
            starting_location="Unpopular start",
            ending_location="Unpopular end",
            coordinates=[[5.0, 5.0], [6.0, 6.0]],
            user=self.user,
        )

        # Test search with ordering by creation date (most recent first)
        response = self.client.get(
            f"{self.routes_url}?search=Test&order_by=-created_at"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 3)
        self.assertEqual(response.data["results"][0]["id"], route3.id)

        # Test search with ordering by likes
        response = self.client.get(f"{self.routes_url}?search=Test&order_by=liked")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 3)
        self.assertEqual(response.data["results"][0]["id"], route2.id)

        # Test search with ordering by trending
        response = self.client.get(f"{self.routes_url}?search=Test&order_by=trending")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 3)
        self.assertEqual(response.data["results"][0]["id"], route2.id)

        # Test search with user filter
        response = self.client.get(
            f"{self.routes_url}?search=Test&user={self.other_user.id}"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

        # Test with invalid order_by parameter (should fall back to default: -created_at)
        response = self.client.get(
            f"{self.routes_url}?search=Test&order_by=invalid_field"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["results"][0]["id"], route3.id)

    def test_calculate_distance(self):
        """Test that route distance is calculated correctly"""
        url = reverse("route-detail", args=[self.route1.id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("distance", response.data)
        self.assertIsInstance(response.data["distance"], float)

        # Route with no coordinates should have 0 distance
        empty_route = Route.objects.create(
            title="Empty Route",
            description="Route with no coordinates",
            starting_location="Empty Start",
            ending_location="Empty End",
            coordinates=[],
            user=self.user,
        )

        empty_url = reverse("route-detail", args=[empty_route.id])
        empty_response = self.client.get(empty_url)

        self.assertEqual(empty_response.status_code, status.HTTP_200_OK)
        self.assertEqual(empty_response.data["distance"], 0)

    def test_upvote_route(self):
        """Test upvoting a route"""
        url = reverse("route-detail", args=[self.route1.id]) + "vote/"
        response = self.client.post(url, {"vote_type": "upvote"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["upvotes_count"], 1)
        self.assertEqual(response.data["downvotes_count"], 0)
        self.assertEqual(response.data["user_vote"], "upvote")

        # Verify the upvote was added in the database
        self.route1.refresh_from_db()
        self.assertEqual(self.route1.upvotes.count(), 1)
        self.assertTrue(self.route1.upvotes.filter(id=self.user.id).exists())

    def test_downvote_route(self):
        """Test downvoting a route"""
        url = reverse("route-detail", args=[self.route1.id]) + "vote/"
        response = self.client.post(url, {"vote_type": "downvote"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["upvotes_count"], 0)
        self.assertEqual(response.data["downvotes_count"], 1)
        self.assertEqual(response.data["user_vote"], "downvote")

        # Verify the downvote was added in the database
        self.route1.refresh_from_db()
        self.assertEqual(self.route1.downvotes.count(), 1)
        self.assertTrue(self.route1.downvotes.filter(id=self.user.id).exists())

    def test_remove_upvote(self):
        """Test removing an upvote by clicking upvote again"""
        # First upvote the route
        self.route1.upvotes.add(self.user)

        url = reverse("route-detail", args=[self.route1.id]) + "vote/"
        response = self.client.post(url, {"vote_type": "upvote"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["upvotes_count"], 0)
        self.assertEqual(response.data["user_vote"], None)

        # Verify the upvote was removed in the database
        self.route1.refresh_from_db()
        self.assertEqual(self.route1.upvotes.count(), 0)

    def test_remove_downvote(self):
        """Test removing a downvote by clicking downvote again"""
        # First downvote the route
        self.route1.downvotes.add(self.user)

        url = reverse("route-detail", args=[self.route1.id]) + "vote/"
        response = self.client.post(url, {"vote_type": "downvote"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["downvotes_count"], 0)
        self.assertEqual(response.data["user_vote"], None)

        # Verify the downvote was removed in the database
        self.route1.refresh_from_db()
        self.assertEqual(self.route1.downvotes.count(), 0)

    def test_change_vote_upvote_to_downvote(self):
        """Test changing vote from upvote to downvote"""
        # First upvote the route
        self.route1.upvotes.add(self.user)

        url = reverse("route-detail", args=[self.route1.id]) + "vote/"
        response = self.client.post(url, {"vote_type": "downvote"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["upvotes_count"], 0)
        self.assertEqual(response.data["downvotes_count"], 1)
        self.assertEqual(response.data["user_vote"], "downvote")

        # Verify the vote was changed in the database
        self.route1.refresh_from_db()
        self.assertEqual(self.route1.upvotes.count(), 0)
        self.assertEqual(self.route1.downvotes.count(), 1)
        self.assertTrue(self.route1.downvotes.filter(id=self.user.id).exists())

    def test_change_vote_downvote_to_upvote(self):
        """Test changing vote from downvote to upvote"""
        # First downvote the route
        self.route1.downvotes.add(self.user)

        url = reverse("route-detail", args=[self.route1.id]) + "vote/"
        response = self.client.post(url, {"vote_type": "upvote"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["upvotes_count"], 1)
        self.assertEqual(response.data["downvotes_count"], 0)
        self.assertEqual(response.data["user_vote"], "upvote")

        # Verify the vote was changed in the database
        self.route1.refresh_from_db()
        self.assertEqual(self.route1.upvotes.count(), 1)
        self.assertEqual(self.route1.downvotes.count(), 0)
        self.assertTrue(self.route1.upvotes.filter(id=self.user.id).exists())

    def test_vote_unauthenticated(self):
        """Test that unauthenticated users cannot vote"""
        # Remove credentials
        self.client.credentials()

        url = reverse("route-detail", args=[self.route1.id]) + "vote/"
        response = self.client.post(url, {"vote_type": "upvote"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Verify no votes were added
        self.route1.refresh_from_db()
        self.assertEqual(self.route1.upvotes.count(), 0)
        self.assertEqual(self.route1.downvotes.count(), 0)

    def test_invalid_vote_type(self):
        """Test that an invalid vote type returns an error"""
        url = reverse("route-detail", args=[self.route1.id]) + "vote/"
        response = self.client.post(url, {"vote_type": "invalid_type"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_vote_counts_in_route_detail(self):
        """Test that vote counts appear in route detail endpoint"""
        # Add upvotes from multiple users
        self.route1.upvotes.add(self.user)
        self.route1.upvotes.add(self.other_user)

        url = reverse("route-detail", args=[self.route1.id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["upvotes_count"], 2)
        self.assertEqual(response.data["downvotes_count"], 0)
        self.assertEqual(response.data["user_vote"], "upvote")

    def test_creation_special_character_title(self):
        """
        Test creation with special characters title (valid class)
        """

        special_chars_data = {
            "title": "Special Ch@r$ Rouťé!",
            "description": "Route with spécial ch@racters & symbols",
            "starting_location": "Sp€cial Start!",
            "ending_location": "End Po!nt with $ymb@ls",
            "coordinates": [[40.7128, -74.0060], [40.7130, -74.0062]],
        }

        special_response = self.client.post(
            self.routes_url,
            data=json.dumps(special_chars_data),
            content_type="application/json",
        )

        self.assertEqual(special_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(special_response.data["title"], "Special Ch@r$ Rouťé!")

    def test_creation_title_too_long(self):
        """
        Test creation with title that exceeds the maximum length (Boundary value)
        """
        max_title_length = 256
        max_length_data = {
            "title": "T" * max_title_length,
            "description": "Route with title too long",
            "starting_location": "Long Start",
            "ending_location": "Long End",
            "coordinates": [[40.7128, -74.0060], [40.7130, -74.0062]],
        }

        max_length_response = self.client.post(
            self.routes_url,
            data=json.dumps(max_length_data),
            content_type="application/json",
        )

        self.assertEqual(max_length_response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_start_point_too_long(self):
        """
        Test creation with start location that exceeds the maximum length (Boundary value)
        """
        max_loc_length = 256
        max_length_data = {
            "title": "Start location length too long",
            "description": "A route with start location too long",
            "starting_location": "S" * max_loc_length,
            "ending_location": "Long End",
            "coordinates": [[40.7128, -74.0060], [40.7130, -74.0062]],
        }

        max_length_response = self.client.post(
            self.routes_url,
            data=json.dumps(max_length_data),
            content_type="application/json",
        )

        self.assertEqual(max_length_response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_end_point_too_long(self):
        """
        Test creation with end location that exceeds the maximum length (Boundary value)
        """
        max_loc_length = 256  # Assuming CharField with max_length=255
        max_length_data = {
            "title": "End location length too long",
            "description": "A route with end location too long",
            "starting_location": "Long Start",
            "ending_location": "E" * max_loc_length,
            "coordinates": [[40.7128, -74.0060], [40.7130, -74.0062]],
        }

        max_length_response = self.client.post(
            self.routes_url,
            data=json.dumps(max_length_data),
            content_type="application/json",
        )

        self.assertEqual(max_length_response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_route_creation_single_point(self):
        """
        Test creation with only one point (invalid class)
        """
        only_start_point_data = {
            "title": "Route with only start point",
            "description": "A route with only a start point",
            "starting_location": "Start",
            "coordinates": [
                [40.7128, -74.0060],
            ],
        }

        only_end_point_data = {
            "title": "End location length too long",
            "description": "A route with end location too long",
            "starting_location": "Long Start",
            "coordinates": [
                [40.7128, -74.0060],
            ],
        }

        start_point_response = self.client.post(
            self.routes_url,
            data=json.dumps(only_start_point_data),
            content_type="application/json",
        )

        end_point_response = self.client.post(
            self.routes_url,
            data=json.dumps(only_end_point_data),
            content_type="application/json",
        )

        self.assertEqual(start_point_response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(end_point_response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_route_missing_fields(self):
        """
        Test route creation with missing fields (invalid class)
        """

        route_missing_data = {
            "title": "End location length too long",
        }

        route_missing_response = self.client.post(
            self.routes_url,
            data=json.dumps(route_missing_data),
            content_type="application/json",
        )

        self.assertEqual(
            route_missing_response.status_code, status.HTTP_400_BAD_REQUEST
        )

    def test_filter_by_user_id_numeric(self):
        """Test filtering routes by user ID (numeric)"""
        url = f"{self.routes_url}?user={self.user.id}"
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should return only routes for the specified user
        self.assertEqual(len(response.data["results"]), 3)  # route1, route2, route3
        
    def test_filter_by_user_id_invalid(self):
        """Test filtering routes with invalid user ID"""
        url = f"{self.routes_url}?user=abc"  # Non-numeric ID
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should return empty list for non-numeric ID
        self.assertEqual(len(response.data["results"]), 0)

    def test_partial_update_as_owner(self):
        """Test partial update as route owner"""
        url = reverse("route-detail", args=[self.route1.id])
        patch_data = {"title": "Partially Updated"}
        
        response = self.client.patch(
            url, data=json.dumps(patch_data), content_type="application/json"
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.route1.refresh_from_db()
        self.assertEqual(self.route1.title, "Partially Updated")

    def test_partial_update_as_staff(self):
        """Test partial update as staff"""
        # Make user staff
        self.user.is_staff = True
        self.user.save()
        
        # Try to update another user's route
        url = reverse("route-detail", args=[self.other_user_route.id])
        patch_data = {"title": "Updated by Staff"}
        
        response = self.client.patch(
            url, data=json.dumps(patch_data), content_type="application/json"
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.other_user_route.refresh_from_db()
        self.assertEqual(self.other_user_route.title, "Updated by Staff")

    def test_partial_update_unauthorized(self):
        """Test partial update without permission"""
        # Ensure user is not staff
        self.user.is_staff = False
        self.user.save()
        
        # Try to update another user's route
        url = reverse("route-detail", args=[self.other_user_route.id])
        patch_data = {"title": "Should Not Update"}
        
        response = self.client.patch(
            url, data=json.dumps(patch_data), content_type="application/json"
        )
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.other_user_route.refresh_from_db()
        self.assertEqual(self.other_user_route.title, "Other User's Route")

    def test_my_routes_with_pagination(self):
        """Test my_routes endpoint with pagination"""
        # Create many routes to force pagination
        for i in range(30):
            Route.objects.create(
                title=f"My Route {i}",
                description=f"Description {i}",
                starting_location=f"Start {i}",
                ending_location=f"End {i}",
                coordinates=[[10.0, 10.0], [11.0, 11.0]],
                user=self.user
            )
        
        url = reverse("route-my-routes")
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check if paginated structure is returned
        self.assertIn("results", response.data)
        self.assertIn("count", response.data)
        
    def test_my_liked_routes(self):
        """Test my_liked_routes endpoint"""
        # Create some routes and like them
        liked_route = Route.objects.create(
            title="Route I Like",
            description="A route I liked",
            starting_location="Like Start",
            ending_location="Like End",
            coordinates=[[20.0, 20.0], [21.0, 21.0]],
            user=self.other_user
        )
        liked_route.upvotes.add(self.user)
        
        url = reverse("route-my-liked-routes")
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        if "results" in response.data:
            self.assertTrue(any(route['id'] == liked_route.id for route in response.data["results"]))
        else:
            self.assertTrue(liked_route.id in [route['id'] for route in response.data])

    