from drf_spectacular.utils import extend_schema, extend_schema_view
from investigators.models import JefeArea
from investigators.serializers import JefeAreaSerializer
from investigators.views.base_view import OrderedModelViewSet

@extend_schema_view(
    list=extend_schema(summary="Listar todos los jefes de área", tags=["Catálogos"]),
    retrieve=extend_schema(summary="Obtener jefe de área por ID", tags=["Catálogos"]),
    create=extend_schema(summary="Crear nuevo jefe de área", tags=["Catálogos"]),
    update=extend_schema(summary="Actualizar jefe de área completo", tags=["Catálogos"]),
    partial_update=extend_schema(summary="Actualizar jefe de área parcial", tags=["Catálogos"]),
    destroy=extend_schema(summary="Eliminar jefe de área", tags=["Catálogos"])
)
class JefeAreaViewSet(OrderedModelViewSet):
    queryset = JefeArea.objects.all()
    serializer_class = JefeAreaSerializer