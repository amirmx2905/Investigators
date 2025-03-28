from rest_framework import serializers
from investigators.models import Proyecto

class ProyectoSerializer(serializers.ModelSerializer):
    lider_nombre = serializers.SerializerMethodField()
    
    class Meta:
        model = Proyecto
        fields = ['id',
                'nombre',
                'estado',
                'explicacion',
                'fecha_inicio',
                'fecha_fin',
                'lider',
                'lider_nombre',
                'activo']
    
    def get_lider_nombre(self, obj):
        return obj.lider.nombre if obj.lider else None