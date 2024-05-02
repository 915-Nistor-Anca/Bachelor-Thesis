from rest_framework import serializers

from polaris.models import User, Observation, Equipment


class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = ['name']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')

class ObservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Observation
        fields = ['user', 'targets', 'location', 'observation_time', 'sky_conditions', 'equipment', 'personal_observations']