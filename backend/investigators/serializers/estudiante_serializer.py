from rest_framework import serializers
from investigators.models import Estudiante

class EstudianteSerializer(serializers.ModelSerializer):
    tipo_estudiante_nombre = serializers.SerializerMethodField()
    carrera_nombre = serializers.SerializerMethodField()
    investigador_nombre = serializers.SerializerMethodField()
    area_nombre = serializers.SerializerMethodField()
    
    class Meta:
        model = Estudiante
        fields = [
            'id',
            'nombre',
            'correo',
            'celular',
            'tipo_estudiante',
            'tipo_estudiante_nombre',
            'carrera',
            'carrera_nombre',
            'investigador',
            'investigador_nombre',
            'area',
            'area_nombre',
            'escuela',
            'fecha_inicio',
            'fecha_termino',
            'activo',
            'estatus',
        ]
    
    def get_tipo_estudiante_nombre(self, obj):
        return obj.tipo_estudiante.nombre if obj.tipo_estudiante else None
    
    def get_carrera_nombre(self, obj):
        return obj.carrera.nombre if obj.carrera else None
    
    def get_investigador_nombre(self, obj):
        return obj.investigador.nombre if obj.investigador else None
    
    def get_area_nombre(self, obj):
        return obj.area.nombre if obj.area else None
