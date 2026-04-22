from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class HelpRequest(models.Model):
    CATEGORY_CHOICES = [
        ('GAS', 'Бензин'),
        ('TOOL', 'Инструмент'),
        ('EVAC', 'Эвакуация'),
    ]
    STATUS_CHOICES = [
        ('PENDING', 'Ожидание'),
        ('ACCEPTED', 'Принято'),
        ('COMPLETED', 'Завершено'),
        ('CANCELLED', 'Отменено'),
    ]

    requester = models.ForeignKey(User, on_delete=models.CASCADE, related_name='requests_made')
    helper = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='requests_helped')
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    latitude = models.FloatField()
    longitude = models.FloatField()
    radius_km = models.IntegerField(default=15)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'help_requests'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.requester} — {self.category} ({self.status})"


class Message(models.Model):
    request = models.ForeignKey(HelpRequest, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        db_table = 'messages'
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.sender} → {self.request_id}: {self.content[:40]}"


class Rating(models.Model):
    request = models.OneToOneField(HelpRequest, on_delete=models.CASCADE, related_name='rating')
    rater = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ratings_given')
    rated = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ratings_received')
    score = models.IntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ratings'

    def __str__(self):
        return f"{self.rater} → {self.rated}: {self.score}★"
