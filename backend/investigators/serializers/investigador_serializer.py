import logging
from rest_framework import serializers
from django.db import transaction
from django.db.models import Q
from investigators.models import (
    Investigador, Linea, DetLinea, Proyecto, DetProyecto, Evento, DetEvento,
    Articulo, DetArticulo, Estudiante, JefeArea, Area, Unidad
)

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

class InvestigadorDetalleSerializer(serializers.ModelSerializer):
    area_nombre = serializers.SerializerMethodField()
    unidad_nombre = serializers.SerializerMethodField()
    especialidad_nombre = serializers.SerializerMethodField()
    nivel_edu_nombre = serializers.SerializerMethodField()
    nivel_snii_nombre = serializers.SerializerMethodField()
    
    proyectos_liderados = serializers.SerializerMethodField()
    proyectos_participante = serializers.SerializerMethodField()
    
    eventos = serializers.SerializerMethodField()
    articulos = serializers.SerializerMethodField()
    estudiantes = serializers.SerializerMethodField()
    
    es_jefe_area = serializers.SerializerMethodField()
    jefe_de_areas = serializers.SerializerMethodField()
    
    lineas = serializers.SerializerMethodField()
    
    class Meta:
        model = Investigador
        fields = [
            'id', 'nombre', 'correo', 'celular', 'activo',
            'area', 'area_nombre', 'unidad_nombre',
            'especialidad', 'especialidad_nombre',
            'nivel_edu', 'nivel_edu_nombre',
            'nivel_snii', 'nivel_snii_nombre', 'fecha_asignacion_snii',
            'lineas',
            'proyectos_liderados', 'proyectos_participante',
            'eventos', 'articulos', 'estudiantes',
            'es_jefe_area', 'jefe_de_areas'
        ]
    
    def get_area_nombre(self, obj):
        return obj.area.nombre if obj.area else None
    
    def get_unidad_nombre(self, obj):
        return obj.area.unidad.nombre if obj.area and obj.area.unidad else None
    
    def get_especialidad_nombre(self, obj):
        return obj.especialidad.nombre_especialidad if obj.especialidad else None
    
    def get_nivel_edu_nombre(self, obj):
        return obj.nivel_edu.nivel if obj.nivel_edu else None
    
    def get_nivel_snii_nombre(self, obj):
        return obj.nivel_snii.nivel if obj.nivel_snii else None
    
    def get_lineas(self, obj):
        from investigators.serializers.linea_serializer import LineaSerializer
        lineas = obj.linea_set.all() if hasattr(obj, 'linea_set') else []
        return LineaSerializer(lineas, many=True).data
    
    def get_proyectos_liderados(self, obj):
        from investigators.serializers.proyecto_serializer import ProyectoSerializer
        proyectos = obj.proyectos_liderados.all()
        return ProyectoSerializer(proyectos, many=True).data
    
    def get_proyectos_participante(self, obj):
        results = []
        participaciones = DetProyecto.objects.filter(investigador=obj)
        
        for part in participaciones:
            if part.proyecto.lider_id != obj.id:  # No incluir proyectos donde es líder
                results.append({
                    'id': part.proyecto.id,
                    'nombre': part.proyecto.nombre,
                    'estado': part.proyecto.estado,
                    'fecha_inicio': part.proyecto.fecha_inicio,
                    'fecha_fin': part.proyecto.fecha_fin,
                    'orden_importancia': part.orden_importancia
                })
        return results
    
    def get_eventos(self, obj):
        results = []
        participaciones = DetEvento.objects.filter(investigador=obj)
        
        for part in participaciones:
            results.append({
                'id': part.evento.id,
                'nombre': part.evento.nombre_evento,
                'tipo': part.evento.tipo_evento.nombre if part.evento.tipo_evento else None,
                'fecha_inicio': part.evento.fecha_inicio,
                'fecha_fin': part.evento.fecha_fin,
                'lugar': part.evento.lugar,
                'rol': part.rol_evento.nombre if part.rol_evento else None
            })
        return results
    
    def get_articulos(self, obj):
        results = []
        participaciones = DetArticulo.objects.filter(investigador=obj)
        
        for part in participaciones:
            results.append({
                'id': part.articulo.id,
                'nombre': part.articulo.nombre_articulo,
                'revista': part.articulo.nombre_revista,
                'fecha': part.articulo.fecha_publicacion,
                'orden_autor': part.orden_autor,
                'es_autor_principal': part.orden_autor == 1
            })
        return results
    
    def get_estudiantes(self, obj):
        from investigators.serializers.estudiante_serializer import EstudianteSerializer
        estudiantes = Estudiante.objects.filter(investigador=obj)
        return EstudianteSerializer(estudiantes, many=True).data
    
    def get_es_jefe_area(self, obj):
        jefatura_activa = JefeArea.objects.filter(investigador=obj, activo=True).exists()
        return jefatura_activa
    
    def get_jefe_de_areas(self, obj):
        results = []
        jefaturas = JefeArea.objects.filter(investigador=obj)
        
        for jef in jefaturas:
            results.append({
                'id': jef.id,
                'area_id': jef.area.id,
                'area_nombre': jef.area.nombre,
                'fecha_inicio': jef.fecha_inicio,
                'fecha_fin': jef.fecha_fin,
                'activo': jef.activo
            })
        return results