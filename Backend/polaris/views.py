from datetime import datetime

from django.contrib.auth.tokens import default_token_generator
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import generics
from skyfield.api import load, Topos
from skyfield.almanac import find_discrete, risings_and_settings, oppositions_conjunctions, moon_phases
from datetime import timedelta
from polaris.models import User, Observation, Equipment, SkyCondition, Star, UserProfile, Event, Notification, Planet, \
    Constellation, Message, Chat
from polaris.serializers import UserSerializer, ObservationSerializer, EquipmentSerializer, SkyConditionSerializer, \
    StarSerializer, UserProfileSerializer, EventSerializer, ImageSerializer, NotificationSerializer, PlanetSerializer, \
    ConstellationSerializer, MessageSerializer, ChatSerializer
from django.contrib.auth import authenticate

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from django.conf import settings
import os
from polaris.models import Image
def get_image(request, name):
    print("GET IMAGE")
    image_path = os.path.join(settings.MEDIA_ROOT, name)
    image_path = image_path.replace("media", "media/images")
    image_path = image_path.replace('/', '\\')
    print("IMAGE PATH:", image_path)
    if os.path.exists(image_path):
        print("the path exists: ", image_path)
        with open(image_path, 'rb') as f:
            return HttpResponse(f.read(), content_type='image/jpeg')
    else:
        return HttpResponse(status=404)

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

