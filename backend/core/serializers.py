from rest_framework import serializers
from .models import Route

class RouteSerializer(serializers.ModelSerializer):
    distance = serializers.SerializerMethodField()
    
    class Meta:
        model = Route
        fields = ['id', 'title', 'description', 'starting_location', 'ending_location', 
                  'coordinates', 'created_at', 'distance', 'start_point', 'end_point', 'image']
        read_only_fields = ['id', 'created_at', 'distance', 'start_point', 'end_point']
    
    def get_distance(self, obj):
        return obj.distance

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if rep['image']:
            # Just return the relative URL path
            rep['image'] = instance.image.url
        return rep