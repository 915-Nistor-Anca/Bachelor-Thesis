from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass

class Equipment(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class SkyCondition(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Observation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    targets = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    observation_time = models.DateTimeField()
    sky_conditions = models.ForeignKey(SkyCondition, on_delete=models.CASCADE)
    equipment = models.ManyToManyField(Equipment)
    personal_observations = models.CharField(max_length=100)
