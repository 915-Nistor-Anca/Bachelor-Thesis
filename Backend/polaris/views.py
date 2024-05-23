from datetime import datetime

from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework import generics
from skyfield.api import load, Topos
from skyfield.almanac import find_discrete, risings_and_settings, oppositions_conjunctions, moon_phases
from datetime import timedelta
from polaris.models import User, Observation, Equipment, SkyCondition, Star, UserProfile, Event
from polaris.serializers import UserSerializer, ObservationSerializer, EquipmentSerializer, SkyConditionSerializer, \
    StarSerializer, UserProfileSerializer, EventSerializer
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

        user_profile = UserProfile.objects.create(user=user)
        user_profile.save()
        print(user_profile)

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

def get_user_id(request, username):
    user = User.objects.get(username=username)
    return JsonResponse({'username': user.username, 'id': user.id, 'email': user.email})


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


def follow_user(request, from_user_id, to_user_id):
    from_user = get_object_or_404(UserProfile, user_id=from_user_id)
    to_user_profile = get_object_or_404(UserProfile, user_id=to_user_id)

    from_user.follow(to_user_profile.user)
    print("Following users:", from_user.following.all())
    return JsonResponse({'success': True})

def unfollow_user(request, from_user_id, to_user_id):
    from_user = get_object_or_404(UserProfile, user_id=from_user_id)
    to_user_profile = get_object_or_404(UserProfile, user_id=to_user_id)

    from_user.unfollow(to_user_profile.user)
    print("Following users:", from_user.following.all())
    return JsonResponse({'success': True})


def get_best_observation_times(request, latitude, longitude, planet_name, number_of_days):
    try:
        if float(latitude) >= 0:
            hemisphere = " N"
        else:
            hemisphere = " S"

        observer_lat = latitude + hemisphere


        if float(longitude) >= 0:
            hemisphere = " E"
        else:
            hemisphere = " W"

        observer_lon = longitude + hemisphere

        eph = load('ephemeris_data_file.bsp')
        planet = eph[planet_name.upper()]
        observer_location = Topos(observer_lat, observer_lon)

        ts = load.timescale()
        t0 = ts.now()
        t1 = ts.utc(t0.utc_datetime() + timedelta(days=number_of_days))

        f = risings_and_settings(eph, planet, observer_location)
        rise_set_times = find_discrete(t0, t1, f)
        oppositions_f = oppositions_conjunctions(eph, planet)
        opposition_times, events = find_discrete(t0, t1, oppositions_f)

        def is_good_observation_time(time):
            if not any(
                    abs((time.utc_datetime() - oppo_time.utc_datetime()).days) < 15 for oppo_time in opposition_times):
                return False

            phase_times, phases = find_discrete(t0, t1, moon_phases(eph))
            if any(abs((time.utc_datetime() - phase_time.utc_datetime()).days) < 3 and phase > 0.75 for
                   phase_time, phase in
                   zip(phase_times, phases)):
                return False

            return True

        good_times = [t.utc_strftime('%Y-%m-%d %H:%M:%S') for t, updown in zip(*rise_set_times) if
                      updown and is_good_observation_time(t)]

        response_data = {
            'latitude': observer_lat,
            'longitude': observer_lon,
            'planet': planet_name,
            'observation_times': good_times
        }

        return JsonResponse(response_data)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


from datetime import datetime, timedelta
import ephem

def lunar_eclipse_prediction(request, latitude, longitude):
    try:
        # Convert latitude and longitude to strings
        observer_latitude = str(latitude)
        observer_longitude = str(longitude)

        # Initialize start and end time
        curtime = datetime(2020, 1, 1, 0, 0, 0)
        endtime = datetime(2030, 12, 31, 23, 59, 59)

        # Initialize Moon, Sun, and observer
        moon = ephem.Moon()
        sun = ephem.Sun()
        observer = ephem.Observer()

        # Set observer's latitude and longitude
        observer.lat = observer_latitude  # Latitude of the observing location
        observer.lon = observer_longitude  # Longitude of the observing location
        observer.elevation = 0  # Place the observer at sea level
        observer.pressure = 0  # Disable atmospheric refraction

        eclipse_times = []

        # Loop every hour
        while curtime <= endtime:
            observer.date = curtime

            # Compute the positions of the Sun and the Moon relative to the observer
            moon.compute(observer)
            sun.compute(observer)

            # Calculate the separation between the Moon and the Sun, convert it from radians to degrees
            sep = abs(float(ephem.separation(moon, sun)) / 0.01745329252 - 180)

            # Eclipse occurs if the separation is less than 0.9°
            if sep < 0.9:
                eclipse_times.append(curtime.strftime('%Y/%m/%d %H:%M:%S'))
                # An eclipse cannot happen more than once in a day, so skip 24 hours when an eclipse is found
                curtime += timedelta(days=1)
            else:
                # Advance an hour if eclipse is not found
                curtime += timedelta(hours=1)

        return JsonResponse({'eclipse_times': eclipse_times})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


def solar_eclipse_prediction(request, latitude, longitude):
    curtime = datetime(2024, 1, 1, 0, 0, 0)        # start time
    endtime = datetime(2030, 12, 31, 23, 59, 59)   # end time
    moon = ephem.Moon()
    sun = ephem.Sun()
    observer = ephem.Observer()
    observer.lat, observer.lon = str(latitude), str(longitude)
    observer.elevation = 0        # assuming the observer is at sea level
    observer.pressure = 0         # disable refraction

    eclipses = []

    while curtime <= endtime:
        observer.date = curtime.strftime('%Y/%m/%d %H:%M:%S')

        # Compute the position of the sun and the moon with respect to the observer
        moon.compute(observer)
        sun.compute(observer)

        # Calculate separation between the moon and the sun, convert it from radians to degrees
        sep = abs((float(ephem.separation(moon, sun)) / 0.01745329252))

        # A solar eclipse happens if Sun-Earth-Moon alignment is <1.5976°
        if sep < 1.59754941:
            eclipses.append({
                'date': curtime.strftime('%Y/%m/%d %H:%M:%S'),
                'separation': sep
            })
            # Skip 24 hours when an eclipse is found
            curtime += timedelta(days=1)
        else:
            # Advance five minutes if an eclipse is not found
            curtime += timedelta(minutes=5)

    return JsonResponse(eclipses, safe=False)


class EventList(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer


class EventDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

