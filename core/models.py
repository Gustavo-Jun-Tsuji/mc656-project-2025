import math
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

class PointOfInterest(models.Model):
    name = models.CharField(max_length=200)
    # TODO: replace 'type' (CharField) with a relationship to another class
    type = models.CharField(max_length=100, help_text="Concrete form/function of the point (e.g., restaurant, park, etc.)") 
    category = models.CharField(max_length=100, blank=True, help_text="Theme it fits into (e.g., leisure, culture, etc.)")
    address = models.CharField(max_length=255)
    latitude = models.FloatField(validators=[MinValueValidator(-90), MaxValueValidator(90)])
    longitude = models.FloatField(validators=[MinValueValidator(-180), MaxValueValidator(180)])
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_edit = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.name} ({self.type})"

    def show_description(self) -> None:
        print(f"Descrição: {self.description}")

    def add_feedback(self, author: str, comment: str, rating: int) -> None:
        FeedbackPOI.objects.create(point_of_interest=self, author=author, comment=comment, rating=rating)

    def get_feedbacks(self) -> List["FeedbackPOI"]:
        return list(self.feedbackpoi_set.all())

    def calculate_distance(self, user_latitude: float, user_longitude: float) -> float:
        """
        Calculates the distance in kilometers between the point of interest and the user's location
        using the Haversine formula.
        """
        earth_radius = 6371

        lat1 = math.radians(self.latitude)
        lon1 = math.radians(self.longitude)
        lat2 = math.radians(user_latitude)
        lon2 = math.radians(user_longitude)

        dlat = lat2 - lat1
        dlon = lon2 - lon1

        a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        distance = earth_radius * c

        return distance

    @classmethod
    def create_point_of_interest(cls, name: str, type_: str, category: str, address: str,
                                 latitude: float, longitude: float, description: str) -> "PointOfInterest":
        point = cls(name=name, type=type_, category=category, address=address,
                    latitude=latitude, longitude=longitude, description=description)
        point.save()
        return point

    @classmethod
    def list_points_of_interest(cls) -> List["PointOfInterest"]:
        return cls.objects.all()


class FeedbackPOI(models.Model):
    point_of_interest = models.ForeignKey("PointOfInterest", on_delete=models.CASCADE)
    author = models.CharField(max_length=100)
    comment = models.TextField(blank=True)
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], help_text="Rating from 1 to 5")
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.author} avaliou '{self.point_of_interest.name if self.point_of_interest else 'Unknown'}' com nota {self.rating}"