from rest_framework import serializers
from investigators.models import TipoEstudiante

class TipoEstudianteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoEstudiante
        fields = '__all__'