from drf_spectacular.utils import extend_schema, extend_schema_view
from investigators.models import Articulo
from investigators.serializers import ArticuloSerializer
from investigators.permissions import CanCreateArticuloPermission
from investigators.views.base_view import OrderedModelViewSet

@extend_schema_view(
    list=extend_schema(summary="Listar todos los artículos", tags=["Artículos"]),
    retrieve=extend_schema(summary="Obtener artículo por ID", tags=["Artículos"]),
    create=extend_schema(summary="Crear nuevo artículo", tags=["Artículos"]),
    update=extend_schema(summary="Actualizar artículo completo", tags=["Artículos"]),
    partial_update=extend_schema(summary="Actualizar artículo parcial", tags=["Artículos"]),
    destroy=extend_schema(summary="Eliminar artículo", tags=["Artículos"])
)
class ArticuloViewSet(OrderedModelViewSet):
    queryset = Articulo.objects.all()
    serializer_class = ArticuloSerializer
    permission_classes = [CanCreateArticuloPermission]