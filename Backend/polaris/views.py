from django.http import HttpResponse
from rest_framework import generics
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
import json

from polaris.models import User
from polaris.serializers import UserSerializer


def index(request):
    return HttpResponse("Polaris App.")

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

from django.contrib.auth import authenticate
from django.http import JsonResponse

def login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        if not email or not password:
            return JsonResponse({'error': 'Email and password are required'}, status=400)

        user = authenticate(request, email=email, password=password)

        if user is not None:
            return JsonResponse({'message': 'Login successful'}, status=200)
        else:
            return JsonResponse({'error': 'Invalid email or password'}, status=401)

    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
