from drf_spectacular.utils import extend_schema, extend_schema_view
from investigators.models import Unidad
from investigators.serializers import UnidadSerializer
from investigators.views.base_view import OrderedModelViewSet

@extend_schema_view(
    list=extend_schema(summary="Listar todas las unidades", tags=["Catálogos"]),
    retrieve=extend_schema(summary="Obtener unidad por ID", tags=["Catálogos"]),
    create=extend_schema(summary="Crear nueva unidad", tags=["Catálogos"]),
    update=extend_schema(summary="Actualizar unidad completa", tags=["Catálogos"]),
    partial_update=extend_schema(summary="Actualizar unidad parcial", tags=["Catálogos"]),
    destroy=extend_schema(summary="Eliminar unidad", tags=["Catálogos"])
)
class UnidadViewSet(OrderedModelViewSet):
    queryset = Unidad.objects.all()
    serializer_class = UnidadSerializer