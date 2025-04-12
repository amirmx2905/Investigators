from drf_spectacular.utils import extend_schema, extend_schema_view
from investigators.models import Estudiante
from investigators.serializers import EstudianteSerializer
from investigators.views.base_view import OrderedModelViewSet

@extend_schema_view(
    list=extend_schema(summary="Listar todos los estudiantes", tags=["Estudiantes"]),
    retrieve=extend_schema(summary="Obtener estudiante por ID", tags=["Estudiantes"]),
    create=extend_schema(summary="Crear nuevo estudiante", tags=["Estudiantes"]),
    update=extend_schema(summary="Actualizar estudiante completo", tags=["Estudiantes"]),
    partial_update=extend_schema(summary="Actualizar estudiante parcial", tags=["Estudiantes"]),
    destroy=extend_schema(summary="Eliminar estudiante", tags=["Estudiantes"])
)
class EstudianteViewSet(OrderedModelViewSet):
    queryset = Estudiante.objects.all()
    serializer_class = EstudianteSerializer