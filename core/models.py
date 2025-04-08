from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from typing import List

class FeedbackRoute(models.Model):
    user = models.CharField(max_length=100)
    
    rating = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        verbose_name="Rating (0-5 stars)"
    )
    
    message = models.TextField()
    upvotes = models.IntegerField(default=0)
    downvotes = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def display_feedback(self) -> None:
        print(f"\nUsuário: {self.user}")
        print(f"Avaliação: {'★' * self.rating}{'☆' * (5 - self.rating)}")
        print(f"Mensagem: {self.message}")
        print(f"Votos: ↑{self.upvotes} ↓{self.downvotes} (Saldo: {self.upvotes - self.downvotes})")
        print(f"Data: {self.created_at.strftime('%d/%m/%Y %H:%M')}")
    
    def __str__(self):
        return f"Feedback por: {self.user} - {self.rating} estrelas"
    
    class Meta:
        verbose_name = "Route Feedback"
        verbose_name_plural = "Route Feedbacks"

class Route(models.Model):
    start_point = models.CharField(max_length=200)
    end_point = models.CharField(max_length=200)
    distance = models.FloatField(help_text="Distance in kilometers")
    feedbacks = models.ManyToManyField(FeedbackRoute, blank=True, related_name="routes")

    def __str__(self):
        return f"{self.start_point} → {self.end_point} ({self.distance} km)"

    def estimated_time(self, average_speed: float) -> float:
        if average_speed <= 0:
            raise ValueError("The average speed must be greater than zero!.")
        return self.distance / average_speed

    def show_feedbacks(self, quantity: int) -> None:
        top_feedbacks = self.feedbacks.annotate(
            votes=models.F('upvotes') - models.F('downvotes')
        ).order_by('-votes')[:quantity]
        
        print(f"\nTop {quantity} feedbacks por rota {self.start_point} → {self.end_point}:")
        for feedback in top_feedbacks:
            feedback.display_feedback()

    def feedbacks_by_location(self, location: str) -> None:
        routes = Route.objects.filter(
            models.Q(start_point__icontains=location) | 
            models.Q(end_point__icontains=location)
        ).prefetch_related('feedbacks')
        
        print(f"\nFeedbacks de rotas com origem ou destino em: '{location}':")
        for route in routes:
            print(f"\nRoute: {route.start_point} → {route.end_point}")
            for feedback in route.feedbacks.all():
                feedback.display_feedback()

    @classmethod
    def create_route(cls, start_point: str, end_point: str, distance: float) -> "Route":
        route = cls(start_point=start_point, end_point=end_point, distance=distance)
        route.save()
        return route

    @classmethod
    def list_routes(cls) -> List["Route"]:
        return cls.objects.all()