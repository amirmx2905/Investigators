from rest_framework import serializers
from investigators.models import Investigador

class InvestigadorSerializer(serializers.ModelSerializer):
    area_nombre = serializers.SerializerMethodField()
    especialidad_nombre = serializers.SerializerMethodField()
    nivel_snii_nombre = serializers.SerializerMethodField()
    
    class Meta:
        model = Investigador
        fields = [
            'id', 
            'nombre',    
            'correo', 
            'celular',
            'area',
            'area_nombre', 
            'especialidad',
            'especialidad_nombre',
            'nivel_edu',
            'nivel_snii',
            'nivel_snii_nombre',
            'fecha_asignacion_snii',
            'activo'
        ]
    
    def get_area_nombre(self, obj):
        return obj.area.nombre if obj.area else None
    
    def get_especialidad_nombre(self, obj):
        return obj.especialidad.nombre_especialidad if obj.especialidad else None
    
    def get_nivel_snii_nombre(self, obj):
        return obj.nivel_snii.nivel if obj.nivel_snii else None