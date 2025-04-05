from rest_framework import serializers
from investigators.models import TipoEvento, Evento

class TipoEventoSerializer(serializers.ModelSerializer):
    eventos_count = serializers.SerializerMethodField()
    
    class Meta:
        model = TipoEvento
        fields = ('id', 'nombre', 'eventos_count')
    
    def get_eventos_count(self, obj):
        return Evento.objects.filter(tipo_evento=obj).count()