from rest_framework import serializers
from investigators.models import Area

class AreaSerializer(serializers.ModelSerializer):
    unidad_nombre = serializers.SerializerMethodField()
    
    class Meta:
        model = Area
        fields = [
            'id',
            'nombre',
            'unidad',
            'unidad_nombre',
        ]
        
    def get_unidad_nombre(self, obj):
        return obj.unidad.nombre if obj.unidad else None