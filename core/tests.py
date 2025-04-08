from django.test import TestCase
from core.models import Route, FeedbackRoute
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
