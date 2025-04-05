from rest_framework import serializers
from investigators.models import Evento, DetEvento, Investigador, RolEvento, TipoEvento
from django.db import transaction

class TipoEventoNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoEvento
        fields = ('id', 'nombre')

class InvestigadorEventoSerializer(serializers.ModelSerializer):
    nombre = serializers.CharField(source='investigador.nombre')
    correo = serializers.CharField(source='investigador.correo')
    rol_nombre = serializers.CharField(source='rol_evento.nombre')
    
    class Meta:
        model = DetEvento
        fields = ('investigador_id', 'rol_evento_id', 'nombre', 'correo', 'rol_nombre')

class EventoListSerializer(serializers.ModelSerializer):
    tipo_evento_nombre = serializers.CharField(source='tipo_evento.nombre', read_only=True)
    num_participantes = serializers.SerializerMethodField()
    
    class Meta:
        model = Evento
        fields = ['id', 'nombre_evento', 'descripcion', 'fecha_inicio', 'fecha_fin', 
                  'lugar', 'empresa_invita', 'tipo_evento', 'tipo_evento_nombre', 'num_participantes']
    
    def get_num_participantes(self, obj):
        return obj.investigadores.count()

class EventoDetailSerializer(serializers.ModelSerializer):
    tipo_evento_nombre = serializers.CharField(source='tipo_evento.nombre', read_only=True)
    tipo_evento_obj = TipoEventoNestedSerializer(source='tipo_evento', read_only=True)
    investigadores = serializers.SerializerMethodField()
    
    class Meta:
        model = Evento
        fields = ['id', 'nombre_evento', 'descripcion', 'fecha_inicio', 'fecha_fin', 
                  'lugar', 'empresa_invita', 'tipo_evento', 'tipo_evento_nombre', 
                  'tipo_evento_obj', 'investigadores']
    
    def get_investigadores(self, obj):
        detalles = DetEvento.objects.filter(evento=obj).select_related('investigador', 'rol_evento')
        result = []
        for det in detalles:
            result.append({
                'investigador_id': det.investigador_id,
                'rol_evento_id': det.rol_evento_id,
                'nombre': det.investigador.nombre,
                'correo': det.investigador.correo,
                'rol_nombre': det.rol_evento.nombre
            })
        return result

class EventoSerializer(serializers.ModelSerializer):
    tipo_evento_nombre = serializers.CharField(source='tipo_evento.nombre', read_only=True)
    tipo_evento_obj = TipoEventoNestedSerializer(source='tipo_evento', read_only=True)
    investigadores = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Evento
        fields = ['id', 'nombre_evento', 'descripcion', 'fecha_inicio', 'fecha_fin', 
                  'lugar', 'empresa_invita', 'tipo_evento', 'tipo_evento_nombre', 
                  'tipo_evento_obj', 'investigadores']
    
    def get_investigadores(self, obj):
        detalles = DetEvento.objects.filter(evento=obj).select_related('investigador', 'rol_evento')
        result = []
        for det in detalles:
            result.append({
                'investigador_id': det.investigador_id,
                'rol_evento_id': det.rol_evento_id,
                'nombre': det.investigador.nombre,
                'correo': det.investigador.correo,
                'rol_nombre': det.rol_evento.nombre
            })
        return result
    
    @transaction.atomic
    def create(self, validated_data):
        investigadores_data = self.context.get('request').data.get('investigadores', [])
        
        evento = Evento.objects.create(**validated_data)
        
        for inv_data in investigadores_data:
            inv_id = inv_data.get('investigador_id')
            rol_id = inv_data.get('rol_evento_id')
            
            if inv_id and rol_id:
                DetEvento.objects.create(
                    evento=evento,
                    investigador_id=inv_id,
                    rol_evento_id=rol_id
                )
        
        return evento
    
    @transaction.atomic
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        investigadores_data = self.context.get('request').data.get('investigadores', [])
        
        if investigadores_data is not None:

            relaciones_existentes = {}
            for detalle in DetEvento.objects.filter(evento=instance):
                clave = (detalle.investigador_id, detalle.rol_evento_id)
                relaciones_existentes[clave] = detalle
            
            relaciones_a_mantener = set()
            
            for inv_data in investigadores_data:
                inv_id = inv_data.get('investigador_id')
                rol_id = inv_data.get('rol_evento_id')
                
                if not inv_id or not rol_id:
                    continue
                
                clave = (inv_id, rol_id)
                
                if clave in relaciones_existentes:
                    relaciones_a_mantener.add(clave)
                else:
                    DetEvento.objects.create(
                        evento=instance,
                        investigador_id=inv_id,
                        rol_evento_id=rol_id
                    )
            
            for clave, detalle in relaciones_existentes.items():
                if clave not in relaciones_a_mantener:
                    detalle.delete()
        
        return instance