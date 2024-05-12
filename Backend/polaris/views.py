from datetime import datetime

from django.http import HttpResponse, HttpResponseNotFound
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from Backend import settings
from polaris.models import User, Observation, Equipment, SkyCondition, Star, UserProfile
from polaris.serializers import UserSerializer, ObservationSerializer, EquipmentSerializer, SkyConditionSerializer, \
    StarSerializer, UserProfileSerializer
from django.contrib.auth import authenticate

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from django.conf import settings
import os
# from polaris.models import Image
# def get_image(request, name):
#     print("GET IMAGE")
#     image_path = os.path.join(settings.MEDIA_ROOT, name)
#     image_path = image_path.replace("media", "media/images")
#     image_path = image_path.replace('/', '\\')
#     print("IMAGE PATH:", image_path)
#     if os.path.exists(image_path):
#         print("the path exists: ", image_path)
#         with open(image_path, 'rb') as f:
#             return HttpResponse(f.read(), content_type='image/jpeg')
#     else:
#         return HttpResponse(status=404)

def index(request):
    return HttpResponse("Polaris App.")


class StarList(generics.ListCreateAPIView):
    queryset = Star.objects.all()
    serializer_class = StarSerializer


class EquipmentList(generics.ListCreateAPIView):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer


class SkyConditionList(generics.ListCreateAPIView):
    queryset = SkyCondition.objects.all()
    serializer_class = SkyConditionSerializer


class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer



class UserProfileDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    lookup_field = 'user_id'


class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserProfileList(generics.ListCreateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

class ObservationDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Observation.objects.all()
    serializer_class = ObservationSerializer


# class ImageDetail(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Image.objects.all()
#     serializer_class = ImageSerializer
#


class EquipmentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer


class AllObservationList(generics.ListCreateAPIView):
    queryset = Observation.objects.all()
    serializer_class = ObservationSerializer


class ObservationList(generics.ListCreateAPIView):
    queryset = Observation.objects.all()
    serializer_class = ObservationSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Observation.objects.filter(user_id=user_id)


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
            return JsonResponse({'message': 'Login successful', 'user_id': user.id, 'username': user.username},
                                status=200)
        else:
            return JsonResponse({'error': 'Invalid username or password'}, status=401)

    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)


class SkyConditionDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = SkyCondition.objects.all()
    serializer_class = SkyConditionSerializer

class StarDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Star.objects.all()
    serializer_class = StarSerializer


def get_sky_condition_id(request, name):
    sky_condition = SkyCondition.objects.get(name=name)
    sky_condition_id = sky_condition.id
    print(f"The ID of '{name}' is {sky_condition_id}")

    return JsonResponse({'id': sky_condition_id})

def get_equipment_id(request, name):
    equipment = Equipment.objects.get(name=name)
    equipment_id = equipment.id
    print(f"The ID of '{name}' is {equipment_id}")
    return JsonResponse({'id': equipment_id})


def get_followers(request, id):
    try:
        followers_profiles = UserProfile.objects.filter(following__id=id)
        follower_ids = [profile.user.id for profile in followers_profiles]

        return JsonResponse({'followers': follower_ids})
    except UserProfile.DoesNotExist:
        return JsonResponse({'error': 'User profile does not exist'}, status=404)



# class ImageList(generics.ListCreateAPIView):
#     queryset = Image.objects.all()
#     serializer_class = ImageSerializer