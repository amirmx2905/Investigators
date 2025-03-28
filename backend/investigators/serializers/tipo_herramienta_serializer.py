from rest_framework import serializers
from investigators.models import TipoHerramienta

class TipoHerramientaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoHerramienta
        fields = '__all__'