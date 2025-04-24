import json
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from django.apps import apps

from investigators.models import (
    Unidad, Area, Especialidad, NivelEducacion, NivelSNII, Carrera,
    TipoEstudiante, Investigador, JefeArea, Estudiante, Linea, DetLinea,
    TipoHerramienta, Herramienta, Proyecto, DetProyecto, DetHerramienta,
    Articulo, DetArticulo, TipoEvento, RolEvento, Evento, DetEvento, Usuario
)

MODEL_MAPPING = {
    'investigators.unidad': Unidad,
    'investigators.area': Area,
    'investigators.especialidad': Especialidad,
    'investigators.niveleducacion': NivelEducacion,
    'investigators.nivelsnii': NivelSNII,
    'investigators.carrera': Carrera,
    'investigators.tipoestudiante': TipoEstudiante,
    'investigators.investigador': Investigador,
    'investigators.jefearea': JefeArea,
    'investigators.estudiante': Estudiante,
    'investigators.linea': Linea,
    'investigators.detlinea': DetLinea,
    'investigators.tipoherramienta': TipoHerramienta,
    'investigators.herramienta': Herramienta,
    'investigators.proyecto': Proyecto,
    'investigators.detproyecto': DetProyecto,
    'investigators.detherramienta': DetHerramienta,
    'investigators.articulo': Articulo,
    'investigators.detarticulo': DetArticulo,
    'investigators.tipoevento': TipoEvento,
    'investigators.rolevento': RolEvento,
    'investigators.evento': Evento,
    'investigators.detevento': DetEvento,
    'investigators.usuario': Usuario,
}

# Define relaciones entre modelos para la importación
MODEL_RELATIONSHIPS = {
    'investigators.area': {
        'unidad': ('investigators.unidad', Unidad),
    },
    'investigators.investigador': {
        'area': ('investigators.area', Area),
        'nivel_edu': ('investigators.niveleducacion', NivelEducacion),
        'especialidad': ('investigators.especialidad', Especialidad),
        'nivel_snii': ('investigators.nivelsnii', NivelSNII),
    },
    'investigators.jefearea': {
        'area': ('investigators.area', Area),
        'investigador': ('investigators.investigador', Investigador),
    },
    'investigators.estudiante': {
        'tipo_estudiante': ('investigators.tipoestudiante', TipoEstudiante),
        'carrera': ('investigators.carrera', Carrera),
        'investigador': ('investigators.investigador', Investigador),
        'area': ('investigators.area', Area),
    },
    'investigators.detlinea': {
        'linea': ('investigators.linea', Linea),
        'investigador': ('investigators.investigador', Investigador),
    },
    'investigators.herramienta': {
        'tipo_herramienta': ('investigators.tipoherramienta', TipoHerramienta),
    },
    'investigators.proyecto': {
        'lider': ('investigators.investigador', Investigador),
    },
    'investigators.detproyecto': {
        'proyecto': ('investigators.proyecto', Proyecto),
        'investigador': ('investigators.investigador', Investigador),
    },
    'investigators.detherramienta': {
        'proyecto': ('investigators.proyecto', Proyecto),
        'herramienta': ('investigators.herramienta', Herramienta),
    },
    'investigators.detarticulo': {
        'articulo': ('investigators.articulo', Articulo),
        'investigador': ('investigators.investigador', Investigador),
    },
    'investigators.evento': {
        'tipo_evento': ('investigators.tipoevento', TipoEvento),
    },
    'investigators.detevento': {
        'evento': ('investigators.evento', Evento),
        'investigador': ('investigators.investigador', Investigador),
        'rol_evento': ('investigators.rolevento', RolEvento),
    },
    'investigators.usuario': {
        'investigador': ('investigators.investigador', Investigador),
        'estudiante': ('investigators.estudiante', Estudiante),
    },
}