class NotificationList(generics.ListCreateAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

class UserProfileList(generics.ListCreateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

class ObservationDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Observation.objects.all()
    serializer_class = ObservationSerializer


class ImageDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer



class EquipmentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer

class NotificationDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer


class AllObservationList(generics.ListCreateAPIView):
    queryset = Observation.objects.all()
    serializer_class = ObservationSerializer


class ObservationList(generics.ListCreateAPIView):
    queryset = Observation.objects.all()
    serializer_class = ObservationSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Observation.objects.filter(user_id=user_id)


class NotificationUserList(generics.ListCreateAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Notification.objects.filter(notification_receiver=user_id)

class EventList(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def get_queryset(self):
        organizer = self.kwargs['organizer']
        return Event.objects.filter(organizer=organizer)


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



class ImageList(generics.ListCreateAPIView):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer


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
    if planet_name == "mars":
        planet_name = "MARS BARYCENTER"
    elif planet_name == "jupiter":
        planet_name = "JUPITER BARYCENTER"
    elif planet_name == "saturn":
        planet_name = "SATURN BARYCENTER"
    elif planet_name == "uranus":
        planet_name = "URANUS BARYCENTER"
    elif planet_name == "neptune":
        planet_name = "NEPTUNE BARYCENTER"
    elif planet_name == "pluto":
        planet_name = "PLUTO BARYCENTER"

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

        eph = load('de421.bsp')
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


def lunar_eclipse_prediction(request, latitude, longitude, number_of_days):
    try:
        # Convert latitude and longitude to strings
        observer_latitude = str(latitude)
        observer_longitude = str(longitude)

        # Initialize start and end time
        # curtime = datetime(2020, 1, 1, 0, 0, 0)
        # endtime = datetime(2025, 12, 31, 23, 59, 59)

        curtime = datetime.utcnow()
        endtime = curtime + timedelta(days=number_of_days)

        # Initialize Moon, Sun, and observer
        moon = ephem.Moon()
        sun = ephem.Sun()
        observer = ephem.Observer()

        observer.lat = observer_latitude
        observer.lon = observer_longitude
        observer.elevation = 0
        observer.pressure = 0

        eclipse_times = []

        while curtime <= endtime:
            observer.date = curtime

            moon.compute(observer)
            sun.compute(observer)

            sep = abs(float(ephem.separation(moon, sun)) / 0.01745329252 - 180)

            # Eclipse occurs if the separation is less than 0.9°
            if sep < 0.9:
                eclipse_times.append(curtime.strftime('%Y/%m/%d %H:%M:%S'))
                # An eclipse cannot happen more than once in a day, so skip 24 hours when an eclipse is found
                curtime += timedelta(days=1)
            else:
                curtime += timedelta(minutes=5)

        return JsonResponse({'eclipse_times': eclipse_times, 'end_time': endtime})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


def solar_eclipse_prediction(request, latitude, longitude, number_of_days):
    # curtime = datetime(2024, 1, 1, 0, 0, 0)        # start time
    # endtime = datetime(2030, 12, 31, 23, 59, 59)   # end time

    curtime = datetime.utcnow()
    endtime = curtime + timedelta(days=number_of_days)


    moon = ephem.Moon()
    sun = ephem.Sun()
    observer = ephem.Observer()
    observer.lat, observer.lon = str(latitude), str(longitude)
    observer.elevation = 0
    observer.pressure = 0

    eclipses = []

    while curtime <= endtime:
        observer.date = curtime.strftime('%Y/%m/%d %H:%M:%S')

        moon.compute(observer)
        sun.compute(observer)

        sep = abs((float(ephem.separation(moon, sun)) / 0.01745329252))

        # A solar eclipse happens if Sun-Earth-Moon alignment is <1.5976°
        if sep < 1.59754941:
            eclipses.append(curtime.strftime('%Y/%m/%d %H:%M:%S'))
            # Skip 24 hours when an eclipse is found
            curtime += timedelta(days=1)
        else:
            curtime += timedelta(minutes=5)

    return JsonResponse({'eclipse_times': eclipses})


class EventList(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer


class EventDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer


from skyfield.api import load, Topos
from skyfield.almanac import find_discrete, risings_and_settings, oppositions_conjunctions, moon_phases
import ephem

from datetime import timedelta
def get_best_observation_times_and_lunar_eclipse(request, latitude, longitude, planet_names, number_of_days, preferred_hour):
    try:
        planet_names_list = planet_names.split(',')

        observation_times = {}
        for planet_name in planet_names_list:
            if planet_name == "mars":
                planet_name = "MARS BARYCENTER"
            elif planet_name == "jupiter":
                planet_name = "JUPITER BARYCENTER"
            elif planet_name == "saturn":
                planet_name = "SATURN BARYCENTER"
            elif planet_name == "uranus":
                planet_name = "URANUS BARYCENTER"
            elif planet_name == "neptune":
                planet_name = "NEPTUNE BARYCENTER"
            elif planet_name == "pluto":
                planet_name = "PLUTO BARYCENTER"

            planet_response = get_best_observation_times(request, latitude, longitude, planet_name, number_of_days)
            planet_data = json.loads(planet_response.content)
            observation_times[planet_name] = planet_data['observation_times']

        lunar_response = lunar_eclipse_prediction(request, latitude, longitude, number_of_days)
        lunar_data = json.loads(lunar_response.content)
        lunar_eclipse_times = lunar_data['eclipse_times']

        combined_times = []
        event_details = []
        planet_names_keys = list(observation_times.keys())

        for i in range(len(planet_names_keys)):
            for j in range(i + 1, len(planet_names_keys)):
                for time1 in observation_times[planet_names_keys[i]]:
                    for time2 in observation_times[planet_names_keys[j]]:
                        time1_datetime = datetime.strptime(time1, '%Y-%m-%d %H:%M:%S')
                        time2_datetime = datetime.strptime(time2, '%Y-%m-%d %H:%M:%S')
                        if abs((time1_datetime - time2_datetime).total_seconds()) < 7200:
                            combined_times.append(time1)
                            name_of_planet_i = planet_names_keys[i].replace(" BARYCENTER", "").lower()
                            name_of_planet_j = planet_names_keys[j].replace(" BARYCENTER", "").lower()
                            event_details.append(f"Observing {name_of_planet_i} and {name_of_planet_j}")
            for time1 in observation_times[planet_names_keys[i]]:
                for eclipse_time in lunar_eclipse_times:
                    target_datetime = datetime.strptime(time1, '%Y-%m-%d %H:%M:%S')
                    eclipse_datetime = datetime.strptime(eclipse_time, '%Y/%m/%d %H:%M:%S')
                    if abs((target_datetime - eclipse_datetime).total_seconds()) < 7200:
                        combined_times.append(time1)
                        event_details.append("Lunar eclipse")

        if combined_times:
            unique_combined_times = list(set(combined_times))

            unique_combined_times.sort()

            preferred_hour_time = datetime.strptime(preferred_hour, '%H:%M:%S').time()

            preferred_event = None
            min_time_difference = float('inf')
            for time in unique_combined_times:
                time_datetime = datetime.strptime(time, '%Y-%m-%d %H:%M:%S').time()
                time_difference = abs((datetime.combine(datetime.today(), time_datetime) - datetime.combine(datetime.today(), preferred_hour_time)).total_seconds())
                if time_difference < min_time_difference:
                    min_time_difference = time_difference
                    preferred_event = time

            events = []
            added_descriptions = set()
            for time in unique_combined_times:
                title = "Combined Observation Event"
                start_time = datetime.strptime(time, '%Y-%m-%d %H:%M:%S')
                index = combined_times.index(time)
                description = event_details[index]
                if time == preferred_event:
                    description += " (Preferred event option)"
                if description not in added_descriptions:
                    events.append({'title': title, 'description': description, 'start_time': start_time})
                    added_descriptions.add(description)
                if len(events) >= 3:
                    break

            if len(events) < 3:
                for eclipse_time in lunar_eclipse_times:
                    eclipse_datetime = datetime.strptime(eclipse_time, '%Y/%m/%d %H:%M:%S')
                    description = "Lunar eclipse"
                    if description not in added_descriptions:
                        events.append({'title': "Observation Event", 'description': description, 'start_time': eclipse_datetime})
                        added_descriptions.add(description)
                    if len(events) >= 3:
                        break

            return JsonResponse({'events': events[:3], 'observation_times': observation_times, 'lunar_eclipse_times': lunar_eclipse_times, 'combined_times': unique_combined_times})
        else:
            random_events = []
            for i in range(3):
                for planet in planet_names_keys:
                    if observation_times[planet]:
                        random_time = observation_times[planet][i % len(observation_times[planet])]
                        random_events.append({'title': "Observation Event", 'description': f"Observing {planet.replace(' BARYCENTER', '').lower()}", 'start_time': datetime.strptime(random_time, '%Y-%m-%d %H:%M:%S')})

            return JsonResponse({'events': random_events[:3], 'observation_times': observation_times, 'lunar_eclipse_times': lunar_eclipse_times, 'combined_times': []})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

def get_best_observation_times_and_solar_eclipse(request, latitude, longitude, planet_names, number_of_days, preferred_hour):
    try:
        planet_names_list = planet_names.split(',')

        observation_times = {}
        for planet_name in planet_names_list:
            if planet_name == "mars":
                planet_name = "MARS BARYCENTER"
            elif planet_name == "jupiter":
                planet_name = "JUPITER BARYCENTER"
            elif planet_name == "saturn":
                planet_name = "SATURN BARYCENTER"
            elif planet_name == "uranus":
                planet_name = "URANUS BARYCENTER"
            elif planet_name == "neptune":
                planet_name = "NEPTUNE BARYCENTER"
            elif planet_name == "pluto":
                planet_name = "PLUTO BARYCENTER"

            planet_response = get_best_observation_times(request, latitude, longitude, planet_name, number_of_days)
            planet_data = json.loads(planet_response.content)
            observation_times[planet_name] = planet_data['observation_times']

        solar_response = solar_eclipse_prediction(request, latitude, longitude, number_of_days)
        solar_data = json.loads(solar_response.content)
        solar_eclipse_times = solar_data['eclipse_times']

        combined_times = []
        event_details = []
        planet_names_keys = list(observation_times.keys())

        for i in range(len(planet_names_keys)):
            for j in range(i + 1, len(planet_names_keys)):
                for time1 in observation_times[planet_names_keys[i]]:
                    for time2 in observation_times[planet_names_keys[j]]:
                        time1_datetime = datetime.strptime(time1, '%Y-%m-%d %H:%M:%S')
                        time2_datetime = datetime.strptime(time2, '%Y-%m-%d %H:%M:%S')
                        if abs((time1_datetime - time2_datetime).total_seconds()) < 7200:  # Close enough if within 2 hours
                            combined_times.append(time1)
                            name_of_planet_i = planet_names_keys[i].replace(" BARYCENTER", "").lower()
                            name_of_planet_j = planet_names_keys[j].replace(" BARYCENTER", "").lower()
                            event_details.append(f"Observing {name_of_planet_i} and {name_of_planet_j}")
            for time1 in observation_times[planet_names_keys[i]]:
                for eclipse_time in solar_eclipse_times:
                    target_datetime = datetime.strptime(time1, '%Y-%m-%d %H:%M:%S')
                    eclipse_datetime = datetime.strptime(eclipse_time, '%Y/%m/%d %H:%M:%S')
                    if abs((target_datetime - eclipse_datetime).total_seconds()) < 7200:  # Close enough if within 2 hours
                        combined_times.append(time1)
                        event_details.append("Solar eclipse")

        if combined_times:
            unique_combined_times = list(set(combined_times))

            unique_combined_times.sort()

            preferred_hour_time = datetime.strptime(preferred_hour, '%H:%M:%S').time()

            preferred_event = None
            min_time_difference = float('inf')
            for time in unique_combined_times:
                time_datetime = datetime.strptime(time, '%Y-%m-%d %H:%M:%S').time()
                time_difference = abs((datetime.combine(datetime.today(), time_datetime) - datetime.combine(datetime.today(), preferred_hour_time)).total_seconds())
                if time_difference < min_time_difference:
                    min_time_difference = time_difference
                    preferred_event = time

            events = []
            added_descriptions = set()
            for time in unique_combined_times:
                title = "Combined Observation Event"
                start_time = datetime.strptime(time, '%Y-%m-%d %H:%M:%S')
                index = combined_times.index(time)
                description = event_details[index]
                if time == preferred_event:
                    description += " (Preferred event option)"
                if description not in added_descriptions:
                    events.append({'title': title, 'description': description, 'start_time': start_time})
                    added_descriptions.add(description)
                if len(events) >= 3:
                    break

            if len(events) < 3:
                for eclipse_time in solar_eclipse_times:
                    eclipse_datetime = datetime.strptime(eclipse_time, '%Y/%m/%d %H:%M:%S')
                    description = "Solar eclipse"
                    if description not in added_descriptions:
                        events.append({'title': "Observation Event", 'description': description, 'start_time': eclipse_datetime})
                        added_descriptions.add(description)
                    if len(events) >= 3:
                        break

            return JsonResponse({'events': events[:3], 'observation_times': observation_times, 'solar_eclipse_times': solar_eclipse_times, 'combined_times': unique_combined_times})
        else:
            random_events = []
            for i in range(3):
                for planet in planet_names_keys:
                    if observation_times[planet]:
                        random_time = observation_times[planet][i % len(observation_times[planet])]
                        random_events.append({'title': "Observation Event", 'description': f"Observing {planet.replace(' BARYCENTER', '').lower()}", 'start_time': datetime.strptime(random_time, '%Y-%m-%d %H:%M:%S')})
            return JsonResponse({'events': random_events[:3], 'observation_times': observation_times, 'solar_eclipse_times': solar_eclipse_times, 'combined_times': []})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


def get_lunar_solar_eclipse(request, latitude, longitude, number_of_days, preferred_hour):
    try:
        lunar_response = lunar_eclipse_prediction(request, latitude, longitude, number_of_days)
        lunar_data = json.loads(lunar_response.content)
        lunar_eclipse_times = lunar_data['eclipse_times']

        solar_response = solar_eclipse_prediction(request, latitude, longitude, number_of_days)
        solar_data = json.loads(solar_response.content)
        solar_eclipse_times = [item['date'] for item in solar_data]

        preferred_hour_time = datetime.strptime(preferred_hour, '%H:%M:%S').time()

        def find_closest_eclipses(eclipse_times, num_eclipses):
            closest_eclipses = []
            for eclipse_time in eclipse_times:
                eclipse_datetime = datetime.strptime(eclipse_time, '%Y/%m/%d %H:%M:%S')
                eclipse_time_only = eclipse_datetime.time()
                time_difference = abs((datetime.combine(datetime.today(), eclipse_time_only) - datetime.combine(datetime.today(), preferred_hour_time)).total_seconds())
                closest_eclipses.append((eclipse_datetime, time_difference))

            closest_eclipses.sort(key=lambda x: x[1])
            return [eclipse[0] for eclipse in closest_eclipses[:num_eclipses]]

        closest_lunar_eclipse = find_closest_eclipses(lunar_eclipse_times, 1)

        closest_solar_eclipses = find_closest_eclipses(solar_eclipse_times, 2)

        events = []
        if closest_lunar_eclipse:
            events.append({
                'title': 'Lunar Eclipse Event',
                'description': 'Lunar eclipse',
                'start_time': closest_lunar_eclipse[0]
            })
        for solar_eclipse in closest_solar_eclipses:
            events.append({
                'title': 'Solar Eclipse Event',
                'description': 'Solar eclipse',
                'start_time': solar_eclipse
            })

        return JsonResponse({'events': events})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

def  get_lunar_eclipses_events(request, latitude, longitude, number_of_days, preferred_hour):
    try:
        lunar_response = lunar_eclipse_prediction(request, latitude, longitude, number_of_days)
        lunar_data = json.loads(lunar_response.content)
        lunar_eclipse_times = lunar_data['eclipse_times']

        preferred_hour_time = datetime.strptime(preferred_hour, '%H:%M:%S')

        upcoming_lunar_eclipses = []
        for eclipse_time_str in lunar_eclipse_times:
            eclipse_datetime = datetime.strptime(eclipse_time_str, '%Y/%m/%d %H:%M:%S')
            time_difference = abs((eclipse_datetime - preferred_hour_time).total_seconds())
            if time_difference < 7200:
                upcoming_lunar_eclipses.append({'title': "Lunar Eclipse", 'start_time': eclipse_datetime, 'description': 'Observing a lunar eclipse'})

        upcoming_lunar_eclipses.sort(key=lambda x: x['start_time'])

        events = upcoming_lunar_eclipses[:3]

        if not events and lunar_eclipse_times:
            upcoming_events = [{'title': "Lunar Eclipse", 'start_time': datetime.strptime(time, '%Y/%m/%d %H:%M:%S'), 'description': 'Observing a lunar eclipse'} for time in lunar_eclipse_times[:3]]
            return JsonResponse({'events': upcoming_events})
        else:
            return JsonResponse({'events': events})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


def get_solar_eclipses_events(request, latitude, longitude, number_of_days, preferred_hour):
    try:
        solar_response = solar_eclipse_prediction(request, latitude, longitude, number_of_days)
        solar_data = json.loads(solar_response.content)
        solar_eclipse_times = solar_data['eclipse_times']

        preferred_hour_time = datetime.strptime(preferred_hour, '%H:%M:%S')

        upcoming_solar_eclipses = []
        for eclipse_time_str in solar_eclipse_times:
            eclipse_datetime = datetime.strptime(eclipse_time_str, '%Y/%m/%d %H:%M:%S')
            time_difference = abs((eclipse_datetime - preferred_hour_time).total_seconds())
            if time_difference < 7200:
                upcoming_solar_eclipses.append({'title': "Solar Eclipse", 'start_time': eclipse_datetime, 'description': 'Observing a solar eclipse'})

        upcoming_solar_eclipses.sort(key=lambda x: x['start_time'])

        events = upcoming_solar_eclipses[:3]

        if not events and solar_eclipse_times:
            upcoming_events = [{'title': "Solar Eclipse", 'start_time': datetime.strptime(time, '%Y/%m/%d %H:%M:%S'), 'description': 'Observing a solar eclipse'} for time in solar_eclipse_times[:3]]
            return JsonResponse({'events': upcoming_events})
        else:
            return JsonResponse({'events': events})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

def get_planets_observation_times(request, latitude, longitude, planet_names, number_of_days, preferred_hour):
    try:
        planet_names_list = planet_names.split(',')

        observation_times = {}

        for planet_name in planet_names_list:
            if planet_name == "mars":
                planet_name = "MARS BARYCENTER"
            elif planet_name == "jupiter":
                planet_name = "JUPITER BARYCENTER"
            elif planet_name == "saturn":
                planet_name = "SATURN BARYCENTER"
            elif planet_name == "uranus":
                planet_name = "URANUS BARYCENTER"
            elif planet_name == "neptune":
                planet_name = "NEPTUNE BARYCENTER"
            elif planet_name == "pluto":
                planet_name = "PLUTO BARYCENTER"

            planet_response = get_best_observation_times(request, latitude, longitude, planet_name, number_of_days)
            planet_data = json.loads(planet_response.content)
            observation_times[planet_name] = planet_data['observation_times']

        best_events = []

        for planet_name, times in observation_times.items():
            preferred_hour_time = datetime.strptime(preferred_hour, '%H:%M:%S').time()

            planet_events = []

            for time_str in times:
                time_datetime = datetime.strptime(time_str, '%Y-%m-%d %H:%M:%S').time()


                time_difference = abs(datetime.combine(datetime.today(), time_datetime) - datetime.combine(datetime.today(), preferred_hour_time)).total_seconds()


                if time_difference < 7200:
                    planet_events.append({'title': f"{planet_name.replace(' BARYCENTER', '').capitalize()} Observation", 'start_time': time_str, 'description': 'Observing a planet'})

            while len(planet_events) < 3:
                random_time = random.choice(times)
                planet_events.append({'title': f"{planet_name.replace(' BARYCENTER', '').capitalize()} Observation", 'start_time': random_time, 'description': 'Observing a planet'})

            best_events.extend(planet_events[:3])

        unique_events = []
        seen_times = set()
        for event in best_events:
            start_time = event['start_time']
            if start_time not in seen_times:
                unique_events.append(event)
                seen_times.add(start_time)

        return JsonResponse({'events': unique_events})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

from datetime import datetime
import random

def get_best_times_and_lunar_solar_eclipse(request, latitude, longitude, planet_names, number_of_days, preferred_hour):
    try:
        planet_names_list = planet_names.split(',')

        observation_times = {}

        for planet_name in planet_names_list:
            if planet_name == "mars":
                planet_name = "MARS BARYCENTER"
            elif planet_name == "jupiter":
                planet_name = "JUPITER BARYCENTER"
            elif planet_name == "saturn":
                planet_name = "SATURN BARYCENTER"
            elif planet_name == "uranus":
                planet_name = "URANUS BARYCENTER"
            elif planet_name == "neptune":
                planet_name = "NEPTUNE BARYCENTER"
            elif planet_name == "pluto":
                planet_name = "PLUTO BARYCENTER"

            planet_response = get_best_observation_times(request, latitude, longitude, planet_name, number_of_days)
            planet_data = json.loads(planet_response.content)
            observation_times[planet_name] = planet_data['observation_times']

        lunar_response = lunar_eclipse_prediction(request, latitude, longitude, number_of_days)
        lunar_data = json.loads(lunar_response.content)
        lunar_eclipse_times = lunar_data['eclipse_times']

        solar_response = solar_eclipse_prediction(request, latitude, longitude, number_of_days)
        solar_data = json.loads(solar_response.content)
        solar_eclipse_times = solar_data['eclipse_times']

        preferred_hour_time = datetime.strptime(preferred_hour, '%H:%M:%S').time()

        events = []

        for planet_name, times in observation_times.items():
            best_time = None
            for time_str in times:
                time_datetime = datetime.strptime(time_str, '%Y-%m-%d %H:%M:%S').time()
                time_difference = abs(datetime.combine(datetime.today(), time_datetime) - datetime.combine(datetime.today(), preferred_hour_time)).total_seconds()
                if time_difference < 7200:  # Close enough if within 2 hours
                    best_time = {'title': f"{planet_name.replace(' BARYCENTER', '').capitalize()} Best Time", 'start_time': time_str, 'description': 'Observing a planet'}
                    break
            if best_time:
                events.append(best_time)

        lunar_event = None
        min_lunar_time_difference = float('inf')
        for eclipse_time_str in lunar_eclipse_times:
            eclipse_datetime = datetime.strptime(eclipse_time_str, '%Y/%m/%d %H:%M:%S')
            time_difference = abs((eclipse_datetime - datetime.combine(datetime.today(), preferred_hour_time)).total_seconds())
            if time_difference < min_lunar_time_difference:  # Choose the closest one
                lunar_event = {'title': "Lunar Eclipse", 'start_time': eclipse_time_str, 'description': 'Observing a lunar eclipse'}
                min_lunar_time_difference = time_difference

        if lunar_event:
            events.append(lunar_event)

        solar_event = None
        min_solar_time_difference = float('inf')
        for eclipse_time_str in solar_eclipse_times:
            eclipse_datetime = datetime.strptime(eclipse_time_str, '%Y/%m/%d %H:%M:%S')
            time_difference = abs((eclipse_datetime - datetime.combine(datetime.today(), preferred_hour_time)).total_seconds())
            if time_difference < min_solar_time_difference:  # Choose the closest one
                solar_event = {'title': "Solar Eclipse", 'start_time': eclipse_time_str, 'description': 'Observing a solar eclipse'}
                min_solar_time_difference = time_difference

        if solar_event:
            events.append(solar_event)

        while len(events) < 3:
            random_planet = random.choice(list(observation_times.keys()))
            random_time = random.choice(observation_times[random_planet])
            events.append({'title': f"{random_planet.replace(' BARYCENTER', '').capitalize()} Best Time", 'start_time': random_time, 'description': 'Observing a planet'})

        return JsonResponse({'events': events})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.conf import settings


def send_email(to_email, subject, body):
    sender_email = settings.EMAIL_HOST_USER
    password = settings.EMAIL_HOST_PASSWORD

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, password)

        server.sendmail(sender_email, to_email, msg.as_string())
        print("Email sent successfully!")
    except Exception as e:
        print(f"Error: {e}")
        raise e
    finally:
        server.quit()


@csrf_exempt
def send_invitation_email(to_email, event_details):
    subject = 'You’re invited to an Astronomy Event!'
    message = f"Hi there,\n\nWe’re happy to invite you to an upcoming event that we think you’ll love!\n\n" \
              f"Event: {event_details.get('title')}\n" \
              f"Details: {event_details.get('description')}\n" \
              f"Starting at: {event_details.get('start_time')}\n\n" \
              "We hope you can join us for what promises to be a fantastic time.\n\n" \
              "Please accept or decline the invitation in your Polaris account.\n\n" \
              "Cheers,\nThe Polaris Team 🌠"

    send_email(to_email, subject, message)

    notification_description = f"You were invited to an event! The event is {event_details.get('title')} " \
                                f"in {event_details.get('start_time')}."
    notification_purpose = f"event;{event_details.get('id')}"
    Notification.objects.create(
        description=notification_description,
        purpose=notification_purpose,
        notification_sender_id=event_details.get('sender_user_id'),
        notification_receiver_id=event_details.get('receiver_user_id')
    )


@csrf_exempt
def send_invitation(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            to_email = data.get('email')
            event_details = data.get('event_details')
            print(to_email, event_details)
            send_invitation_email(to_email, event_details)
            return JsonResponse({'status': 'success', 'message': 'Invitation sent successfully.'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)

@csrf_exempt
def send_forgot_password_email(to_email, reset_link):
    subject = 'Reset Your Password'
    message = f"Hi there, click the link below to reset your password:\n{reset_link}\nCheers,\nThe Polaris Team 🌠"

    send_email(to_email, subject, message)

@csrf_exempt
def send_forgot_password(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            to_email = data.get('email')
            user = User.objects.get(email=to_email)
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_link = f"http://127.0.0.1:3000/reset-password/{uid}/{token}/"
            send_forgot_password_email(to_email, reset_link)
            return JsonResponse({'status': 'success', 'message': 'Email sent successfully.'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)


from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.hashers import make_password


@csrf_exempt
def reset_password(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            uid = urlsafe_base64_decode(data.get('uid')).decode()
            token = data.get('token')
            password = data.get('password')

            user = User.objects.get(id=uid)
            if default_token_generator.check_token(user, token):
                user.password = make_password(password)
                user.save()
                return JsonResponse({'status': 'success', 'message': 'Password reset successfully.'})
            else:
                return JsonResponse({'status': 'error', 'message': 'Invalid token.'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)


def get_equipment_list(request, observation_type):
    equipment_list = []

    if observation_type == "planet":
        equipment_list = Equipment.objects.filter(name__in=[
            "Telescope", "Eyepieces", "Barlow lens", "Mount", "Finder scope",
            "Filters", "Computerized telescope", "GoTo mount", "Observing chair", "Red flashlight"
        ])
    elif observation_type == "solar_eclipse":
        equipment_list = Equipment.objects.filter(name__in=[
            "Telescope", "Solar filter", "Camera", "Tripod", "Filters",
            "Observing chair", "Red flashlight"
        ])
    elif observation_type == "lunar_eclipse":
        equipment_list = Equipment.objects.filter(name__in=[
            "Telescope", "Binoculars", "Camera", "Tripod", "Mount",
            "Filters", "Observing chair", "Red flashlight"
        ])
    elif observation_type == "star_observation":
        equipment_list = Equipment.objects.filter(name__in=[
            "Binoculars", "Telescope", "Tripod", "Mount", "Finder scope",
            "Planisphere", "Star chart", "Observing logbook", "Meteorological station",
            "Red flashlight", "Observing chair"
        ])
    equipment_data = list(equipment_list.values())

    return JsonResponse({'equipment': equipment_data})


class PlanetList(generics.ListCreateAPIView):
    queryset = Planet.objects.all()
    serializer_class = PlanetSerializer

class ConstellationList(generics.ListCreateAPIView):
    queryset = Constellation.objects.all()
    serializer_class = ConstellationSerializer

class MessageList(generics.ListCreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer


class ChatList(generics.ListCreateAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer

class MessageDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

class ChatDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer