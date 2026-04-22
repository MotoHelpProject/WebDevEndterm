from django.urls import path
from . import views

urlpatterns = [
    # FBV
    path('requests/', views.requests_list),               # GET list, POST create
    path('requests/nearby/', views.nearby_requests),      # GET nearby

    # CBV
    path('requests/<int:pk>/', views.HelpRequestDetailView.as_view()),  # GET, PATCH, DELETE
    path('messages/', views.MessageListView.as_view()),                  # GET, POST

    # FBV
    path('ratings/', views.create_rating),                # POST
]
