from django.http import HttpResponse
from rest_framework import generics

from polaris.models import User
from polaris.serializers import UserSerializer
from django.contrib.auth import authenticate

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json


def index(request):
    return HttpResponse("Polaris App.")


class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


@csrf_exempt
def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if User.objects.filter(username=username).exists() or User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'There is already a user with this username!'}, status=400)
        elif User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'There is already a user which uses this email address!'}, status=400)

        user = User.objects.create_user(username=username, email=email, password=password)
        user.set_password(password)
        user.save()

        return JsonResponse({'message': 'User registered successfully!'}, status=201)

    else:
        return JsonResponse({'error': 'Method not allowed.'}, status=405)

@csrf_exempt
def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        print("username ", username, password)
        if not username or not password:
            return JsonResponse({'error': 'Email and password are required'}, status=400)

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User with this username does not exist'}, status=401)
        print("User with the given username exists.")
        print(user.email, user.password)
        user = authenticate(username=username, password=password)
        # user = authenticate(username=username, password=password)
        #print(username, password)
        print(user)
        if user is not None:
            return JsonResponse({'message': 'Login successful'}, status=200)
        else:
            return JsonResponse({'error': 'Invalid username or password'}, status=401)

    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
