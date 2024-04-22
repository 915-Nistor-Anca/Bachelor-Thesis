from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass

class Observation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    targets = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    observation_time = models.DateTimeField()
    sky_conditions = models.CharField(max_length=100)
    equipment = models.CharField(max_length=100)
    personal_observations = models.TextField()
