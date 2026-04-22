from django.contrib import admin
from .models import HelpRequest, Message, Rating


@admin.register(HelpRequest)
class HelpRequestAdmin(admin.ModelAdmin):
    list_display = ['requester', 'category', 'status', 'helper', 'created_at']
    list_filter = ['category', 'status']


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['request', 'sender', 'timestamp', 'is_read']


@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ['request', 'rater', 'rated', 'score', 'created_at']
