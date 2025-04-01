from rest_framework import serializers
from investigators.models import Proyecto, DetHerramienta, Herramienta, Investigador, DetProyecto
from django.db import transaction

class ProyectoSerializer(serializers.ModelSerializer):
    lider_nombre = serializers.SerializerMethodField()
    herramientas = serializers.SerializerMethodField(read_only=True)
    herramientas_ids = serializers.PrimaryKeyRelatedField(
        queryset=Herramienta.objects.all(),
        many=True,
        required=False,
        write_only=True
    )
    investigadores = serializers.SerializerMethodField(read_only=True)
    investigadores_ids = serializers.PrimaryKeyRelatedField(
        queryset=Investigador.objects.all(),
        many=True,
        required=False,
        write_only=True
    )
    
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
                'activo',
                'herramientas',
                'herramientas_ids',
                'investigadores',
                'investigadores_ids']
    
    def get_lider_nombre(self, obj):
        return obj.lider.nombre if obj.lider else None
        
    def get_herramientas(self, obj):
        return [{'id': det.herramienta.id, 'nombre': det.herramienta.nombre} 
                for det in DetHerramienta.objects.filter(proyecto=obj).select_related('herramienta')]
    
    def get_investigadores(self, obj):
        return [{'id': det.investigador.id, 'nombre': det.investigador.nombre} 
                for det in DetProyecto.objects.filter(proyecto=obj).select_related('investigador')]
    
    @transaction.atomic
    def create(self, validated_data):
        herramientas_data = validated_data.pop('herramientas_ids', [])
        investigadores_data = validated_data.pop('investigadores_ids', [])
        
        proyecto = Proyecto.objects.create(**validated_data)
        
        for herramienta in herramientas_data:
            DetHerramienta.objects.create(proyecto=proyecto, herramienta=herramienta)
        
        orden = 1
        for investigador in investigadores_data:
            DetProyecto.objects.create(
                proyecto=proyecto, 
                investigador=investigador,
                orden_importancia=orden
            )
            orden += 1
            
        return proyecto
    
    @transaction.atomic
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr not in ['herramientas_ids', 'investigadores_ids']:
                setattr(instance, attr, value)
        instance.save()
        
        if 'herramientas_ids' in validated_data:
            herramientas_data = validated_data.get('herramientas_ids')
            
            DetHerramienta.objects.filter(proyecto=instance).delete()
            
            for herramienta in herramientas_data:
                DetHerramienta.objects.create(proyecto=instance, herramienta=herramienta)
        
        if 'investigadores_ids' in validated_data:
            investigadores_data = validated_data.get('investigadores_ids')
            
            DetProyecto.objects.filter(proyecto=instance).delete()
            
            orden = 1
            for investigador in investigadores_data:
                DetProyecto.objects.create(
                    proyecto=instance, 
                    investigador=investigador,
                    orden_importancia=orden
                )
                orden += 1
        
        return instance