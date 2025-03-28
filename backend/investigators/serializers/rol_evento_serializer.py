from rest_framework import serializers
from investigators.models import RolEvento

class RolEventoSerializer(serializers.ModelSerializer):
    class Meta:
        model = RolEvento
        fields = '__all__'