from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Transport

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'phone']

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            phone=validated_data.get('phone', ''),
        )


class UserSerializer(serializers.ModelSerializer):
    has_transport = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone', 'avatar_path',
                  'latitude', 'longitude', 'is_online', 'rating', 'rating_count', 'has_transport']

    def get_has_transport(self, obj):
        return hasattr(obj, 'transport')


class TransportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transport
        fields = ['id', 'brand', 'model', 'color', 'plate_number', 'photo_path']
