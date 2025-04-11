from drf_spectacular.utils import extend_schema, extend_schema_view
from investigators.models import NivelSNII
from investigators.serializers import NivelSNIISerializer
from investigators.views.base_view import OrderedModelViewSet

@extend_schema_view(
    list=extend_schema(summary="Listar todos los niveles SNI", tags=["Catálogos"]),
    retrieve=extend_schema(summary="Obtener nivel SNI por ID", tags=["Catálogos"]),
    create=extend_schema(summary="Crear nuevo nivel SNI", tags=["Catálogos"]),
    update=extend_schema(summary="Actualizar nivel SNI completo", tags=["Catálogos"]),
    partial_update=extend_schema(summary="Actualizar nivel SNI parcial", tags=["Catálogos"]),
    destroy=extend_schema(summary="Eliminar nivel SNI", tags=["Catálogos"])
)
class NivelSNIIViewSet(OrderedModelViewSet):
    queryset = NivelSNII.objects.all()
    serializer_class = NivelSNIISerializer