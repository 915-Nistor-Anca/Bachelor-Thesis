from django.contrib.auth.models import AbstractUser
from django.db import models
from rest_framework.fields import DictField

from Backend.backend.models import User

class User(AbstractUser):
    pass

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    following = models.ManyToManyField(User, related_name='followers')

    def follow(self, user):
        if user != self.user:
            self.following.add(user)

    def unfollow(self, user):
        self.following.remove(user)

    def is_following(self, user):
        return self.following.filter(pk=user.pk).exists()


    def __str__(self):
        return self.user.username

class Equipment(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class SkyCondition(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    organizer = models.ForeignKey(User, related_name='organized_events', on_delete=models.CASCADE)
    participants = models.ManyToManyField(User, related_name='events_participating', blank=True)
    location_latitude = models.FloatField()
    location_longitude = models.FloatField()
    start_time = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Observation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    targets = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    observation_time = models.DateTimeField()
    sky_conditions = models.ForeignKey(SkyCondition, on_delete=models.CASCADE)
    equipment = models.ManyToManyField(Equipment)
    personal_observations = models.CharField(max_length=300)
    privacy = models.IntegerField(default=1)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, null=True, blank=True)

class Constellation(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=100)


class Star(models.Model):
    proper_name = models.CharField(max_length=255)
    designation = models.CharField(max_length=255)
    hip = models.CharField(max_length=255)
    bayer = models.CharField(max_length=255)
    origin = models.CharField(max_length=255)
    ethnic_cultural_group = models.CharField(max_length=255, blank=True)
    reference = models.CharField(max_length=255)
    additional_info = models.CharField(max_length=255)
    approval_status = models.CharField(max_length=255)
    approval_date = models.CharField(max_length=255)
    constellation = models.ForeignKey(Constellation, on_delete=models.CASCADE, related_name='constellation_name', null=True, blank=True)

    def __str__(self):
        return self.proper_name


class Image(models.Model):
    title = models.CharField(max_length=100)
    image = models.ImageField(upload_to='images/')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.title

class Notification(models.Model):
    notification_sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_notifications', null=True, blank=True)
    notification_receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_notifications', null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    purpose = models.TextField(blank=True, null=True)
    read = models.IntegerField(default=0)


    def __str__(self):
        return self.description


class Planet(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=100)

    def __str__(self):
        return self.description


class Chat(models.Model):
    event = models.OneToOneField(Event, on_delete=models.CASCADE)


class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(blank=True, null=True)


from django.db.models.signals import post_save
from django.dispatch import receiver


@receiver(post_save, sender=Event)
def create_chat_on_event_creation(sender, instance, created, **kwargs):
    if created:
        Chat.objects.create(event=instance)


post_save.connect(create_chat_on_event_creation, sender=Event)