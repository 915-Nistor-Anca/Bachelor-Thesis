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

    def __str__(self):
        return self.proper_name
