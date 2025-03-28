from rest_framework import serializers
from investigators.models import NivelEducacion

class NivelEducacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = NivelEducacion
        fields = '__all__'