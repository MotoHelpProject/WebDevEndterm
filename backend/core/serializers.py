from rest_framework import serializers
from .models import HelpRequest, Message, Rating
from users.serializers import UserSerializer


# --- ModelSerializers ---

class HelpRequestSerializer(serializers.ModelSerializer):
    requester = UserSerializer(read_only=True)
    helper = UserSerializer(read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    distance_km = serializers.FloatField(read_only=True, default=None)

    class Meta:
        model = HelpRequest
        fields = ['id', 'requester', 'helper', 'category', 'category_display',
                  'status', 'status_display', 'latitude', 'longitude',
                  'radius_km', 'description', 'created_at', 'updated_at', 'distance_km']


class HelpRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = HelpRequest
        fields = ['category', 'latitude', 'longitude', 'radius_km', 'description']


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'request', 'sender', 'content', 'timestamp', 'is_read']


# --- Plain Serializers (non-ModelSerializer) ---

class LocationSerializer(serializers.Serializer):
    """Used to validate location update payload."""
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()


class RatingCreateSerializer(serializers.Serializer):
    """Used to validate rating submission payload."""
    request_id = serializers.IntegerField()
    score = serializers.IntegerField(min_value=1, max_value=5)
    comment = serializers.CharField(required=False, allow_blank=True, default='')
