from drf_spectacular.utils import extend_schema, extend_schema_view
from investigators.models import Linea
from investigators.serializers import LineaSerializer
from investigators.views.base_view import OrderedModelViewSet

@extend_schema_view(
    list=extend_schema(summary="Listar todas las líneas de investigación", tags=["Catálogos"]),
    retrieve=extend_schema(summary="Obtener línea de investigación por ID", tags=["Catálogos"]),
    create=extend_schema(summary="Crear nueva línea de investigación", tags=["Catálogos"]),
    update=extend_schema(summary="Actualizar línea de investigación completa", tags=["Catálogos"]),
    partial_update=extend_schema(summary="Actualizar línea de investigación parcial", tags=["Catálogos"]),
    destroy=extend_schema(summary="Eliminar línea de investigación", tags=["Catálogos"])
)
class LineaViewSet(OrderedModelViewSet):
    queryset = Linea.objects.all()
    serializer_class = LineaSerializer