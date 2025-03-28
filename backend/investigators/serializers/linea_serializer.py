from rest_framework import serializers
from investigators.models import Linea

class LineaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Linea
        fields = '__all__'