import builtins
from unittest.mock import patch
from django.test import TestCase
from core.models import Route, FeedbackRoute, PointOfInterest, FeedbackPOI
from django.core.exceptions import ValidationError

class FeedbackRouteTestCase(TestCase):
    def setUp(self):
        self.route = Route.objects.create(
            start_point="A",
            end_point="B",
            distance=400.0
        )
        self.feedback = FeedbackRoute.objects.create(
            user="Maria",
            rating=5,
            message="Lugar ótimo para relaxar!",
            upvotes=15,
            downvotes=1
        )
        self.route.feedbacks.add(self.feedback)

    def test_feedback_attributes(self):
        self.assertEqual(self.feedback.user, "Maria")
        self.assertEqual(self.feedback.rating, 5)
        self.assertEqual(self.feedback.message, "Lugar ótimo para relaxar!")
        self.assertEqual(self.feedback.upvotes, 15)
        self.assertEqual(self.feedback.downvotes, 1)

    def test_rating_validation(self):
        feedback = FeedbackRoute(
            user="João",
            rating=3,
            message="Legal",
            upvotes=5,
            downvotes=2
        )
        feedback.full_clean()

        with self.assertRaises(ValidationError):
            feedback.rating = -1
            feedback.full_clean()

        with self.assertRaises(ValidationError):
            feedback.rating = 6
            feedback.full_clean()

    def test_feedback_str_representation(self):
        expected = "Feedback por: Maria - 5 estrelas"
        self.assertEqual(str(self.feedback), expected)

    def test_display_feedback_output(self):
        from io import StringIO
        import sys
        
        captured_output = StringIO()
        sys.stdout = captured_output
        
        self.feedback.display_feedback()
        sys.stdout = sys.__stdout__
        
        output = captured_output.getvalue()
        self.assertIn("Usuário: Maria", output)
        self.assertIn("Avaliação: ★★★★★", output)
        self.assertIn("Mensagem: Lugar ótimo para relaxar!", output)
        self.assertIn("Votos: ↑15 ↓1 (Saldo: 14)", output)


class RouteTestCase(TestCase):
    def setUp(self):
        self.route = Route.create_route("A", "B", 100.0)

    def test_create_route_successfully(self):
        self.assertEqual(self.route.start_point, "A")
        self.assertEqual(self.route.end_point, "B")
        self.assertEqual(self.route.distance, 100.0)
        self.assertEqual(Route.objects.count(), 1)

    def test_estimated_time_with_valid_speed(self):
        route = Route.create_route("C", "D", 120.0)
        tempo = route.estimated_time(60.0)
        self.assertEqual(tempo, 2.0)

    def test_estimated_time_with_zero_speed_raises_error(self):
        with self.assertRaisesMessage(ValueError, "greater than zero"):
            self.route.estimated_time(0)

    def test_list_routes_returns_all_routes(self):
        Route.objects.create(start_point="C", end_point="D", distance=50)
        routes = Route.list_routes()

        self.assertEqual(len(routes), 2)

        expected_routes = [
            ("A", "B", 100.0),
            ("C", "D", 50.0),
        ]
        for route, (start, end, dist) in zip(routes, expected_routes):
            with self.subTest(route=route):
                self.assertEqual(route.start_point, start)
                self.assertEqual(route.end_point, end)
                self.assertEqual(route.distance, dist)


class PointOfInterestTestCase(TestCase):
    def setUp(self):
        self.point = PointOfInterest.create_point_of_interest(
            name="Praça Central",
            type_="Praça",
            category="Lazer",
            address="Av. Central, 123",
            latitude=-22.8125,
            longitude=-47.0689,
            description="Uma praça tranquila com bancos e árvores."
        )

    def test_create_point_of_interest(self):
        self.assertEqual(self.point.name, "Praça Central")
        self.assertEqual(self.point.type, "Praça")
        self.assertEqual(self.point.category, "Lazer")
        self.assertEqual(self.point.address, "Av. Central, 123")
        self.assertEqual(self.point.latitude, -22.8125)
        self.assertEqual(self.point.longitude, -47.0689)
        self.assertEqual(self.point.description, "Uma praça tranquila com bancos e árvores.")
        self.assertEqual(PointOfInterest.objects.count(), 1)

    def test_point_of_interest_str_representation(self):
        expected = "Praça Central (Praça)"
        self.assertEqual(str(self.point), expected)

    def test_show_description(self):
        with patch.object(builtins, 'print') as mock_print:
            self.point.show_description()
            mock_print.assert_called_with("Descrição: Uma praça tranquila com bancos e árvores.")

    def test_add_feedback(self):
        self.point.add_feedback(
            author="João",
            comment="Ótimo lugar!",
            rating=5
        )
        feedbacks = FeedbackPOI.objects.filter(point_of_interest=self.point)
        self.assertEqual(feedbacks.count(), 1)
        self.assertEqual(feedbacks.first().author, "João")

    def test_get_feedbacks(self):
        FeedbackPOI.objects.create(point_of_interest=self.point, author="Ana", comment="Gostei", rating=4)
        FeedbackPOI.objects.create(point_of_interest=self.point, author="Carlos", comment="Legal", rating=5)
        feedbacks = self.point.get_feedbacks()
        self.assertEqual(len(feedbacks), 2)

    def test_calculate_distance(self):
        distance = self.point.calculate_distance(user_latitude=-22.8200, user_longitude=-47.0700)
        self.assertGreater(distance, 0)
        self.assertLess(distance, 5)
    
    def test_list_points_of_interest(self):
        PointOfInterest.create_point_of_interest(
            name="Museu de Arte",
            type_="Museu",
            category="Cultura",
            address="Rua da Cultura, 456",
            latitude=-22.8150,
            longitude=-47.0650,
            description="Museu com exposições de arte moderna."
        )
        points = PointOfInterest.list_points_of_interest()
        self.assertEqual(len(points), 2)
        self.assertIn(self.point, points)


class FeedbackPOITestCase(TestCase):
    def setUp(self):
        self.point = PointOfInterest.objects.create(
            name="Parque das Águas",
            type="Parque",
            category="Lazer",
            address="Rua das Flores, 789",
            latitude=-44.7605,
            longitude=-60.3855,
            description="Parque com lago e pista de caminhada."
        )
        self.feedback = FeedbackPOI.objects.create(
            point_of_interest=self.point,
            author="Maria",
            comment="Lugar ótimo para relaxar.",
            rating=5
        )

    def test_feedback_attributes(self):
        self.assertEqual(self.feedback.author, "Maria")
        self.assertEqual(self.feedback.rating, 5)
        self.assertEqual(self.feedback.point_of_interest, self.point)

    def test_feedback_str_representation(self):
        expected = "Maria avaliou 'Parque das Águas' com nota 5"
        self.assertEqual(str(self.feedback), expected)