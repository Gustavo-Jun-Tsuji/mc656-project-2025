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
    point_of_interest = models.ManyToManyField(
        "PointOfInterest",
        through="RoutePointOfInterest",
        related_name="routes",
    )
    feedbacks = models.ManyToManyField(FeedbackRoute, blank=True, related_name="routes")

    def __str__(self):
        poi_list = self.route_point_of_interest.all().order_by("distance")
        
        if not poi_list:
            pois_str = "None"
        else:
            pois_str = "; ".join(
                f"{poi.point_of_interest.type} ({poi.distance} km)" for poi in poi_list
            )

        feedback_count = self.feedbacks.count()
        feedback_str = f", {feedback_count} feedback{'s' if feedback_count != 1 else ''}"

        return (
            f"Route from {self.start_point} to {self.end_point} "
            f"({self.distance} km) | Points of Interest: {pois_str}{feedback_str}"
        )

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

class PointOfInterest(models.Model):
    type = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.type}"

class RoutePointOfInterest(models.Model):
    route = models.ForeignKey( "Route", on_delete=models.CASCADE, related_name="route_point_of_interest")
    point_of_interest = models.ForeignKey("PointOfInterest", on_delete=models.CASCADE)

    # No checking. Think of a smart way to associate routes with points of interest.
    distance = models.FloatField()

    class Meta:
        unique_together = ("route", "point_of_interest")
        ordering = ["distance"]

    def __str__(self):
        return f"{self.route} - {self.point_of_interest} ({self.distance})"