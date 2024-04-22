from rest_framework import serializers

from polaris.models import User, Observation


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')

class ObservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Observation
        fields = ['id', 'user', 'targets', 'location', 'observation_time', 'sky_conditions', 'equipment', 'personal_observations']