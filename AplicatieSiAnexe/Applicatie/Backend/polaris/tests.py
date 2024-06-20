from datetime import timezone

from django.test import TestCase
from polaris.models import User, UserProfile, Equipment, SkyCondition, Star, Observation


class PolarisAppTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
        self.another_user = User.objects.create_user(username='anotheruser', email='another@example.com', password='anotherpassword')
        self.user_profile = UserProfile.objects.create(user=self.user)
        self.equipment = Equipment.objects.create(name='Telescope')
        self.sky_condition = SkyCondition.objects.create(name='Clear')
        self.star = Star.objects.create(
            proper_name='Sirius',
            designation='Alpha Canis Majoris',
            hip='32349',
            bayer='α CMa',
            origin='Ancient Greek',
            ethnic_cultural_group='',
            reference='NASA',
            additional_info='Brightest star in the night sky',
            approval_status='Approved',
            approval_date='2021-01-01'
        )
        self.observation = Observation.objects.create(
            user=self.user,
            targets='Moon',
            location="34.0522;-118.2437",
            observation_time="2024-05-03T21:15:00Z",
            sky_conditions=self.sky_condition,
            personal_observations='Clear view of the moon',
            privacy=1
        )
        self.observation.equipment.add(self.equipment)

    def tearDown(self):
        self.user.delete()
        self.another_user.delete()
        self.user_profile.delete()
        self.equipment.delete()
        self.sky_condition.delete()
        self.star.delete()
        self.observation.delete()

    def test_added_user(self):
        added_user = User.objects.get(username='testuser')
        self.assertEqual(added_user.email, 'test@example.com')

    def test_follow_user(self):
        self.user_profile.follow(self.another_user)
        self.assertTrue(self.user_profile.is_following(self.another_user))
        self.assertIn(self.another_user, self.user_profile.following.all())

    # def test_unfollow_user(self):
    #     self.user_profile.follow(self.another_user)
    #     self.user_profile.unfollow(self.another_user)
    #     self.assertFalse(self.user_profile.is_following(self.another_user))
    #     self.assertNotIn(self.another_user, self.user_profile.following.all())

    def test_equipment_creation(self):
        equipment = Equipment.objects.get(name='Telescope')
        self.assertEqual(equipment.name, 'Telescope')

    def test_sky_condition_creation(self):
        sky_condition = SkyCondition.objects.get(name='Clear')
        self.assertEqual(sky_condition.name, 'Clear')

    def test_observation_creation(self):
        observation = Observation.objects.get(user=self.user)
        self.assertEqual(observation.targets, 'Moon')
        self.assertEqual(observation.location, "34.0522;-118.2437")
        self.assertEqual(observation.sky_conditions, self.sky_condition)
        self.assertIn(self.equipment, observation.equipment.all())

    def test_star_creation(self):
        star = Star.objects.get(proper_name='Sirius')
        self.assertEqual(star.designation, 'Alpha Canis Majoris')
        self.assertEqual(star.hip, '32349')
        self.assertEqual(star.bayer, 'α CMa')

from django.test import TestCase, Client
from django.urls import reverse
class InvitationTestCase(TestCase):
    def setUp(self):
        self.client = Client()

    def test_send_invitation(self):
        url = reverse('send_invitation')
        data = {
            'email': 'test@example.com',
            'event_title': 'Test Event',
            'event_description': 'This is a test event.',
            'event_time': '2024-06-01T12:00:00Z',
        }
        response = self.client.post(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 500)
        self.assertIn('message', response.json())


from django.test import TestCase
from django.urls import reverse
import json

class RegisterViewTest(TestCase):
    def test_register_success(self):
        url = reverse('register')
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpassword'
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json(), {'message': 'User registered successfully!'})

    def test_register_existing_username(self):
        url = reverse('register')
        data = {
            'username': 'existinguser',
            'email': 'existing@example.com',
            'password': 'testpassword'
        }
        self.client.post(url, json.dumps(data), content_type='application/json')

        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'error': 'There is already a user with this username!'})

    def test_register_invalid_method(self):
        url = reverse('register')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.json(), {'error': 'Method not allowed.'})


from django.test import TestCase
from polaris.models import User
from django.urls import reverse
import json


class LoginTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
    def test_login_success(self):
        url = reverse('login')
        data = {'username': 'testuser', 'password': 'testpassword'}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'message': 'Login successful', 'user_id': self.user.id, 'username': 'testuser'})
    def test_login_invalid_credentials(self):
        url = reverse('login')
        data = {'username': 'testuser', 'password': 'invalidpassword'}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json(), {'error': 'Invalid username or password'})

    def test_login_missing_credentials(self):
        url = reverse('login')
        data = {'username': 'testuser'}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'error': 'Email and password are required'})


from django.test import TestCase, Client
from django.urls import reverse
import json
from django.test import TestCase
from django.urls import reverse
from datetime import datetime, timedelta
import json

class LunarEclipsePredictionTestCase(TestCase):
    def test_lunar_eclipse_prediction(self):
        latitude = '51.5074'
        longitude = '0.1278'
        number_of_days = 365

        url = reverse('lunar_eclipse_prediction', args=(latitude, longitude, number_of_days))
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)

        data = json.loads(response.content)

        self.assertIn('eclipse_times', data)
        self.assertIn('end_time', data)

        self.assertTrue(isinstance(data['eclipse_times'], list))
        self.assertTrue(data['eclipse_times'])

        end_time_str = data['end_time']
        try:
            end_time = datetime.strptime(end_time_str, '%Y-%m-%dT%H:%M:%S.%fZ')
        except ValueError:
            end_time = None


class SolarEclipsePredictionTestCase(TestCase):
    def test_solar_eclipse_prediction(self):
        latitude = 37.7749
        longitude = -122.4194
        number_of_days = 365

        url = reverse('solar_eclipse_prediction', args=(latitude, longitude, number_of_days))

        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)

        self.assertIn('eclipse_times', response.json())

        eclipse_times = response.json()['eclipse_times']
        self.assertTrue(eclipse_times)

        # Optional: Print the eclipse times for debugging
        print("Solar eclipse times:", eclipse_times)
        eclipse_datetimes = [datetime.strptime(time, '%Y/%m/%d %H:%M:%S') for time in eclipse_times]

        print("Solar eclipse datetimes:", eclipse_datetimes)

        endtime = datetime.utcnow() + timedelta(days=number_of_days)
        for eclipse_datetime in eclipse_datetimes:
            self.assertLessEqual(eclipse_datetime, endtime)


