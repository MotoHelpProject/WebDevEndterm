from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    phone = models.CharField(max_length=20, blank=True)
    avatar_path = models.CharField(max_length=255, blank=True, default='assets/default-avatar.png')
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    is_online = models.BooleanField(default=False)
    rating = models.FloatField(default=0.0)
    rating_count = models.IntegerField(default=0)

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.username


class Transport(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='transport')
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    color = models.CharField(max_length=50)
    plate_number = models.CharField(max_length=20)
    photo_path = models.CharField(max_length=255, blank=True, default='assets/default-bike.png')

    class Meta:
        db_table = 'transport'

    def __str__(self):
        return f"{self.brand} {self.model} ({self.plate_number})"
