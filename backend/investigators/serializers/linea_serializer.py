from rest_framework import serializers
from investigators.models import Linea, DetLinea, Investigador
from django.db import transaction
from django.db.models import Q

# Actualizar LineaListSerializer
class LineaListSerializer(serializers.ModelSerializer):
    num_investigadores = serializers.SerializerMethodField()
    
    class Meta:
        model = Linea
        fields = ['id', 'nombre', 'num_investigadores', 'reconocimiento_institucional']
    
    def get_num_investigadores(self, obj):
        return obj.investigadores.count()

class InvestigadorLineaSerializer(serializers.ModelSerializer):
    nombre = serializers.CharField(read_only=True)
    correo = serializers.EmailField(read_only=True)
    
    class Meta:
        model = Investigador
        fields = ['id', 'nombre', 'correo']

# Actualizar LineaDetailSerializer
class LineaDetailSerializer(serializers.ModelSerializer):
    investigadores = serializers.SerializerMethodField()
    
    class Meta:
        model = Linea
        fields = ['id', 'nombre', 'investigadores', 'reconocimiento_institucional']
    
    def get_investigadores(self, obj):
        investigators = obj.investigadores.all()
        return InvestigadorLineaSerializer(investigators, many=True).data

# Actualizar LineaSerializer
class LineaSerializer(serializers.ModelSerializer):
    investigadores = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Investigador.objects.all(), required=False
    )
    
    class Meta:
        model = Linea
        fields = ['id', 'nombre', 'investigadores', 'reconocimiento_institucional']
    
    @transaction.atomic
    def create(self, validated_data):
        investigadores = validated_data.pop('investigadores', [])
        
        linea = Linea.objects.create(**validated_data)
        
        for investigador in investigadores:
            detalle_existente = DetLinea.objects.filter(investigador=investigador).first()
            
            if detalle_existente:
                detalle_existente.linea = linea
                detalle_existente.save(update_fields=['linea'])
            else:
                DetLinea.objects.create(linea=linea, investigador=investigador)
        
        return linea
    
    @transaction.atomic
    def update(self, instance, validated_data):
        instance.nombre = validated_data.get('nombre', instance.nombre)
        # Añadir explícitamente la actualización del campo reconocimiento_institucional
        if 'reconocimiento_institucional' in validated_data:
            instance.reconocimiento_institucional = validated_data.get('reconocimiento_institucional')
        instance.save()
        
        # Resto del código para manejar investigadores...
        if 'investigadores' in validated_data:
            nuevos_investigadores = validated_data.pop('investigadores')
            nuevos_ids = {inv.id for inv in nuevos_investigadores}
            
            detalles_actuales = list(DetLinea.objects.filter(
                Q(linea=instance) | Q(investigador_id__in=nuevos_ids)
            ).select_related('investigador'))
            
            detalles_por_investigador = {d.investigador_id: d for d in detalles_actuales}
            
            ids_actuales_en_linea = {d.investigador_id for d in detalles_actuales if d.linea_id == instance.id}
            
            for inv_id in nuevos_ids:
                if inv_id in detalles_por_investigador:
                    detalle = detalles_por_investigador[inv_id]
                    if detalle.linea_id != instance.id:
                        detalle.linea = instance
                        detalle.save(update_fields=['linea'])
                else:
                    DetLinea.objects.create(
                        linea=instance,
                        investigador_id=inv_id
                    )
            
            a_eliminar = ids_actuales_en_linea - nuevos_ids
            if a_eliminar:
                DetLinea.objects.filter(linea=instance, investigador_id__in=a_eliminar).delete()
        
        return instance
