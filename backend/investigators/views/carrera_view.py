from drf_spectacular.utils import extend_schema, extend_schema_view
from investigators.models import Carrera
from investigators.serializers import CarreraSerializer
from investigators.views.base_view import OrderedModelViewSet

@extend_schema_view(
    list=extend_schema(summary="Listar todas las carreras", tags=["Catálogos"]),
    retrieve=extend_schema(summary="Obtener carrera por ID", tags=["Catálogos"]),
    create=extend_schema(summary="Crear nueva carrera", tags=["Catálogos"]),
    update=extend_schema(summary="Actualizar carrera completa", tags=["Catálogos"]),
    partial_update=extend_schema(summary="Actualizar carrera parcial", tags=["Catálogos"]),
    destroy=extend_schema(summary="Eliminar carrera", tags=["Catálogos"])
)
class CarreraViewSet(OrderedModelViewSet):
    queryset = Carrera.objects.all()
    serializer_class = CarreraSerializer