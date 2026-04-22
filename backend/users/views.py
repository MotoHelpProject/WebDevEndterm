from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from .models import Transport
from .serializers import RegisterSerializer, UserSerializer, TransportSerializer

User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username', '')
    password = request.data.get('password', '')
    user = authenticate(username=username, password=password)
    if not user:
        try:
            u = User.objects.get(email=username)
            user = authenticate(username=u.username, password=password)
        except User.DoesNotExist:
            pass
    if user:
        user.is_online = True
        user.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    return Response({'detail': 'Неверный логин или пароль'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    return Response(UserSerializer(request.user).data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_location(request):
    from core.serializers import LocationSerializer
    serializer = LocationSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)
    user = request.user
    user.latitude = serializer.validated_data['latitude']
    user.longitude = serializer.validated_data['longitude']
    user.is_online = True
    user.save()
    return Response({'status': 'ok'})


@api_view(['GET', 'POST', 'PATCH'])
@permission_classes([IsAuthenticated])
def transport(request):
    if request.method == 'GET':
        try:
            return Response(TransportSerializer(request.user.transport).data)
        except Transport.DoesNotExist:
            return Response(None)

    if request.method == 'POST':
        if hasattr(request.user, 'transport'):
            serializer = TransportSerializer(request.user.transport, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        serializer = TransportSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    # PATCH
    try:
        t = request.user.transport
    except Transport.DoesNotExist:
        return Response({'detail': 'Not found'}, status=404)
    serializer = TransportSerializer(t, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)
