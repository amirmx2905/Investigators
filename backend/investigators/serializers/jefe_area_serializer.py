from rest_framework import serializers
from investigators.models import JefeArea

class JefeAreaSerializer(serializers.ModelSerializer):
    area_nombre = serializers.SerializerMethodField()
    investigador_nombre = serializers.SerializerMethodField()
    
    class Meta:
        model = JefeArea
        fields = [
            'id',
            'fecha_inicio',
            'fecha_fin',
            'activo',
            'area',
            'area_nombre',
            'investigador',
            'investigador_nombre'
        ]
        
    def get_area_nombre(self, obj):
        return obj.area.nombre if obj.area else None
    
    def get_investigador_nombre(self, obj):
        return obj.investigador.nombre if obj.investigador else None