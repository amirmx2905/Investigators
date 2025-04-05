from rest_framework import serializers
from investigators.models import Investigador, Linea, DetLinea
from django.db import transaction
from django.db.models import Q
import logging

logger = logging.getLogger(__name__)

class InvestigadorSerializer(serializers.ModelSerializer):
    area_nombre = serializers.SerializerMethodField()
    especialidad_nombre = serializers.SerializerMethodField()
    nivel_snii_nombre = serializers.SerializerMethodField()
    lineas = serializers.SerializerMethodField(read_only=True)
    lineas_ids = serializers.PrimaryKeyRelatedField(
        queryset=Linea.objects.all(),
        many=True,
        required=False,
        write_only=True
    )
    
    class Meta:
        model = Investigador
        fields = [
            'id', 
            'nombre',    
            'correo', 
            'celular',
            'area',
            'area_nombre', 
            'especialidad',
            'especialidad_nombre',
            'nivel_edu',
            'nivel_snii',
            'nivel_snii_nombre',
            'fecha_asignacion_snii',
            'activo',
            'lineas',
            'lineas_ids'
        ]
    
    def get_area_nombre(self, obj):
        return obj.area.nombre if obj.area else None
    
    def get_especialidad_nombre(self, obj):
        return obj.especialidad.nombre_especialidad if obj.especialidad else None
    
    def get_nivel_snii_nombre(self, obj):
        return obj.nivel_snii.nivel if obj.nivel_snii else None
    
    def get_lineas(self, obj):
        return [{'id': det.linea.id, 'nombre': det.linea.nombre} 
                for det in DetLinea.objects.filter(investigador=obj).select_related('linea')]
    
    @transaction.atomic
    def create(self, validated_data):
        lineas_data = validated_data.pop('lineas_ids', [])
        
        investigador = Investigador.objects.create(**validated_data)
        
        for linea in lineas_data:
            DetLinea.objects.create(investigador=investigador, linea=linea)
            
        return investigador
    
    @transaction.atomic
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr != 'lineas_ids':
                setattr(instance, attr, value)
        instance.save()
        
        if 'lineas_ids' not in validated_data:
            return instance
            
        lineas_data = validated_data.get('lineas_ids')
        
        detalles_existentes = list(DetLinea.objects.filter(investigador=instance))
        
        detalles_por_linea = {detalle.linea_id: detalle for detalle in detalles_existentes}
        lineas_nuevas = {linea.id for linea in lineas_data}
        lineas_existentes = set(detalles_por_linea.keys())
        
        if detalles_existentes:
            primer_detalle = detalles_existentes[0]
            
            lineas_a_eliminar = lineas_existentes - lineas_nuevas
            lineas_a_agregar = lineas_nuevas - lineas_existentes
            
            for linea_id in lineas_a_agregar:
                if lineas_a_eliminar:
                    linea_a_eliminar = list(lineas_a_eliminar)[0]
                    detalle = detalles_por_linea[linea_a_eliminar]
                    
                    DetLinea.objects.filter(id=detalle.id).update(linea_id=linea_id)
                    
                    lineas_a_eliminar.remove(linea_a_eliminar)
                    detalles_por_linea[linea_id] = detalles_por_linea.pop(linea_a_eliminar)
                else:
                    DetLinea.objects.create(investigador=instance, linea_id=linea_id)
            
            if lineas_a_eliminar:
                DetLinea.objects.filter(
                    investigador=instance, 
                    linea_id__in=lineas_a_eliminar
                ).delete()
        else:
            for linea_id in lineas_nuevas:
                DetLinea.objects.create(investigador=instance, linea_id=linea_id)
        
        return instance