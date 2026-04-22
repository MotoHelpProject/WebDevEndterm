from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Transport


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'phone', 'is_online', 'rating', 'rating_count']
    fieldsets = UserAdmin.fieldsets + (
        ('MotoHelp', {'fields': ('phone', 'avatar_path', 'latitude', 'longitude', 'is_online', 'rating', 'rating_count')}),
    )


@admin.register(Transport)
class TransportAdmin(admin.ModelAdmin):
    list_display = ['user', 'brand', 'model', 'plate_number', 'color']
