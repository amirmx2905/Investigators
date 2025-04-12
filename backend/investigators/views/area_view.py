from drf_spectacular.utils import extend_schema, extend_schema_view
from investigators.models import Area
from investigators.serializers import AreaSerializer
from investigators.views.base_view import OrderedModelViewSet

@extend_schema_view(
    list=extend_schema(summary="Listar todas las áreas", tags=["Catálogos"]),
    retrieve=extend_schema(summary="Obtener área por ID", tags=["Catálogos"]),
    create=extend_schema(summary="Crear nueva área", tags=["Catálogos"]),
    update=extend_schema(summary="Actualizar área completa", tags=["Catálogos"]),
    partial_update=extend_schema(summary="Actualizar área parcial", tags=["Catálogos"]),
    destroy=extend_schema(summary="Eliminar área", tags=["Catálogos"])
)
class AreaViewSet(OrderedModelViewSet):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer