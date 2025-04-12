from drf_spectacular.utils import extend_schema, extend_schema_view
from investigators.models import TipoEstudiante
from investigators.serializers import TipoEstudianteSerializer
from investigators.views.base_view import OrderedModelViewSet

@extend_schema_view(
    list=extend_schema(summary="Listar todos los tipos de estudiante", tags=["Catálogos"]),
    retrieve=extend_schema(summary="Obtener tipo de estudiante por ID", tags=["Catálogos"]),
    create=extend_schema(summary="Crear nuevo tipo de estudiante", tags=["Catálogos"]),
    update=extend_schema(summary="Actualizar tipo de estudiante completo", tags=["Catálogos"]),
    partial_update=extend_schema(summary="Actualizar tipo de estudiante parcial", tags=["Catálogos"]),
    destroy=extend_schema(summary="Eliminar tipo de estudiante", tags=["Catálogos"])
)
class TipoEstudianteViewSet(OrderedModelViewSet):
    queryset = TipoEstudiante.objects.all()
    serializer_class = TipoEstudianteSerializer