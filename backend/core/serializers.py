from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Route

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
            'username': {'required': True}
        }
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class RouteSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    distance = serializers.SerializerMethodField()
    
    class Meta:
        model = Route
        fields = ['id', 'user', 'username', 'title', 'description', 'starting_location', 'ending_location', 
                  'coordinates', 'tags', 'created_at', 'distance', 'start_point', 'end_point', 'image']
        read_only_fields = ['id', 'created_at', 'user', 'distance', 'start_point', 'end_point']
    
    def get_distance(self, obj):
        return obj.distance

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if rep['image']:
            # Just return the relative URL path
            rep['image'] = instance.image.url
        return rep