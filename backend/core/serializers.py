from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Route, UserDetails

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
    upvotes_count = serializers.SerializerMethodField()
    downvotes_count = serializers.SerializerMethodField()
    user_vote = serializers.SerializerMethodField()
    
    class Meta:
        model = Route
        fields = ['id', 'user', 'username', 'title', 'description', 'starting_location', 'ending_location', 
                  'coordinates', 'tags', 'created_at', 'distance', 'start_point', 'end_point', 'image', 'upvotes_count', 'downvotes_count', 'user_vote']
        read_only_fields = ['id', 'created_at', 'user', 'distance', 'start_point', 'end_point']
    
    def get_distance(self, obj):
        return obj.distance

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if rep['image']:
            # Just return the relative URL path
            rep['image'] = instance.image.url
        return rep
    
    
    def get_upvotes_count(self, obj):
        return obj.upvotes.count()
    
    def get_downvotes_count(self, obj):
        return obj.downvotes.count()
    
    def get_user_vote(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            if request.user in obj.upvotes.all():
                return "upvote"
            elif request.user in obj.downvotes.all():
                return "downvote"
        return None
    
class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDetails
        fields = ['route_history']
        read_only_fields = ['route_history']