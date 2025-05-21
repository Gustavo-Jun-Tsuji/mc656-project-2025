from rest_framework import serializers
from .models import Route

class RouteSerializer(serializers.ModelSerializer):
    distance = serializers.SerializerMethodField()
    
    class Meta:
        model = Route
        fields = ['id', 'title', 'description', 'starting_location', 'ending_location', 
                  'coordinates', 'tags', 'created_at', 'distance', 'start_point', 'end_point']
        read_only_fields = ['id', 'created_at', 'distance', 'start_point', 'end_point']
    
    def get_distance(self, obj):
        return obj.distance