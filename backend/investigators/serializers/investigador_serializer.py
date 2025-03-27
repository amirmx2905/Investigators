from rest_framework import serializers
from investigators.models import Investigador

class InvestigadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Investigador
        fields = [
            'id', 
            'nombre',    
            'correo', 
            'celular',
            'area', 
            'especialidad',
            'nivel_edu',
            'nivel_snii',
            'fecha_asignacion_snii',
            'activo'
        ]