class JSONImportView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = []  # Permitir acceso sin autenticación para pruebas iniciales
    
    @extend_schema(
        summary="Importar datos desde archivo JSON",
        description="Permite importar datos a la base de datos desde un archivo JSON con formato de Django fixtures",
        tags=["Importación"],
        request={
            'multipart/form-data': {
                'type': 'object',
                'properties': {
                    'file': {'type': 'string', 'format': 'binary'}
                },
                'required': ['file']
            }
        },
        responses={
            201: OpenApiResponse(description="Datos importados correctamente"),
            400: OpenApiResponse(description="Error en el formato del archivo"),
            500: OpenApiResponse(description="Error interno del servidor")
        }
    )
    @transaction.atomic
    def post(self, request):
        try:
            json_file = request.FILES.get('file')
            if not json_file:
                return Response({"detail": "No se recibió ningún archivo"}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                data = json.load(json_file)
            except json.JSONDecodeError:
                return Response({"detail": "El archivo no contiene JSON válido"}, status=status.HTTP_400_BAD_REQUEST)
            
            if not isinstance(data, list):
                return Response({"detail": "El JSON debe ser una lista de objetos"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Agrupar los objetos por modelo para una importación ordenada
            objects_by_model = {}
            for item in data:
                if 'model' not in item or 'pk' not in item or 'fields' not in item:
                    continue
                    
                model_name = item['model']
                if model_name not in objects_by_model:
                    objects_by_model[model_name] = []
                    
                objects_by_model[model_name].append(item)
            
            # Orden de importación para respetar las dependencias
            import_order = [
                'investigators.unidad',
                'investigators.area',
                'investigators.especialidad',
                'investigators.niveleducacion',
                'investigators.nivelsnii',
                'investigators.carrera', 
                'investigators.tipoestudiante',
                'investigators.tipoherramienta',
                'investigators.tipoevento',
                'investigators.rolevento',
                'investigators.investigador',
                'investigators.herramienta',
                'investigators.linea',
                'investigators.jefearea',
                'investigators.estudiante',
                'investigators.proyecto',
                'investigators.articulo',
                'investigators.evento',
                'investigators.detlinea',
                'investigators.detproyecto',
                'investigators.detherramienta',
                'investigators.detarticulo',
                'investigators.detevento',
                'investigators.usuario',
            ]
            
            imported_counts = {}
            
            # Importar en el orden correcto
            for model_name in import_order:
                if model_name not in objects_by_model:
                    continue
                    
                Model = MODEL_MAPPING.get(model_name)
                if not Model:
                    continue
                    
                items = objects_by_model[model_name]
                imported_count = 0
                
                for item in items:
                    pk = item['pk']
                    fields = item['fields'].copy()
                    
                    # Procesar las relaciones (ForeignKey)
                    if model_name in MODEL_RELATIONSHIPS:
                        relationships = MODEL_RELATIONSHIPS[model_name]
                        for field_name, (related_model_name, RelatedModel) in relationships.items():
                            if field_name in fields and fields[field_name] is not None:
                                try:
                                    # Buscar la instancia relacionada por su ID
                                    related_id = fields[field_name]
                                    related_instance = RelatedModel.objects.get(pk=related_id)
                                    fields[field_name] = related_instance
                                except RelatedModel.DoesNotExist:
                                    # Si no existe la relación, establece None o maneja según sea necesario
                                    fields[field_name] = None
                    
                    # Verificar si el objeto ya existe
                    existing_obj = Model.objects.filter(pk=pk).first()
                    
                    if existing_obj:
                        # Actualizar objeto existente
                        for field_name, value in fields.items():
                            setattr(existing_obj, field_name, value)
                        existing_obj.save()
                    else:
                        # Crear nuevo objeto
                        Model.objects.create(id=pk, **fields)
                    
                    imported_count += 1
                
                imported_counts[model_name] = imported_count
            
            return Response({
                "detail": "Importación completada con éxito",
                "imported_counts": imported_counts
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            import traceback
            print(traceback.format_exc())  # Imprimir traza completa en la consola para depuración
            # Rollback automático gracias a transaction.atomic
            return Response({
                "detail": f"Error durante la importación: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)