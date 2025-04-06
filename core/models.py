from django.db import models
from typing import List

class Route(models.Model):
    start_point = models.CharField(max_length=200)
    end_point = models.CharField(max_length=200)
    distance = models.FloatField(help_text="Distance in kilometers")
    point_of_interest = models.ManyToManyField(
        "PointOfInterest",
        through="RoutePointOfInterest",
        related_name="routes",
    )

    def __str__(self):
        poi_list = self.route_point_of_interest.all().order_by("distance")
        
        if not poi_list:
            pois_str = "None"
        else:
            pois_str = "; ".join(
                f"{poi.point_of_interest.type} ({poi.distance} km)" for poi in poi_list
            )

        return (
            f"Route from {self.start_point} to {self.end_point} "
            f"({self.distance} km) | Points of Interest: {pois_str}"
    )

    def estimated_time(self, average_speed: float) -> float:
        if average_speed <= 0:
            raise ValueError("The average speed must be greater than zero!.")
        return self.distance / average_speed

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