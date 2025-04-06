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

