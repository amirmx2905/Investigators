from drf_spectacular.utils import extend_schema, extend_schema_view
from investigators.models import Herramienta
from investigators.serializers import HerramientaSerializer
from investigators.views.base_view import OrderedModelViewSet

@extend_schema_view(
    list=extend_schema(summary="Listar todas las herramientas", tags=["Herramientas"]),
    retrieve=extend_schema(summary="Obtener herramienta por ID", tags=["Herramientas"]),
    create=extend_schema(summary="Crear nueva herramienta", tags=["Herramientas"]),
    update=extend_schema(summary="Actualizar herramienta completa", tags=["Herramientas"]),
    partial_update=extend_schema(summary="Actualizar herramienta parcial", tags=["Herramientas"]),
    destroy=extend_schema(summary="Eliminar herramienta", tags=["Herramientas"])
)
class HerramientaViewSet(OrderedModelViewSet):
    queryset = Herramienta.objects.all()
    serializer_class = HerramientaSerializer