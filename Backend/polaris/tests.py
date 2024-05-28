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
        self.assertEqual(response.status_code, 200)
        self.assertIn('message', response.json())