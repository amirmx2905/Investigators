from drf_spectacular.utils import extend_schema, extend_schema_view
from investigators.models import NivelEducacion
from investigators.serializers import NivelEducacionSerializer
from investigators.views.base_view import OrderedModelViewSet

@extend_schema_view(
    list=extend_schema(summary="Listar todos los niveles de educación", tags=["Catálogos"]),
    retrieve=extend_schema(summary="Obtener nivel de educación por ID", tags=["Catálogos"]),
    create=extend_schema(summary="Crear nuevo nivel de educación", tags=["Catálogos"]),
    update=extend_schema(summary="Actualizar nivel de educación completo", tags=["Catálogos"]),
    partial_update=extend_schema(summary="Actualizar nivel de educación parcial", tags=["Catálogos"]),
    destroy=extend_schema(summary="Eliminar nivel de educación", tags=["Catálogos"])
)
class NivelEducacionViewSet(OrderedModelViewSet):
    queryset = NivelEducacion.objects.all()
    serializer_class = NivelEducacionSerializer