from rest_framework import serializers
from investigators.models import RolEvento, DetEvento

class RolEventoSerializer(serializers.ModelSerializer):
    eventos_count = serializers.SerializerMethodField()
    
    class Meta:
        model = RolEvento
        fields = ('id', 'nombre', 'eventos_count')
    
    def get_eventos_count(self, obj):
        return DetEvento.objects.filter(rol_evento=obj).count()