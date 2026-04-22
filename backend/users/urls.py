from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenBlacklistView
from . import views

urlpatterns = [
    path('register/', views.register),
    path('login/', views.login),
    path('logout/', TokenBlacklistView.as_view()),
    path('refresh/', TokenRefreshView.as_view()),
    path('me/', views.me),
    path('me/location/', views.update_location),
    path('transport/', views.transport),
]
