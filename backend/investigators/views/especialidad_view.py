from drf_spectacular.utils import extend_schema, extend_schema_view
from investigators.models import Especialidad
from investigators.serializers import EspecialidadSerializer
from investigators.views.base_view import OrderedModelViewSet

@extend_schema_view(
    list=extend_schema(summary="Listar todas las especialidades", tags=["Catálogos"]),
    retrieve=extend_schema(summary="Obtener especialidad por ID", tags=["Catálogos"]),
    create=extend_schema(summary="Crear nueva especialidad", tags=["Catálogos"]),
    update=extend_schema(summary="Actualizar especialidad completa", tags=["Catálogos"]),
    partial_update=extend_schema(summary="Actualizar especialidad parcial", tags=["Catálogos"]),
    destroy=extend_schema(summary="Eliminar especialidad", tags=["Catálogos"])
)
class EspecialidadViewSet(OrderedModelViewSet):
    queryset = Especialidad.objects.all()
    serializer_class = EspecialidadSerializer