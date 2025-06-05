import math
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from typing import List
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

class Route(models.Model):
    id = models.AutoField(primary_key=True)
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="routes",
        verbose_name="Created by"
    )
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    starting_location = models.CharField(max_length=255, blank=True)
    ending_location = models.CharField(max_length=255, blank=True)
    
    # Store coordinates as a JSON array of [lat, lng] pairs
    coordinates = models.JSONField(
        help_text="Array of geographic coordinates defining the route path",
        default=list
    )

    # Optional list of tags for categorizing the route, stored as a JSON array of strings
    tags = models.JSONField(
        help_text="Array of tags associated with the route",
        default=list,
        blank=True
    )
    
    image = models.ImageField(
        upload_to='route_images/',
        blank=True,
        null=True,
        help_text="An image representing this route"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)

    upvotes = models.ManyToManyField(
        User,
        related_name="upvoted_routes",
        blank=True,
        help_text="Users that upvoted this route"
    )
    
    downvotes = models.ManyToManyField(
        User,
        related_name="downvoted_routes",
        blank=True,
        help_text="Users that downvoted this route"
    )


    def __str__(self):
        return self.title
    
    @property
    def start_point(self):
        """Returns the first coordinate in the route"""
        if self.coordinates and len(self.coordinates) > 0:
            return self.coordinates[0]
        return None
    
    @property
    def end_point(self):
        """Returns the last coordinate in the route"""
        if self.coordinates and len(self.coordinates) > 0:
            return self.coordinates[-1]
        return None
    
    @property
    def distance(self):
        """Calculate the total distance of the route in kilometers"""
        if not self.coordinates or len(self.coordinates) < 2:
            return 0
            
        def haversine(point1, point2):
            """Calculate distance between two lat/lng points in km"""
            lat1, lng1 = point1
            lat2, lng2 = point2
            
            # Convert decimal degrees to radians
            lat1, lng1, lat2, lng2 = map(math.radians, [lat1, lng1, lat2, lng2])
            
            # Haversine formula for distance on a sphere
            dlat = lat2 - lat1
            dlng = lng2 - lng1
            a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlng/2)**2
            c = 2 * math.asin(math.sqrt(a))
            r = 6371  # Radius of earth in kilometers
            return c * r
        
        total = 0
        for i in range(len(self.coordinates)-1):
            total += haversine(self.coordinates[i], self.coordinates[i+1])
        return total

class UserDetails(models.Model):
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE,
        related_name='details'
    )
    # Store route history as a JSONField
    route_history = models.JSONField(
        default=list,
        blank=True,
        help_text="List of recently viewed routes with timestamps"
    )
    
    def __str__(self):
        return f"{self.user.username}'s details"
    
    def add_to_history(self, route_id, route_title=None):
        """Add a route to the user's history"""
        # Create new history entry
        entry = {
            "route_id": route_id,
            "viewed_at": timezone.now().isoformat(),
            "title": route_title
        }
        
        # Get current history
        history = list(self.route_history)
        
        # Remove if already exists
        history = [item for item in history if item.get('route_id') != route_id]
        
        # Add to beginning
        history.insert(0, entry)
        
        # Limit to 50 entries
        if len(history) > 50:
            history = history[:50]
            
        # Save back
        self.route_history = history
        self.save(update_fields=['route_history'])
        
        return history

    def get_history(self, limit=None):
        """Get user's route history, optionally limited"""
        history = self.route_history
        if limit and isinstance(limit, int):
            return history[:limit]
        return history

@receiver(post_save, sender=User)
def create_user_details(sender, instance, created, **kwargs):
    if created:
        UserDetails.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_details(sender, instance, **kwargs):
    instance.details.save()