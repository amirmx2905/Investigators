from rest_framework import serializers
from investigators.models import Investigador, Linea, DetLinea

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
    
    def create(self, validated_data):
        lineas_data = validated_data.pop('lineas_ids', [])
        
        investigador = Investigador.objects.create(**validated_data)
        
        for linea in lineas_data:
            DetLinea.objects.create(investigador=investigador, linea=linea)
            
        return investigador
    
    def update(self, instance, validated_data):
        lineas_data = validated_data.pop('lineas_ids', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if lineas_data is not None:
            DetLinea.objects.filter(investigador=instance).delete()
            
            for linea in lineas_data:
                DetLinea.objects.create(investigador=instance, linea=linea)
        
        return instance