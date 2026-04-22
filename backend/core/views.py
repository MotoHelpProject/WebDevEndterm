import math
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import HelpRequest, Message, Rating
from .serializers import (
    HelpRequestSerializer, HelpRequestCreateSerializer,
    MessageSerializer, LocationSerializer, RatingCreateSerializer,
)


def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


# ── FBV: list + create ────────────────────────────────────────────────────────

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def requests_list(request):
    """GET my requests. POST create a new request."""
    if request.method == 'GET':
        qs = HelpRequest.objects.filter(requester=request.user).exclude(status='CANCELLED')
        return Response(HelpRequestSerializer(qs, many=True).data)

    serializer = HelpRequestCreateSerializer(data=request.data)
    if serializer.is_valid():
        req = serializer.save(requester=request.user)
        return Response(HelpRequestSerializer(req).data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def nearby_requests(request):
    """GET requests within radius (default 20 km)."""
    lat = float(request.query_params.get('lat', 0))
    lon = float(request.query_params.get('lon', 0))
    radius = float(request.query_params.get('radius', 20))

    active = HelpRequest.objects.filter(status='PENDING').exclude(requester=request.user)
    result = []
    for r in active:
        dist = haversine(lat, lon, r.latitude, r.longitude)
        if dist <= radius:
            data = HelpRequestSerializer(r).data
            data['distance_km'] = round(dist, 1)
            result.append(data)
    result.sort(key=lambda x: x['distance_km'])
    return Response(result)


# ── CBV: single request CRUD ──────────────────────────────────────────────────

class HelpRequestDetailView(APIView):
    """GET / PATCH / DELETE a single HelpRequest — full CRUD on one model."""
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        req = get_object_or_404(HelpRequest, pk=pk)
        return Response(HelpRequestSerializer(req).data)

    def patch(self, request, pk):
        req = get_object_or_404(HelpRequest, pk=pk)
        action = request.data.get('action')
        if action == 'accept' and req.status == 'PENDING':
            req.helper = request.user
            req.status = 'ACCEPTED'
            req.save()
        elif action == 'complete' and req.status == 'ACCEPTED':
            req.status = 'COMPLETED'
            req.save()
        elif action == 'cancel':
            req.status = 'CANCELLED'
            req.save()
        return Response(HelpRequestSerializer(req).data)

    def delete(self, request, pk):
        req = get_object_or_404(HelpRequest, pk=pk, requester=request.user)
        req.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ── CBV: messages ─────────────────────────────────────────────────────────────

class MessageListView(APIView):
    """GET messages for a request. POST send a message."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        request_id = request.query_params.get('request_id')
        req = get_object_or_404(HelpRequest, pk=request_id)
        msgs = req.messages.all()
        msgs.filter(is_read=False).exclude(sender=request.user).update(is_read=True)
        return Response(MessageSerializer(msgs, many=True).data)

    def post(self, request):
        request_id = request.data.get('request_id')
        req = get_object_or_404(HelpRequest, pk=request_id)
        content = request.data.get('content', '').strip()
        if not content:
            return Response({'detail': 'Empty message'}, status=400)
        msg = Message.objects.create(request=req, sender=request.user, content=content)
        return Response(MessageSerializer(msg).data, status=201)


# ── FBV: rating ───────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_rating(request):
    """POST submit a rating using plain Serializer for validation."""
    serializer = RatingCreateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    data = serializer.validated_data
    req = get_object_or_404(HelpRequest, pk=data['request_id'])

    if hasattr(req, 'rating'):
        return Response({'detail': 'Already rated'}, status=400)

    rated_user = req.helper if req.requester == request.user else req.requester
    if not rated_user:
        return Response({'detail': 'No one to rate'}, status=400)

    Rating.objects.create(
        request=req, rater=request.user, rated=rated_user,
        score=data['score'], comment=data['comment'],
    )

    all_ratings = rated_user.ratings_received.all()
    rated_user.rating_count = all_ratings.count()
    rated_user.rating = sum(r.score for r in all_ratings) / rated_user.rating_count
    rated_user.save()

    return Response({'status': 'ok', 'score': data['score']})
