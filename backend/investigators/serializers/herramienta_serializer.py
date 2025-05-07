from rest_framework import serializers
from investigators.models import Herramienta, TipoHerramienta

class HerramientaSerializer(serializers.ModelSerializer):
    tipo_herramienta_nombre = serializers.SerializerMethodField()
    
    class Meta:
        model = Herramienta
        fields = [
            'id',
            'nombre',
            'tipo_herramienta_id',
            'tipo_herramienta_nombre'
        ]
    
    def get_tipo_herramienta_nombre(self, obj):
        return obj.tipo_herramienta.nombre if obj.tipo_herramienta_id else None
    
    def validate(self, data):
        """
        Asegurarse de que tipo_herramienta_id siempre tenga un valor.
        """
        # Si no se proporciona tipo_herramienta_id, asignaremos el primer tipo de herramienta disponible
        if 'tipo_herramienta_id' not in data or data['tipo_herramienta_id'] is None:
            # Obtener el primer tipo de herramienta (como valor por defecto)
            primer_tipo = TipoHerramienta.objects.first()
            if primer_tipo:
                data['tipo_herramienta_id'] = primer_tipo.id
            else:
                # Si no hay tipos de herramienta, esto seguirá fallando, pero al menos avisamos
                raise serializers.ValidationError(
                    {"tipo_herramienta_id": "No hay tipos de herramienta disponibles y este campo es obligatorio."}
                )
        
        return data