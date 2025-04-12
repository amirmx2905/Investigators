from drf_spectacular.utils import extend_schema, extend_schema_view
from investigators.models import TipoHerramienta
from investigators.serializers import TipoHerramientaSerializer
from investigators.views.base_view import OrderedModelViewSet

@extend_schema_view(
    list=extend_schema(summary="Listar todos los tipos de herramienta", tags=["Catálogos"]),
    retrieve=extend_schema(summary="Obtener tipo de herramienta por ID", tags=["Catálogos"]),
    create=extend_schema(summary="Crear nuevo tipo de herramienta", tags=["Catálogos"]),
    update=extend_schema(summary="Actualizar tipo de herramienta completo", tags=["Catálogos"]),
    partial_update=extend_schema(summary="Actualizar tipo de herramienta parcial", tags=["Catálogos"]),
    destroy=extend_schema(summary="Eliminar tipo de herramienta", tags=["Catálogos"])
)
class TipoHerramientaViewSet(OrderedModelViewSet):
    queryset = TipoHerramienta.objects.all()
    serializer_class = TipoHerramientaSerializer