from rest_framework import serializers
from investigators.models import Herramienta

class HerramientaSerializer(serializers.ModelSerializer):
    tipo_herramienta = serializers.SerializerMethodField()
    
    class Meta:
        model = Herramienta
        fields = [
                'id',
                'nombre',
                'tipo_herramienta_id',
                'tipo_herramienta'
            ]   

    def get_tipo_herramienta(self, obj):
        return obj.tipo_herramienta.nombre if obj.tipo_herramienta else None