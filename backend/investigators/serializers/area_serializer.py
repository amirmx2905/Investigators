from rest_framework import serializers
from investigators.models import Area

class AreaSerializer(serializers.ModelSerializer):
    area_nombre = serializers.SerializerMethodField()
    
    class Meta:
        model = Area
        fields = [
            'id',
            'nombre',
            'unidad',
            'unidad_nombre',
        ]
        
    def get_area_nombre(self, obj):
        return obj.area.nombre if obj.area else None