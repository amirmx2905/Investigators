from rest_framework import serializers
from investigators.models import TipoEvento

class TipoEventoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoEvento
        fields = '__all__'